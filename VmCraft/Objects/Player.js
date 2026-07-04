import * as Three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as Utils from "../Utils.js";
import * as Gui from "../Gui.js";

const height = 1.8;
const eyeHeight = height - 0.2;
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
            flightSpeedMultiplier: 2
        }
        this.oldControlLocked = false
    }

    init() {
        this.abortController = new AbortController();

        // ------------------ camera
        
        this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.updateCamera(0);
        this.camera.lookAt(this.data.pos.x + 1, this.data.pos.y + eyeHeight, this.data.pos.z);

        // ------------------ controls

        this.controls = new PointerLockControls(this.camera, this.gameBasic.renderer.domElement);
        this.controls.pointerSpeed = this.data.pointerSpeed
        this.controls = new PointerLockControls(this.camera, this.gameBasic.renderer.domElement);
        this.controls.minPolarAngle = deadZone; 
        this.controls.maxPolarAngle = Math.PI - deadZone;

        this.gameBasic.renderer.domElement.addEventListener("click", () => {
            if (!Gui.isControlLocked()) {
                this.controls.lock()
            }
        }, { signal: this.abortController.signal })

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false,
            shift: false,
            control: false
        }

        const onDoubleSpace = Utils.detectDoubleKey("Space", () => {
            this.data.fly = !this.data.fly
        });

        document.addEventListener("keydown", (e) => {
            e.preventDefault()
            
            switch (e.code) {
                case "KeyW": this.keys.w = true; break;
                case "KeyA": this.keys.a = true; break;
                case "KeyS": this.keys.s = true; break;
                case "KeyD": this.keys.d = true; break;
                case "Space": this.keys.up = true; break;
                case "ShiftLeft": this.keys.down = true; break;
                case "AltLeft": this.keys.sprint = true; break;
            }

            onDoubleSpace(e)
        }, { signal: this.abortController.signal })
        
        document.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "KeyW": this.keys.w = false; break;
                case "KeyA": this.keys.a = false; break;
                case "KeyS": this.keys.s = false; break;
                case "KeyD": this.keys.d = false; break;
                case "Space": this.keys.up = false; break;
                case "ShiftLeft": this.keys.down = false; break;
                case "AltLeft": this.keys.sprint = false; break;
            }
        }, { signal: this.abortController.signal })
    }

    updateControls(delta) {
        const controlLocked = Gui.isControlLocked()

        const forward = new Three.Vector3();
        this.camera.getWorldDirection(forward);
        //if (!this.data.fly) forward.y = 0;
        forward.y = 0;
        forward.normalize();

        const alwaysUp = new Three.Vector3(0, 1, 0)

        const right = new Three.Vector3();
        right.crossVectors(forward, new Three.Vector3(0, 1, 0)).normalize();

        const move = new Three.Vector3(0, 0, 0);
        if (!controlLocked) {
            if (this.keys.w) move.add(forward)
            if (this.keys.s) move.sub(forward)
            if (this.keys.a) move.sub(right)
            if (this.keys.d) move.add(right)

            if (this.data.fly) {
                if (this.keys.up) move.add(alwaysUp)
                if (this.keys.down) move.sub(alwaysUp)
            }
        }

        if (controlLocked && !this.oldControlLocked) {
            this.controls.unlock()
        }

        if (!controlLocked && this.oldControlLocked) {
            this.controls.lock()
        }

        this.oldControlLocked = controlLocked

        if (move.lengthSq() > 0) {
            let speed = this.data.speed
            if (this.keys.sprint) speed *= this.data.runningSpeedMultiplier
            if (this.data.fly) speed *= this.data.flightSpeedMultiplier

            move.normalize()
            this.data.pos.x += move.x * speed * delta
            this.data.pos.z += move.z * speed * delta
            if (this.data.fly) {
                this.data.pos.y += move.y * speed * delta
            }
        }
    }

    updateCamera(delta) {
        this.camera.position.set(this.data.pos.x, this.data.pos.y + eyeHeight, this.data.pos.z)
    }

    update(delta) {
        this.controls.pointerSpeed = this.data.pointerSpeed

        this.updateControls(delta)
        this.updateCamera(delta)
    }
    
    destroy() {
        this.abortController.abort();
    }
}
