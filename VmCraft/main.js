import * as Three from 'three'
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js'
import { Player } from './scripts/Player.js'

const game_title = document.getElementById("game-title")

// ---------------------- main

const timer = new Three.Timer()

const scene = new Three.Scene()
scene.background = new Three.Color(0x88ccff)

const renderer = new Three.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const player = new Player(renderer, 0, 0, 0)

// ---------------------- test

const geometry = new Three.BoxGeometry(1, 1, 1)
const material = new Three.MeshLambertMaterial({ color: 0x44aa88 })
const cube = new Three.Mesh(geometry, material)
scene.add(cube)

const light = new Three.DirectionalLight(0xffffff, 1)
light.position.set(5, 10, 7)
scene.add(light)
scene.add(new Three.AmbientLight(0x404060))

// ---------------------- frame handle

function frameHandle() {
    requestAnimationFrame(frameHandle)

    timer.update()
    const delta = timer.getDelta()
    player.update(delta)
    renderer.render(scene, player.camera)
}
frameHandle()

window.addEventListener('resize', () => {
    player.camera.aspect = window.innerWidth / window.innerHeight
    player.camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

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
