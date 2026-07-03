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

        this.chunks = []
        this.primaryChunk = this.loadChunk(new Three.Vector3(0, 0, 0))

        const player = new Player(this.gameBasic, this.primaryChunk.getGlobalPositionFromInternalPosition(new Three.Vector3(0, 10, 0)))
        player.init()
        this.player = player
    }

    update(delta) {
        this.player.update(delta)

        for (let i = 0; i < this.chunks.length; i++) {
            this.chunks[i].update(delta)
        }
    }

    loadChunk(chunkPosition) {
        const chunk = new Chunk(this.gameBasic, chunkPosition)
        this.chunks.push(chunk)
        return chunk
    }

    getChunkPositionFromGlobalPosition(pos) {
        const chunkSize = this.gameBasic.chunkSize;
        return new THREE.Vector3(
            Math.floor(pos.x / chunkSize),
            Math.floor(pos.y / chunkSize),
            Math.floor(pos.z / chunkSize)
        )
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
