import * as Three from "three"
import * as Utils from "../Utils.js"
import html2canvas from '../html2canvas.esm.js'

const geometry = new Three.BoxGeometry(0.8, 0.8, 0.8)
const material = new Three.MeshLambertMaterial({ color: 0x666666 })

const geometry2 = new Three.BoxGeometry(0.4, 0.4, 0.4)
const material2 = new Three.MeshLambertMaterial({ color: 0xff0000 })

export class Robot {
    constructor(gameBasic, x, y, z) {
        this.gameBasic = gameBasic
        this.data = {
            speed: 3,

            x: x,
            y: y,
            z: z,

            targetX: x,
            targetY: y,
            targetZ: z
        }
    }

    init() {
        this.object = new Three.Mesh(geometry, material)
        this.gameBasic.scene.add(this.object)

        const cube2 = new Three.Mesh(geometry2, material2)
        cube2.position.set(0.3, 0.1, 0)
        this.object.add(cube2)

        // ---------------------- vm

        this.v86Container = document.createElement('div')
        this.v86Container.classList.add("vm-display")
        document.body.appendChild(this.v86Container)

        this.emulator = new window.V86({
            wasm_path: "v86/v86.wasm",
        
            screen_container: this.v86Container,
        
            bios: {
                url: "v86/bios/seabios.bin",
            },
        
            vga_bios: {
                url: "v86/bios/vgabios.bin",
            },

            cdrom: {
                url: "images/linux.iso"
            },
        
            memory_size: 512 * 1024 * 1024,
            vga_memory_size: 256 * 1024 * 1024,

            autostart: true,
            disable_keyboard: true
        })

        // ---------------------- display

        const canvas = document.createElement('canvas')

        const vmTexture = new Three.CanvasTexture(canvas)
        vmTexture.minFilter = Three.NearestFilter
        vmTexture.magFilter = Three.NearestFilter
        vmTexture.format = Three.RGBAFormat

        const screenMaterial = new Three.MeshLambertMaterial({
            map: vmTexture
        })

        const screenGeometry = new Three.PlaneGeometry(0.6, 0.6)
        this.screen = new Three.Mesh(screenGeometry, screenMaterial)
        this.screen.position.set(-0.41, 0, 0)
        this.screen.rotation.y = -Math.PI / 2
        this.object.add(this.screen)

        this.updateTimer = setInterval(() => {
            this.v86Container.style.display = 'block'
            canvas.width = this.v86Container.scrollWidth
            canvas.height = this.v86Container.scrollHeight
            html2canvas(this.v86Container, {
                canvas: canvas,
                useCORS: true,
                scale: 1
            }).then(() => {
                vmTexture.needsUpdate = true
            })

            if (!this.v86Container.openedModal) {
                this.v86Container.style.display = ''
            }
        }, 100)

        setInterval(() => {
            //this.move(1, 0, 0)
        }, 4000)
    }

    interact() {
        this.v86Container.style.display = 'block'
        this.v86Container.openedModal = true
        Utils.modalWindow(this.v86Container, () => {
            this.v86Container.style.display = ''
            this.v86Container.openedModal = false
        })
    }

    move(x, y, z) {
        this.data.targetX += x
        this.data.targetY += y
        this.data.targetZ += z
    }

    update(delta) {
        this.data.x += (this.data.targetX - this.data.x) * delta * this.data.speed
        this.data.y += (this.data.targetY - this.data.y) * delta * this.data.speed
        this.data.z += (this.data.targetZ - this.data.z) * delta * this.data.speed
        
        const stopped = Math.abs(this.data.targetX - this.data.x) < 0.01 && Math.abs(this.data.targetY - this.data.y) < 0.01 && Math.abs(this.data.targetY - this.data.z) < 0.01
        if (stopped) {
            this.data.targetX = this.data.x
            this.data.targetY = this.data.y
            this.data.targetZ = this.data.z
        }

        this.object.position.set(this.data.x, this.data.y, this.data.z)
    }
    
    destroy() {
        this.scene.remove(this.object)

        if (this.emulator && typeof emulator.stop === 'function') {
            this.emulator.stop()
        }
        if (this.v86Container && this.v86Container.parentNode) {
            this.v86Container.parentNode.removeChild(this.v86Container)
        }

        clearInterval(this.updateTimer)
    }
}
