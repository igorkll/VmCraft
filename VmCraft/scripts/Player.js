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

        this.abortController = new AbortController();

        // ------------------ camera
        
        this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.update();
        this.camera.lookAt(this.x + 1, this.y + eyeHeight, this.z);

        // ------------------ controls

        this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
        this.renderer.domElement.addEventListener('click', () => {
            this.controls.lock();
        }, { signal: this.abortController.signal })

        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false
        }

        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                case 'KeyW': this.keys.w = true; break;
                case 'KeyA': this.keys.a = true; break;
                case 'KeyS': this.keys.s = true; break;
                case 'KeyD': this.keys.d = true; break;
                case 'Space': 
                    this.keys.space = true;
                    e.preventDefault();
                    if (onGround) {
                        velocity.y = jumpSpeed;
                        onGround = false;
                    }
                    break;
            }
        }, { signal: this.abortController.signal })
        
        document.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW': this.keys.w = false; break;
                case 'KeyA': this.keys.a = false; break;
                case 'KeyS': this.keys.s = false; break;
                case 'KeyD': this.keys.d = false; break;
                case 'Space': this.keys.space = false; break;
            }
        }, { signal: this.abortController.signal })
    }

    update() {
        this.camera.position.set(this.x, this.y + eyeHeight, this.z);
    }
    
    destroy() {
        this.abortController.abort();
    }
}
