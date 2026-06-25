import * as Three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as Utils from "../utils.js";

const height = 1.8;
const eyeHeight = height - 0.2;
const deadZone = Math.PI / 180;

export class Player {
    constructor(renderer, x, y, z) {
        this.renderer = renderer;
        this.x = x;
        this.y = y;
        this.z = z;

        this.fly = true;
        this.speed = 5
        this.pointerSpeed = 1.5

        this.abortController = new AbortController();

        // ------------------ camera
        
        this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.updateCamera(0);
        this.camera.lookAt(this.x + 1, this.y + eyeHeight, this.z);

        // ------------------ controls

        this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
        this.controls.pointerSpeed = this.pointerSpeed
        this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
        this.controls.minPolarAngle = deadZone; 
        this.controls.maxPolarAngle = Math.PI - deadZone;

        this.renderer.domElement.addEventListener("click", () => {
            this.controls.lock();
        }, { signal: this.abortController.signal })

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false,
            shift: false
        }

        const onDoubleSpace = Utils.detectDoubleKey("Space", () => {
            this.fly = !this.fly
        });

        document.addEventListener("keydown", (e) => {
            e.preventDefault()
            
            switch (e.code) {
                case "KeyW": this.keys.w = true; break;
                case "KeyA": this.keys.a = true; break;
                case "KeyS": this.keys.s = true; break;
                case "KeyD": this.keys.d = true; break;
                case "Space": this.keys.space = true; break;
                case "ShiftLeft": this.keys.shift = true; break;
            }

            onDoubleSpace(e)
        }, { signal: this.abortController.signal })
        
        document.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "KeyW": this.keys.w = false; break;
                case "KeyA": this.keys.a = false; break;
                case "KeyS": this.keys.s = false; break;
                case "KeyD": this.keys.d = false; break;
                case "Space": this.keys.space = false; break;
                case "ShiftLeft": this.keys.shift = false; break;
            }
        }, { signal: this.abortController.signal })
    }

    updateControls(delta) {
        const forward = new Three.Vector3();
        this.camera.getWorldDirection(forward);
        //if (!this.fly) forward.y = 0;
        forward.y = 0;
        forward.normalize();

        const alwaysUp = new Three.Vector3(0, 1, 0)

        const right = new Three.Vector3();
        right.crossVectors(forward, new Three.Vector3(0, 1, 0)).normalize();

        const move = new Three.Vector3(0, 0, 0);
        if (this.keys.w) move.add(forward);
        if (this.keys.s) move.sub(forward);
        if (this.keys.a) move.sub(right);
        if (this.keys.d) move.add(right);

        if (this.fly) {
            if (this.keys.space) move.add(alwaysUp);
            if (this.keys.shift) move.sub(alwaysUp);
        }

        if (move.lengthSq() > 0) {
            move.normalize()
            this.x += move.x * this.speed * delta
            this.z += move.z * this.speed * delta
            if (this.fly) {
                this.y += move.y * this.speed * delta
            }
        }
    }

    updateCamera(delta) {
        this.camera.position.set(this.x, this.y + eyeHeight, this.z)
    }

    update(delta) {
        this.controls.pointerSpeed = this.pointerSpeed

        this.updateControls(delta)
        this.updateCamera(delta)
    }
    
    destroy() {
        this.abortController.abort();
    }
}
