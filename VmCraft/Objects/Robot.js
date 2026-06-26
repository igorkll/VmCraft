import * as Three from "three"
import * as Utils from "../Utils.js"
import html2canvas from '../html2canvas.esm.js'

const geometry = new Three.BoxGeometry(0.8, 0.8, 0.8)
const material = new Three.MeshLambertMaterial({ color: 0x666666 })

const geometry2 = new Three.BoxGeometry(0.4, 0.4, 0.4)
const material2 = new Three.MeshLambertMaterial({ color: 0xff0000 })

export class Robot {
    constructor(scene, x, y, z) {
        this.scene = scene
        this.x = x
        this.y = y
        this.z = z
        this.targetX = x
        this.targetY = y
        this.targetZ = z

        this.speed = 3

        this.object = new Three.Mesh(geometry, material)
        scene.add(this.object)

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
        
            memory_size: 64 * 1024 * 1024,
            vga_memory_size: 8 * 1024 * 1024,

            autostart: true,
            disable_keyboard: true
        })

        // ---------------------- display

        const canvas = document.createElement('canvas')
        const rect = this.v86Container.getBoundingClientRect()
        canvas.style.width = `${333}px`
        canvas.style.height = `${333}px`
        this.v86Container.style.width = '3030px'
        this.v86Container.style.height = '3030px'
        document.body.appendChild(canvas)

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
            html2canvas(this.v86Container, {
                canvas: canvas,
                useCORS: true,
                scale: 1
            }).then(() => {
                vmTexture.needsUpdate = true
            })
            this.v86Container.style.display = ''
        }, 100)

        setInterval(() => {
            //this.move(1, 0, 0)
        }, 4000)
    }

    move(x, y, z) {
        this.targetX += x
        this.targetY += y
        this.targetZ += z
    }

    update(delta) {
        this.x += (this.targetX - this.x) * delta * this.speed
        this.y += (this.targetY - this.y) * delta * this.speed
        this.z += (this.targetZ - this.z) * delta * this.speed
        this.stopped = Math.abs(this.targetX - this.x) < 0.01 && Math.abs(this.targetY - this.y) < 0.01 && Math.abs(this.targetY - this.z) < 0.01

        if (this.stopped) {
            this.targetX = this.x
            this.targetY = this.y
            this.targetZ = this.z
        }
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
