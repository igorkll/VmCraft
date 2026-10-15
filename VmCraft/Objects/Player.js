import * as Three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as Utils from "../Utils.js";
import * as Gui from "../Gui.js";
import * as Consts from "../Consts.js";

const defaultHeight = 1.8;
const deadZone = Math.PI / 180;

export class Player {
    constructor(gameBasic) {
        this.gameBasic = gameBasic
        this.data = {
            pos: new Three.Vector3(0, 0, 0),
            velocity: new Three.Vector3(0, 0, 0),
            fly: true,
            speed: 30,
            pointerSpeed: 1.5,
            runningSpeedMultiplier: 2,
            flightSpeedMultiplier: 2,
            seatSpeedMultiplier: 0.5,
            onGround: false,
            jumpSpeed: 8,
            height: defaultHeight,
            eyeHeight: defaultHeight - 0.2,
            eyeHeightSeat: defaultHeight - 0.2,
            width: 0.6
        }

        this.oldControlLocked = false
    }

    getSaveData() {
        const outData = Object.assign({}, this.data, {
            pos: Utils.getArrFromVec(this.data.pos),
            velocity: Utils.getArrFromVec(this.data.velocity)
        })

        if (this.camera) {
            const cameraRotation = this.camera.quaternion
            outData.cameraRotation = [cameraRotation.x, cameraRotation.y, cameraRotation.z, cameraRotation.w]
        }

        return outData
    }

    setSaveData(data) {
        this.data = Object.assign({}, data, {
            pos: Utils.getVecFromArrCheck(data.pos),
            velocity: Utils.getVecFromArrCheck(data.velocity)
        })

        if (this.camera) {
            const cameraRotation = data.cameraRotation
            this.camera.quaternion.set(cameraRotation[0], cameraRotation[1], cameraRotation[2], cameraRotation[3])
        } else {
            this.cameraRotation = data.cameraRotation
        }
        delete this.data.cameraRotation
    }

    init() {
        this.abortController = new AbortController();

        // ------------------ camera
        this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(this.data.pos.x, this.data.pos.y + this.data.eyeHeight, this.data.pos.z);

        if (this.cameraRotation) {
            const cameraRotation = this.cameraRotation
            this.camera.quaternion.set(cameraRotation[0], cameraRotation[1], cameraRotation[2], cameraRotation[3])
        } else {
            this.camera.lookAt(this.data.pos.x + 1, this.data.pos.y + this.data.eyeHeight, this.data.pos.z);
        }

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

        this.defaultKeys = {
            w: false,
            a: false,
            s: false,
            d: false,
            up: false,
            down: false,
            sprint: false
        }

        this.keys = Object.assign({}, this.defaultKeys)
        this.oldKeys = Object.assign({}, this.defaultKeys)

        const [onDoubleSpace_keydown, onDoubleSpace_keyup] = Utils.detectDoubleKey("Space", () => {
            this.data.fly = !this.data.fly;
        });

        // ---- Обработчик нажатий клавиш ----
        document.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "KeyW": this.keys.w = true; break;
                case "KeyA": this.keys.a = true; break;
                case "KeyS": this.keys.s = true; break;
                case "KeyD": this.keys.d = true; break;
                case "Space": this.keys.up = true; break;
                case "KeyC": this.keys.down = true; break;
                case "ShiftLeft": this.keys.sprint = true; break;
            }

