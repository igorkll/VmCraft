import * as Three from "three"
import * as Utils from "../Utils.js";

export class GameBasic {
    constructor(renderer, scene) {
        this.chunkSize = Utils.getObj(32, 32, 32)
        this.chunkBlockCount = this.chunkSize.x * this.chunkSize.y * this.chunkSize.z

        this.renderer = renderer
        this.scene = scene
    }
}
