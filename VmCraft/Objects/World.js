import * as Three from "three"
import * as Utils from "../Utils.js"
import { Player } from './Player.js'
import { Robot } from './Robot.js'
import { Chunk } from './Chunk.js'

export class World {
    constructor(gameBasic) {
        this.gameBasic = gameBasic
        gameBasic.world = this

        this.loadWorld()
    }

    loadWorld() {
        this.destroy()

        this.createPlayer(new Three.Vector3(0, 10, 0))
        this.createInteractiveBlock(new Three.Vector3(50, 0, 0), Robot)
        this.createInteractiveBlock(new Three.Vector3(50, 0, 50), Robot)
        this.createInteractiveBlock(new Three.Vector3(50, 0, 100), Robot)
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

    unloadChunk(chunkPosition) {
        this.chunks = chunks.filter(obj => {
            if (obj.pos.equals(chunkPosition)) {
                obj.destroy()
                removed.push(obj)
                return false
            }
            return true
        })
    }

    setBlock(globalPosition, blockId) {
        const chunkPosition = this.getChunkPositionFromGlobalPosition(globalPosition)
        const chunk = this.getChunk(chunkPosition)
        if (chunk != null) {
            const localPosition = chunk.getLocalPositionFromGlobalPosition(globalPosition)
            chunk.setBlock(localPosition, blockId)
            return true
        }
        return false
    }

    getBlock(globalPosition) {
        const chunkPosition = this.getChunkPositionFromGlobalPosition(globalPosition)
        const chunk = this.getChunk(chunkPosition)
        if (chunk != null) {
            const localPosition = chunk.getLocalPositionFromGlobalPosition(globalPosition)
            return chunk.getBlock(localPosition)
        }
        return 0
    }

    createInteractiveBlock(globalPosition, constructor, ...args) {
        const chunkPosition = this.getChunkPositionFromGlobalPosition(globalPosition)
        const chunk = this.getChunk(chunkPosition)
        if (chunk != null) {
            return chunk.createInteractiveBlock(globalPosition, constructor, ...args)
        }
        return null
    }

    createPlayer(playerPosition) {
        this.getChunk(this.getChunkPositionFromGlobalPosition(playerPosition))
        const player = new Player(this.gameBasic, playerPosition)
        player.init()
        this.player = player
        return player
    }

    getChunkPositionFromGlobalPosition(pos) {
        const chunkSize = this.gameBasic.chunkSize
        return new Three.Vector3(
            Math.floor(pos.x / chunkSize.x),
            Math.floor(pos.y / chunkSize.y),
            Math.floor(pos.z / chunkSize.z)
        )
    }

    getChunk(chunkPosition, forceLoad=true) {
        let chunk = this.chunks.find(obj => obj.data.pos.equals(chunkPosition))
        if (forceLoad && chunk == null) {
            chunk = this.loadChunk(chunkPosition)
        }
        return chunk
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
        }
        this.chunks = []
    }
}
