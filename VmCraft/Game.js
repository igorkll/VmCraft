import * as Three from 'three'
import * as Gui from './Gui.js';
import { World } from './Objects/World.js'
import { GameBasic } from './Objects/GameBasic.js'

// ---------------------- main

const timer = new Three.Timer()

const scene = new Three.Scene()
scene.background = new Three.Color(0x88ccff)

const renderer = new Three.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

const sunLight = new Three.DirectionalLight(0xffffff, 1.0); 
sunLight.position.set(50, 100, 50);
scene.add(sunLight)

const ambientLight = new Three.AmbientLight(0xffffff)
scene.add(ambientLight)

const gameBasic = new GameBasic(renderer, scene)

const world = new World(gameBasic)
world.genWorld()

document.body.appendChild(renderer.domElement)

// ---------------------- frame handle

let delta = 0

function getOverlayText() {
    return `FPS: ${Math.floor(1 / delta)}
Position: ${world.player.x.toFixed(3)} ${world.player.y.toFixed(3)} ${world.player.z.toFixed(3)}`
}

function frameHandle() {
    requestAnimationFrame(frameHandle)

    timer.update()
    delta = timer.getDelta()
    world.update(delta)
    renderer.render(scene, world.player.camera)

    Gui.updateOverlay(getOverlayText())
}
frameHandle()

window.addEventListener('resize', () => {
    player.camera.aspect = window.innerWidth / window.innerHeight
    player.camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
