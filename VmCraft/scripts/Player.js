import * as Three from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const height = 1.8;
const eyeHeight = height - 0.2;

export class Player {
    constructor(renderer, x, y, z) {
        this.renderer = renderer;
        this.x = x;
        this.y = y;
        this.z = z;

        this.fly = true;

        this.abortController = new AbortController();

        // ------------------ camera
        
        this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.updateCamera(0);
        this.camera.lookAt(this.x + 1, this.y + eyeHeight, this.z);

        // ------------------ controls

        this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
        this.controls.pointerSpeed = 1.5; 

        this.renderer.domElement.addEventListener('click', () => {
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

        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': this.keys.w = true; break;
                case 'KeyA': this.keys.a = true; break;
                case 'KeyS': this.keys.s = true; break;
                case 'KeyD': this.keys.d = true; break;
                case 'Space': this.keys.space = true; break;
                case 'Shift': this.keys.shift = true; break;
            }
        }, { signal: this.abortController.signal })
        
        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': this.keys.w = false; break;
                case 'KeyA': this.keys.a = false; break;
                case 'KeyS': this.keys.s = false; break;
                case 'KeyD': this.keys.d = false; break;
                case 'Space': this.keys.space = false; break;
                case 'Shift': this.keys.shift = false; break;
            }
        }, { signal: this.abortController.signal })
    }

    updateControls(delta) {
        const forward = new Three.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new Three.Vector3();
        right.crossVectors(forward, new Three.Vector3(0, 1, 0)).normalize();

        const move = new Three.Vector3(0, 0, 0);
        if (this.keys.w) move.add(forward);
        if (this.keys.s) move.sub(forward);
        if (this.keys.a) move.sub(right);
        if (this.keys.d) move.add(right);

        if (move.lengthSq() > 0) {
            move.normalize()
            const speed = 5.0
            console.log(delta)
            this.x += move.x * speed * delta
            this.z += move.z * speed * delta
        }
    }

    updateCamera(delta) {
        this.camera.position.set(this.x, this.y + eyeHeight, this.z)
    }

    update(delta) {
        this.updateControls(delta)
        this.updateCamera(delta)
    }
    
    destroy() {
        this.abortController.abort();
    }
}
