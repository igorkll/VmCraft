import * as Three from "three"
import * as Utils from "../Utils.js"
import { Player } from './Player.js'
import { Robot } from './Robot.js'
import { Chunk } from './Chunk.js'

export class World {
    constructor(gameBasic) {
        this.gameBasic = gameBasic

        this.loadWorld()
    }

    loadWorld() {
        this.destroy()

        const player = new Player(this.gameBasic, Three.Vector3(0, 10, 0))
        player.init()
        this.player = player
    }

    update(delta) {
        this.player.update(delta)
        
        for (let i = 0; i < this.interactive_blocks.length; i++) {
            this.interactive_blocks[i].update(delta)
        }

        for (let i = 0; i < this.chunks.length; i++) {
            this.chunks[i].update(delta)
        }
    }

    loadChunk(chunkX, chunkY, chunkZ) {
        
    }
    
    destroy() {
        if (this.player != null) {
            this.player.destroy()
            this.player = null
        }
    
        if (this.chunks != null) {
            for (let i = 0; i < this.chunks.length; i++) {
                this.chunks[i].destroy()
            }
            this.chunks = []
        }
    }
}