            onDoubleSpace_keydown(e)
        }, { signal: this.abortController.signal });

        document.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "KeyW": this.keys.w = false; break;
                case "KeyA": this.keys.a = false; break;
                case "KeyS": this.keys.s = false; break;
                case "KeyD": this.keys.d = false; break;
                case "Space": this.keys.up = false; break;
                case "KeyC": this.keys.down = false; break;
                case "ShiftLeft": this.keys.sprint = false; break;
            }

            onDoubleSpace_keyup(e)
        }, { signal: this.abortController.signal });
    }

    isBlockSolid(x, y, z) {
        const block = this.world?.getBlock(new Three.Vector3(x, y, z));
        return block != null && block !== 0;
    }

    collides() {
        const pos = this.data.pos
        const half = this.data.width / 2
        
    
        const minX = Math.floor(pos.x - half + Consts.EPS)
        const maxX = Math.floor(pos.x + half - Consts.EPS)
        const minY = Math.floor(pos.y + Consts.EPS)
        const maxY = Math.floor(pos.y + this.data.height - Consts.EPS)
        const minZ = Math.floor(pos.z - half + Consts.EPS)
        const maxZ = Math.floor(pos.z + half - Consts.EPS)
    
        for (let x = minX; x <= maxX; x++)
            for (let y = minY; y <= maxY; y++)
                for (let z = minZ; z <= maxZ; z++)
                    if (this.isBlockSolid(x, y, z)) return true
        return false
    }

    moveAxis(axis, amount) {
        if (amount === 0) return
        const pos = this.data.pos
        const half = this.data.width / 2
    
        pos[axis] += amount
    
        if (!this.collides()) return
    
        if (axis === 'x') {
            if (amount > 0) pos.x = Math.floor(pos.x + half) - half - Consts.EPS
            else            pos.x = Math.floor(pos.x - half) + 1 + half + Consts.EPS
            this.data.velocity.x = 0
        } else {
            if (amount > 0) pos.z = Math.floor(pos.z + half) - half - Consts.EPS
            else            pos.z = Math.floor(pos.z - half) + 1 + half + Consts.EPS
            this.data.velocity.z = 0
        }
    }

    handleHorizontalCollisions(delta) {
        this.moveAxis('x', this.data.velocity.x * delta)
        this.moveAxis('z', this.data.velocity.z * delta)
    }

    handleVerticalCollisions(delta) {
        const halfWidth = this.data.width / 2;
        const pos = this.data.pos;

        let col1 = false;
        let col2 = false;

        for (let ix = -1; ix <= 1; ix += 2) {
            for (let iy = -1; iy <= 1; iy += 2) {
                const blockX = Math.floor(pos.x + (ix * halfWidth));
                const blockY = Math.floor(pos.y);
                const blockZ = Math.floor(pos.z + (iy * halfWidth));

                if (this.isBlockSolid(blockX, blockY, blockZ)) {
                    col1 = true;
                }

                const headY = Math.floor(pos.y + this.data.height);
                if (this.isBlockSolid(blockX, headY, blockZ)) {
                    col2 = true;
                }
            }
        }

        if (col1) {
            const blockY = Math.floor(pos.y);
            pos.y = blockY + 1;
            this.data.velocity.y = 0;
            this.data.onGround = true;
            this.data.fly = false;
        } else {
            this.data.onGround = false;
        }

        const headY = Math.floor(pos.y + this.data.height);
        if (col2) {
            pos.y = headY - this.data.height;
            this.data.velocity.y = 0;
        }
    }

    updateControls(delta) {
        const controlLocked = Gui.isControlLocked()
        if (controlLocked && !this.oldControlLocked) {
            this.controls.unlock()
        }
        if (!controlLocked && this.oldControlLocked) {
            this.controls.lock()
        }
        this.oldControlLocked = controlLocked

        if (controlLocked) {
            this.keys = Object.assign({}, this.defaultKeys)
        }

        const forward = new Three.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new Three.Vector3();
        right.crossVectors(forward, new Three.Vector3(0, 1, 0)).normalize();

        const move = new Three.Vector3(0, 0, 0);
        if (this.keys.w) move.add(forward)
        if (this.keys.s) move.sub(forward)
        if (this.keys.a) move.sub(right)
        if (this.keys.d) move.add(right)

        if (this.keys.up && !this.data.fly && this.data.onGround) {
            this.data.velocity.y += this.data.jumpSpeed;
            this.data.onGround = false;
        }

        let current_speed_mul = 1
        if (this.keys.sprint) current_speed_mul *= this.data.runningSpeedMultiplier
        if (this.data.fly) current_speed_mul *= this.data.flightSpeedMultiplier
        else if (this.keys.down) current_speed_mul *= this.data.seatSpeedMultiplier

        if (move.lengthSq() > 0) {
            move.normalize()
            this.data.velocity.x += current_speed_mul * move.x * this.data.speed * delta;
            this.data.velocity.z += current_speed_mul * move.z * this.data.speed * delta;
        }

        if (this.data.fly) {
            if (this.keys.up) {
                this.data.velocity.y += current_speed_mul * this.data.speed * delta
            }
            if (this.keys.down) {
                this.data.velocity.y -= current_speed_mul * this.data.speed * delta
            }
        } else {
            this.data.velocity.y -= Consts.gravity * delta;
            if (this.data.velocity.y < Consts.terminal_velocity) {
                this.data.velocity.y = Consts.terminal_velocity;
            }
        }
        
        let voxel_velocity_drop_mul = 1 //для имитации льда в будущем
        let speed_mul = Math.pow(Consts.velocity_drop * voxel_velocity_drop_mul, delta);

        this.data.velocity.x *= speed_mul
        this.data.velocity.z *= speed_mul
        this.handleHorizontalCollisions(delta)
        
        this.data.pos.y += this.data.velocity.y * delta
        if (this.data.fly) this.data.velocity.y *= speed_mul
        this.handleVerticalCollisions(delta)
        
        this.oldKeys = Object.assign({}, this.keys)
    }

    updateCamera(delta) {
        let y = this.data.pos.y + this.data.eyeHeight;
        if (this.keys.down && !this.data.fly) {
            y = this.data.pos.y + this.data.eyeHeightSeat;
        }
        this.camera.position.set(this.data.pos.x, y, this.data.pos.z);
    }

    update(delta) {
        this.controls.pointerSpeed = this.data.pointerSpeed;
        this.updateControls(delta);
        this.updateCamera(delta);
    }

    destroy() {
        this.abortController.abort();
    }
}