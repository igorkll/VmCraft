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

        this.loadChunk()
    }

    loadChunk() {
        
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

    getGlobalPositionFromInternalPosition(pos) {
        return this.data.pos.clone().add(pos)
    }
}
