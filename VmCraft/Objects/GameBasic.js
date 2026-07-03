import * as Three from "three"

export class GameBasic {
    constructor(renderer, scene) {
        this.chunkSize = new Three.Vector3(32, 32, 32)

        this.renderer = renderer
        this.scene = scene
    }
}
