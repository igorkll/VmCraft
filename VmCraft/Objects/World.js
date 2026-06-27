import * as Utils from "../Utils.js"
import { Player } from './Player.js'
import { Robot } from './Robot.js'

export class World {
    constructor(gameBasic) {
        this.gameBasic = gameBasic

        this.newWorld()
    }

    newWorld() {
        if (this.player != null) {
            this.player.destroy()
        }
    
        if (this.interactive_blocks != null) {
            for (let i = 0; i < this.interactive_blocks.length; i++) {
                this.interactive_blocks[i].destroy()
            }
        }

        this.player = null
        this.interactive_blocks = []
    }

    genWorld() {
        this.newWorld()

        this.player = new Player(this.gameBasic.renderer, 0, 10, 0)

        let robot = new Robot(this.gameBasic.scene, 10, 0, 0)
        robot.init()
        this.interactive_blocks.push(robot)
    }

    update(delta) {
        this.player.update(delta)
        
        for (let i = 0; i < this.interactive_blocks.length; i++) {
            this.interactive_blocks[i].update(delta)
        }
    }
    
    destroy() {
        this.newWorld()
    }
}
