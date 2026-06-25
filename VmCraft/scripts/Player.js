import * as Three from 'three';

const height = 1.8;
const eyeHeight = height - 0.2;

export class Player {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        
        this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    }

    update() {
        camera.position.set(this.x, this.y + eyeHeight, this.z);
        camera.lookAt(this.x + 1, this.y + eyeHeight, this.z);
    }
    
    
}
