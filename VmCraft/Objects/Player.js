import * as Three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as Utils from "../Utils.js";
import * as Gui from "../Gui.js";

const height = 1.8;
const eyeHeight = height - 0.2;
const eyeHeightSeat = height - 0.5;
const deadZone = Math.PI / 180;

export class Player {
    constructor(gameBasic, pos) {
        this.gameBasic = gameBasic;
        this.data = {
            pos: pos,
            fly: true,
            speed: 5,
            pointerSpeed: 1.5,
            runningSpeedMultiplier: 2,
            flightSpeedMultiplier: 2,
            seatSpeedMultiplier: 0.5
        };
        this.oldControlLocked = false;

        // ---- Добавлено для физики ----
        this.velocity = new Three.Vector3(0, 0, 0);
        this.onGround = false;
        this.gravity = 25;                 // ускорение вниз (блок/с²)
        this.jumpSpeed = 8;                // начальная скорость прыжка
        this.terminalVelocity = -50;       // ограничение скорости падения
        this.spaceDown = false
    }

    init() {
        this.abortController = new AbortController();

        // ------------------ camera
        this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(this.data.pos.x, this.data.pos.y + eyeHeight, this.data.pos.z);
        this.camera.lookAt(this.data.pos.x + 1, this.data.pos.y + eyeHeight, this.data.pos.z);

        // ------------------ controls
        this.controls = new PointerLockControls(this.camera, this.gameBasic.renderer.domElement);
        this.controls.pointerSpeed = this.data.pointerSpeed;
        this.controls.minPolarAngle = deadZone;
        this.controls.maxPolarAngle = Math.PI - deadZone;

        this.gameBasic.renderer.domElement.addEventListener("click", () => {
            if (!Gui.isControlLocked()) {
                this.controls.lock();
            }
        }, { signal: this.abortController.signal });

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            up: false,
            down: false,
            sprint: false
        };

        const onDoubleSpace = Utils.detectDoubleKey("Space", () => {
            this.data.fly = !this.data.fly;
        });

        // ---- Обработчик нажатий клавиш ----
        document.addEventListener("keydown", (e) => {
            e.preventDefault();

            switch (e.code) {
                case "KeyW": this.keys.w = true; break;
                case "KeyA": this.keys.a = true; break;
                case "KeyS": this.keys.s = true; break;
                case "KeyD": this.keys.d = true; break;
                case "Space": {
                    if (this.spaceDown) break;
                    this.spaceDown = true;

                    this.keys.up = true;

                    if (!this.data.fly && this.onGround) {
                        this.velocity.y = this.jumpSpeed;
                        this.onGround = false;
                    }

                    onDoubleSpace(e);
                    break;
                }
                case "ShiftLeft": this.keys.down = true; break;
                case "AltLeft": this.keys.sprint = true; break;
            }
        }, { signal: this.abortController.signal });

