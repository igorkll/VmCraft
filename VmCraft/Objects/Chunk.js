import * as Three from "three"
import * as Utils from "../Utils.js"
import { Robot } from './Robot.js'

export class Chunk {
    constructor(gameBasic, pos) {
        this.gameBasic = gameBasic

        this.data = {
            pos: pos
        }

        this.interactive_blocks = []
        this.blocks = []

        this.loadChunk()
    }

    loadChunk() {
        const robot = new Robot(this.gameBasic, this.getGlobalPositionFromLocalPosition(new Three.Vector3(10, 0, 0)))
        robot.init()
        this.interactive_blocks.push(robot)
    }

    update(delta) {
        for (let i = 0; i < this.interactive_blocks.length; i++) {
            this.interactive_blocks[i].update(delta)
        }
    }
    
    destroy() {
        for (let i = 0; i < this.interactive_blocks.length; i++) {
            this.interactive_blocks[i].destroy()
        }
    }

    getGlobalPositionFromLocalPosition(pos) {
        return this.data.pos.clone().add(pos)
    }
}
