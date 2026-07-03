import * as Three from "three"
import * as Utils from "../Utils.js"

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
        const material = new Three.MeshLambertMaterial({ color: Math.random() * 0xffffff })
        this.object = new Three.Mesh(geometry, material)
        this.object.position.copy(this.getGlobalPosition().add(new Three.Vector3(15.5, 15.5, 15.5)))
        this.gameBasic.scene.add(this.object)
        
        this.needUpdateMesh = false
    }

    loadChunk() {
        
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

    getGlobalPosition() {
        return this.data.pos.clone().multiply(this.gameBasic.chunkSize)
    }

    getGlobalPositionFromLocalPosition(pos) {
        return this.getGlobalPosition().clone().add(pos)
    }

    getLocalPositionFromGlobalPosition(pos) {
        return pos.clone().sub(this.getGlobalPosition())
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

    createInteractiveBlock(globalPosition, constructor, ...args) {
        const interactive_block = new constructor(this.gameBasic, globalPosition, ...args)
        interactive_block.init()
        this.interactive_blocks.push(interactive_block)
        return interactive_block
    }
}