        document.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "KeyW": this.keys.w = false; break;
                case "KeyA": this.keys.a = false; break;
                case "KeyS": this.keys.s = false; break;
                case "KeyD": this.keys.d = false; break;
                case "Space": {
                    this.keys.up = false;
                    this.spaceDown = false;
                    break;
                }
                case "ShiftLeft": this.keys.down = false; break;
                case "AltLeft": this.keys.sprint = false; break;
            }
        }, { signal: this.abortController.signal });
    }

    // ------------------------------------------------------------
    //  ФИЗИКА И КОЛЛИЗИИ
    // ------------------------------------------------------------

    /**
     * Проверяет, является ли блок твёрдым (непроходимым).
     * Замените реализацию на свою – обращение к вашему хранилищу блоков.
     */
    isBlockSolid(x, y, z) {
        const block = this.world?.getBlock(new Three.Vector3(x, y, z));
        return block != null && block !== 0;
    }

    /**
     * Обрабатывает вертикальные столкновения с блоками:
     * - стоит ли игрок на земле
     * - не врезался ли головой в потолок
     */
    handleVerticalCollisions() {
        const pos = this.data.pos;
        // Округляем координаты до целых блоков (куда попадают ноги)
        const blockX = Math.floor(pos.x);
        const blockY = Math.floor(pos.y);
        const blockZ = Math.floor(pos.z);

        // 1. Проверка блока под ногами (на один блок ниже)
        if (this.isBlockSolid(blockX, blockY - 1, blockZ)) {
            // Ставим игрока точно на верхнюю грань этого блока
            pos.y = blockY;
            this.velocity.y = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }

        // 2. Проверка блока на уровне головы (если летим вверх)
        if (this.velocity.y > 0) {
            const headY = Math.floor(pos.y + height);
            if (this.isBlockSolid(blockX, headY, blockZ)) {
                // Останавливаем движение вверх и опускаем голову под блок
                pos.y = headY - height;
                this.velocity.y = 0;
            }
        }
    }

    // ------------------------------------------------------------
    //  ОБНОВЛЕНИЕ УПРАВЛЕНИЯ
    // ------------------------------------------------------------

    updateControls(delta) {
        const controlLocked = Gui.isControlLocked();

        // Направления движения (горизонталь)
        const forward = new Three.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new Three.Vector3();
        right.crossVectors(forward, new Three.Vector3(0, 1, 0)).normalize();

        const move = new Three.Vector3(0, 0, 0);
        if (!controlLocked) {
            if (this.keys.w) move.add(forward);
            if (this.keys.s) move.sub(forward);
            if (this.keys.a) move.sub(right);
            if (this.keys.d) move.add(right);
        }

        // ---- Блокировка мыши (ваш существующий код) ----
        if (controlLocked && !this.oldControlLocked) {
            this.controls.unlock();
        }
        if (!controlLocked && this.oldControlLocked) {
            this.controls.lock();
        }
        this.oldControlLocked = controlLocked;

        // ---- Горизонтальное перемещение ----
        if (move.lengthSq() > 0) {
            let speed = this.data.speed;
            if (this.keys.sprint) speed *= this.data.runningSpeedMultiplier;
            // В режиме полёта скорость выше, но и вертикаль тоже управляется отдельно
            if (this.data.fly) speed *= this.data.flightSpeedMultiplier;
            else if (this.keys.down) speed *= this.data.seatSpeedMultiplier;

            move.normalize();
            this.data.pos.x += move.x * speed * delta;
            this.data.pos.z += move.z * speed * delta;
        }

        // ---- Вертикальное перемещение ----
        if (this.data.fly) {
            // Режим полёта: управляем Y напрямую клавишами up/down
            if (this.keys.up) {
                this.data.pos.y += this.data.speed * this.data.flightSpeedMultiplier * delta;
            }
            if (this.keys.down) {
                this.data.pos.y -= this.data.speed * this.data.flightSpeedMultiplier * delta;
            }
            // Сбрасываем физические параметры
            this.velocity.y = 0;
            this.onGround = false;
        } else {
            // ---- Режим ходьбы с гравитацией ----
            // Применяем гравитацию
            this.velocity.y -= this.gravity * delta;
            // Ограничиваем максимальную скорость падения
            if (this.velocity.y < this.terminalVelocity) {
                this.velocity.y = this.terminalVelocity;
            }

            // Обновляем позицию по Y
            this.data.pos.y += this.velocity.y * delta;

            // Обрабатываем столкновения с блоками по вертикали
            this.handleVerticalCollisions();
        }
    }

    // ------------------------------------------------------------
    //  ОБНОВЛЕНИЕ КАМЕРЫ
    // ------------------------------------------------------------

    updateCamera(delta) {
        let y = this.data.pos.y + eyeHeight;
        if (this.keys.down && !this.data.fly) {
            y = this.data.pos.y + eyeHeightSeat;
        }
        this.camera.position.set(this.data.pos.x, y, this.data.pos.z);
    }

    // ------------------------------------------------------------
    //  ОСНОВНОЙ ЦИКЛ ОБНОВЛЕНИЯ
    // ------------------------------------------------------------

    update(delta) {
        this.controls.pointerSpeed = this.data.pointerSpeed;
        this.updateControls(delta);
        this.updateCamera(delta);
    }

    // ------------------------------------------------------------
    //  УНИЧТОЖЕНИЕ
    // ------------------------------------------------------------

    destroy() {
        this.abortController.abort();
    }
}