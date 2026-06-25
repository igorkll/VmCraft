// main.js
import * as Three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Сцена, камера, рендерер
const scene = new Three.Scene();
scene.background = new Three.Color(0x88ccff);

const camera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);

const renderer = new Three.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Куб-блок
const geometry = new Three.BoxGeometry(1, 1, 1);
const material = new Three.MeshLambertMaterial({ color: 0x44aa88 });
const cube = new Three.Mesh(geometry, material);
scene.add(cube);

// Освещение
const light = new Three.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
scene.add(light);
scene.add(new Three.AmbientLight(0x404060));

// Управление (OrbitControls для теста)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ---------------------- render
function renderFrame() {
    requestAnimationFrame(renderFrame);
    controls.update();
    renderer.render(scene, camera);
}
renderFrame();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});