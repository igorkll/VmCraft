import * as Three from "three"
import * as Utils from "../Utils.js"
import * as Gui from "../Gui.js"
import html2canvas from '../html2canvas.esm.js'

const geometry = new Three.BoxGeometry(0.8, 0.8, 0.8)
const material = new Three.MeshLambertMaterial({ color: 0x666666 })

const geometry2 = new Three.BoxGeometry(0.4, 0.4, 0.4)
const material2 = new Three.MeshLambertMaterial({
    color: 0xff0000,
    emissive: new Three.Color(0xff0000),
    emissiveIntensity: 1.0
})

const imageParts = [
    "images/ALinux.img.aa",
    "images/ALinux.img.ab",
    "images/ALinux.img.ac",
    "images/ALinux.img.ad"
]

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
            targetZ: z,

            rotate: 0,

            targetRotate: 0
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

        Utils.loadAndCombineImages(imageParts).then((hda_buffer) => {
            this.emulator = new window.V86({
                wasm_path: "v86/v86.wasm",
            
                screen_container: this.v86Container,
            
                bios: {
                    url: "v86/bios/seabios.bin",
                },
            
                vga_bios: {
                    url: "v86/bios/vgabios.bin",
                },
    
                hda: {
                    buffer: hda_buffer
                },
            
                memory_size: 512 * 1024 * 1024,
                vga_memory_size: 256 * 1024 * 1024,
    
                autostart: true,
                disable_keyboard: false
            })
    
            this.emulator.add_listener("emulator-ready", () => {
                this.emulator.keyboard_set_status(false)
                this.emulator.ready = true
    
                this.emulator.add_listener('serial0-output-byte', (byte) => {
                    if (this.isBusy()) {
                        this.emulator.serial0_send_byte('B')
                        return
                    }

                    const ch = String.fromCharCode(byte)

                    switch (ch) {
                        case 'w':
                            this.move(1)
                            break
        
                        case 's':
                            this.move(-1)
                            break
        
                        case 'a':
                            this.turn(-1)
                            break
        
                        case 'd':
                            this.turn(1)
                            break
        
                        case 'r':
                            this.rawmove(0, 1, 0)
                            break
        
                        case 'f':
                            this.rawmove(0, -1, 0)
                            break
                    }
                })
    
                this.interact()
            })
        })

        // ---------------------- display

        const canvas = document.createElement('canvas')

        const vmTexture = new Three.CanvasTexture(canvas)
        vmTexture.minFilter = Three.NearestFilter
        vmTexture.magFilter = Three.NearestFilter
        vmTexture.format = Three.RGBAFormat

        const screenMaterial = new Three.MeshStandardMaterial({
            map: vmTexture,
            emissive: new Three.Color(0xffffff),
            emissiveMap: vmTexture,
            emissiveIntensity: 1.0
        });

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
    }

    interact() {
        if (!this.emulator || !this.emulator.ready) return
        
        this.emulator.keyboard_set_status(true)
        this.v86Container.style.display = 'block'
        this.v86Container.openedModal = true

        Gui.openModalWindow(this.v86Container, () => {
            this.emulator.keyboard_set_status(false)
            this.v86Container.style.display = ''
            this.v86Container.openedModal = false
            document.body.appendChild(this.v86Container)
        })
    }

    turn(side) {
        this.data.targetRotate += side
        if (this.data.targetRotate < 0) this.data.targetRotate = 3
        if (this.data.targetRotate > 3) this.data.targetRotate = 0
    }

    move(value) {
        switch (this.data.targetRotate) {
            case 0:
                this.rawmove(value, 0, 0)
                break

            case 1:
                this.rawmove(0, 0, value)
                break

            case 2:
                this.rawmove(value * -1, 0, 0)
                break

            case 3:
                this.rawmove(0, 0, value * -1)
                break
        }
    }

    rawmove(x, y, z) {
        this.data.targetX += x
        this.data.targetY += y
        this.data.targetZ += z
    }

    update(delta) {
        this.data.x += (this.data.targetX - this.data.x) * delta * this.data.speed
        this.data.y += (this.data.targetY - this.data.y) * delta * this.data.speed
        this.data.z += (this.data.targetZ - this.data.z) * delta * this.data.speed
        this.data.rotate += (this.data.targetRotate - this.data.rotate) * delta * this.data.speed
        
        this.stopped = Math.abs(this.data.targetX - this.data.x) < 0.01 && Math.abs(this.data.targetY - this.data.y) < 0.01 && Math.abs(this.data.targetY - this.data.z) < 0.01
        if (this.stopped) {
            this.data.x = this.data.targetX
            this.data.y = this.data.targetY
            this.data.z = this.data.targetZ
        }

        this.stoppedRotate = Math.abs(this.data.targetRotate - this.data.rotate) < 0.01
        if (this.stoppedRotate) {
            this.data.rotate = this.data.targetRotate
        }

        this.object.position.set(this.data.x, this.data.y, this.data.z)
        this.object.rotation.y = (Math.PI / 2) * -this.data.rotate;
    }

    isBusy() {
        if (!this.stopped || !this.stoppedRotate) return true

        return false
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
