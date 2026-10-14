import * as Three from "three"
import * as Utils from "../Utils.js"
import { Player } from './Player.js'
import { Robot } from './Robot.js'
import { Chunk } from './Chunk.js'
import * as ObjectAssotiation from "../ObjectAssotiation.js"
import * as WorldManager from '../WorldManager.js';

export class World {
    constructor(gameBasic, worldData) {
        this.gameBasic = gameBasic
        this.worldId = worldData.id
        this.worldName = worldData.name

        this.loadWorld(worldData)
    }

    _defWorld() {
        console.log("loading world: default")

        this.createPlayer({
            pos: Utils.getObj(0, 10, 0)
        })
        
        this.createInteractive({
            pos: Utils.getObj(10, 10, 0)
        }, Robot)

        for (let ix = -15; ix <= 15; ix++) {
            for (let iz = -15; iz <= 15; iz++) {
                this.setBlock(Utils.getObj(ix, 0, iz), 1)
            }
        }
    }

    _loadWorld(worldData) {
        console.log("loading world: ", worldData)
        
        this.allChunksData = worldData.data.allChunksData

        this.createPlayer(worldData.data.playerData)
    }

    loadWorld(worldData) {
        this.destroy()

        if (worldData?.data?.inited) {
            this._loadWorld(worldData)
        } else {
            this._defWorld()
        }
    }

    update(delta) {
        this.updateInteractive(this.player)
        this.player.update(delta)

        for (let i = 0; i < this.loadedChunks.length; i++) {
            const chunk = this.loadedChunks[i]
            chunk.update(delta)
        }

        for (let i = 0; i < this.interactives.length; i++) {
            const interactive = this.interactives[i]
            this.updateInteractive(interactive)
            interactive.update(delta)
        }
    }

    updateInteractivePrepair(interactive) {
        interactive.world = this
    }

    updateInteractive(interactive) {
        this.updateInteractivePrepair(interactive)
        interactive.chunk = this.getChunk(this.getChunkPositionFromGlobalPosition(interactive.data.pos))
    }

    _genChunk(chunk) {

    }

    _newChunk(chunkPosition) {
        const chunk = new Chunk(this.gameBasic, this)
        chunk.data.pos = chunkPosition
        this.loadedChunks.push(chunk)
        updateChunkData(chunk)
        return chunk
    }

    _loadChunk(chunkData) {
        const chunk = new Chunk(this.gameBasic, this)
        chunk.setSaveData(chunkData)

        chunkData.interactivesData.forEach(element => {
            this.createInteractive(element[1], ObjectAssotiation.getClass(element[0]))
        })

        this.loadedChunks.push(chunk)
        return chunk
    }

    loadChunk(chunkPosition) {
        const chunkData = getChunkData(chunkPosition)
        if (chunkData == null) {
            return _newChunk(chunkPosition)
        } else {
            return _loadChunk(chunkData)
        }
    }

    unloadChunk(chunkPosition) {
        this.loadedChunks = this.loadedChunks.filter(obj => {
            if (obj.data.pos.equals(chunkPosition)) {
                updateChunkData(obj)
                obj.destroy()
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
        return null
    }

    createInteractive(fields, constructor, ...args) {
        const interactivePosition = fields?.pos || Utils.getNullObj()
        const chunk = this.getChunk(this.getChunkPositionFromGlobalPosition(interactivePosition))

        const interactive = new constructor(this.gameBasic, ...args)
        Object.assign(interactive.data, fields)
        this.updateInteractivePrepair(interactive)
        interactive.init()
        this.updateInteractive(interactive)
        this.interactives.push(interactive)
        return interactive
    }

    createPlayer(fields) {
        const playerPosition = fields?.pos || Utils.getNullObj()
        this.getChunk(this.getChunkPositionFromGlobalPosition(playerPosition))

        const player = new Player(this.gameBasic)
        Object.assign(player.data, fields)
        this.updateInteractivePrepair(player)
        player.init()
        this.updateInteractive(player)
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
        let chunk = this.loadedChunks.find(obj => obj.data.pos.equals(chunkPosition))
        if (forceLoad && chunk == null) {
            chunk = this.loadChunk(chunkPosition)
        }
        return chunk
    }
    
    destroy() {
        this.allChunksData = []

        if (this.player != null) {
            this.player.destroy()
            this.player = null
        }
    
        if (this.loadedChunks != null) {
            for (let i = 0; i < this.loadedChunks.length; i++) {
                this.loadedChunks[i].destroy()
            }
        }
        this.loadedChunks = []

        if (this.interactives != null) {
            for (let i = 0; i < this.interactives.length; i++) {
                this.interactives[i].destroy()
            }
        }
        this.interactives = []
    }

    getChunkData(chunkPosition) {
        const chunkData = this.allChunksData.find(obj => obj.pos.equals(chunkPosition))

        const additionalChunkData = {
            interactivesData: []
        }

        for (let i = 0; i < this.interactives.length; i++) {
            const obj = this.interactives[i]
            additionalChunkData.interactivesData.push([
                ObjectAssotiation.getName(obj),
                obj.data
            ])
        }

        return Object.assign({}, chunkData, additionalChunkData)
    }

    updateChunkData(chunk) {
        const chunkData = this.allChunksData.find(obj => obj.pos.equals(chunk.data.pos))
        const saveData = chunk.getSaveData()
        if (chunkData == null) {
            this.allChunksData.push(saveData)
        } else {
            Object.assign(chunkData, saveData)
        }
    }

    serializeData() {
        for (let i = 0; i < this.loadedChunks.length; i++) {
            updateChunkData(this.loadedChunks[i])
        }

        const worldData = {
            inited: true,
            playerData: this.player.data,
            allChunksData: this.allChunksData
        }

        return worldData
    }

    serialize() {
        const world = {}
        world.id = this.worldId
        world.name = this.worldName
        world.data = this.serializeData()

        return world
    }

    save() {
        return WorldManager.saveWorld(this.serialize())
    }
}
