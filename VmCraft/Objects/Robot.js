import * as Three from "three";
import * as Utils from "../Utils.js";

const geometry = new Three.BoxGeometry(0.8, 0.8, 0.8)
const material = new Three.MeshLambertMaterial({ color: 0x444444 })

export class Robot {
    constructor(scene, x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.object = new Three.Mesh(geometry, material)
        scene.add(this.object)

        const cube2 = new Three.Mesh(geometry, material)
        this.object.add(cube2)
    }

    update(delta) {
        
    }
    
    destroy() {
        scene.remove(this.object)
    }
}
