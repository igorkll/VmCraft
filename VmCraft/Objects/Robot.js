import * as Three from "three";
import * as Utils from "../Utils.js";

const geometry = new Three.BoxGeometry(0.8, 0.8, 0.8)
const material = new Three.MeshLambertMaterial({ color: 0x666666 })

const geometry2 = new Three.BoxGeometry(0.4, 0.4, 0.4)
const material2 = new Three.MeshLambertMaterial({ color: 0xff0000 })

export class Robot {
    constructor(scene, x, y, z) {
        this.scene = scene
        this.x = x
        this.y = y
        this.z = z

        this.object = new Three.Mesh(geometry, material)
        scene.add(this.object)

        const cube2 = new Three.Mesh(geometry2, material2)
        cube2.position.set(0.3, 0.1, 0);
        this.object.add(cube2)
    }

    update(delta) {
        
    }
    
    destroy() {
        this.scene.remove(this.object)
    }
}
