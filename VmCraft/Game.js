import * as Three from 'three'
import { Player } from './Player.js'
import { Robot } from './Objects/Robot.js'

// ---------------------- main

const timer = new Three.Timer()

const scene = new Three.Scene()
scene.background = new Three.Color(0x88ccff)

const renderer = new Three.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

let player = null
let interactive_blocks = []

function loadWorld() {
    if (player != null) {
        player.destroy()
    }

    for (let i = 0; i < interactive_blocks.length; i++) {
        interactive_blocks[i].destroy()
    }

    player = new Player(renderer, 0, 10, 0)
    interactive_blocks = []
}

loadWorld()

interactive_blocks.push(new Robot(scene, 10, 0, 0))

// ----------------------

const sunLight = new Three.DirectionalLight(0xffffff, 1.0); 
sunLight.position.set(50, 100, 50);
scene.add(sunLight)

const ambientLight = new Three.AmbientLight(0xffffff)
scene.add(ambientLight)

// ---------------------- frame handle

let delta = 0

function frameHandle() {
    requestAnimationFrame(frameHandle)

    timer.update()
    delta = timer.getDelta()

    player.update(delta)

    for (let i = 0; i < interactive_blocks.length; i++) {
        interactive_blocks[i].update(delta)
    }

    renderer.render(scene, player.camera)
}
frameHandle()

window.addEventListener('resize', () => {
    player.camera.aspect = window.innerWidth / window.innerHeight
    player.camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

export function getOverlayText() {
    return `FPS: ${Math.floor(1 / delta)}
Position: ${player.x.toFixed(3)} ${player.y.toFixed(3)} ${player.z.toFixed(3)}`
}

// ----------------------

/*
const emulator = new window.V86({
    wasm_path: "v86/v86.wasm",

    screen_container: overlay,

    bios: {
        url: "v86/bios/seabios.bin",
    },

    vga_bios: {
        url: "v86/bios/vgabios.bin",
    },

    autostart: true,

    memory_size: 64 * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
})

console.log('v86: Эмулятор создан. Ожидание загрузки...')
console.log(emulator)
*/
