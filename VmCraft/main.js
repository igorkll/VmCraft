import * as Three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const game_title = document.getElementById("game-title")

// ---------------------- render

const scene = new Three.Scene();
scene.background = new Three.Color(0x88ccff);

const camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);

const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---------------------- test

const geometry = new Three.BoxGeometry(1, 1, 1);
const material = new Three.MeshLambertMaterial({ color: 0x44aa88 });
const cube = new Three.Mesh(geometry, material);
scene.add(cube);

const light = new Three.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);
scene.add(new Three.AmbientLight(0x404060));

// ---------------------- handle controls

const controls = new PointerLockControls(camera, renderer.domElement);

renderer.domElement.addEventListener('click', () => {
    controls.lock();
});

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false
};

document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW': keys.w = true; break;
        case 'KeyA': keys.a = true; break;
        case 'KeyS': keys.s = true; break;
        case 'KeyD': keys.d = true; break;
        case 'Space': 
            keys.space = true;
            e.preventDefault();
            if (onGround) {
                velocity.y = jumpSpeed;
                onGround = false;
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW': keys.w = false; break;
        case 'KeyA': keys.a = false; break;
        case 'KeyS': keys.s = false; break;
        case 'KeyD': keys.d = false; break;
        case 'Space': keys.space = false; break;
    }
});

// ---------------------- frame handle

function frameHandle() {
    requestAnimationFrame(frameHandle);
    controls.update();
    renderer.render(scene, camera);
}
frameHandle();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

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
});

console.log('v86: Эмулятор создан. Ожидание загрузки...');
console.log(emulator);
*/
