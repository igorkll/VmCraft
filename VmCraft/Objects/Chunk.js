import * as Three from "three"
import * as Utils from "../Utils.js"
import { Robot } from './Robot.js'

export class Chunk {
    constructor(gameBasic, pos) {
        this.gameBasic = gameBasic

        this.data = {
            pos: pos
        }

        this.needUpdateMesh = true
        this.interactive_blocks = []
        this.blocks = new Uint8Array(this.chunkBlockCount)

        this.loadChunk()
    }

    updateMesh() {
        if (this.object != null) {
            this.gameBasic.scene.remove(this.object)
            this.object = null
        }

        const geometry = new Three.BoxGeometry(32, 32, 32)
        const material = new Three.MeshLambertMaterial({ color: 0xff6666 })
        this.object = new Three.Mesh(geometry, material)
        this.object.position.set(15.5, 15.5, 15.5)
        this.gameBasic.scene.add(this.object)
        
        this.needUpdateMesh = false
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

        if (this.needUpdateMesh) this.updateMesh()
    }
    
    destroy() {
        for (let i = 0; i < this.interactive_blocks.length; i++) {
            this.interactive_blocks[i].destroy()
        }
    }

    getGlobalPositionFromLocalPosition(pos) {
        return this.data.pos.clone().add(pos)
    }

    getLocalPositionFromGlobalPosition(pos) {
        return pos.clone().sub(this.data.pos)
    }

    getBlockArrayIndex(localPosition) {
        return localPosition.x + (localPosition.y * this.gameBasic.chunkSize.x) + (localPosition.z * this.gameBasic.chunkSize.x * this.gameBasic.chunkSize.y)
    }

    setBlock(localPosition, blockId) {
        this.blocks[this.getBlockArrayIndex(localPosition)] = blockId
    }

    getBlock(localPosition) {
        return this.blocks[this.getBlockArrayIndex(localPosition)]
    }
}
