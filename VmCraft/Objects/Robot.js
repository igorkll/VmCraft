import * as Three from "three";
import * as Utils from "../Utils.js";

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

        this.object = new Three.Mesh(geometry, material)
        scene.add(this.object)

        const cube2 = new Three.Mesh(geometry2, material2)
        cube2.position.set(0.3, 0.1, 0);
        this.object.add(cube2)

        // ---------------------- vm

        this.v86Container = document.createElement('div');
        this.v86Container.style.display = 'none';
        document.body.appendChild(this.v86Container);

        this.emulator = new window.V86({
            wasm_path: "v86/v86.wasm",
        
            screen_container: this.v86Container,
        
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

        // ---------------------- display

        const v86Canvas = this.v86Container.querySelector('canvas');

        const vmTexture = new Three.CanvasTexture(v86Canvas);
        vmTexture.minFilter = Three.LinearFilter;
        vmTexture.magFilter = Three.LinearFilter;
        vmTexture.format = Three.RGBAFormat;

        const screenMaterial = new Three.MeshLambertMaterial({
            map: vmTexture,
            side: Three.DoubleSide
        });

        // Создаем геометрию для экрана (плоскость)
        const screenGeometry = new Three.PlaneGeometry(1.2, 0.9);
        this.screen = new Three.Mesh(screenGeometry, screenMaterial);
        
        // Позиционируем экран на корпусе робота
        this.screen.position.set(0, 0.6, 0.4); // Например, спереди и чуть выше
        this.object.add(this.screen);
    }

    update(delta) {
        
    }
    
    destroy() {
        this.scene.remove(this.object)

        if (this.emulator && typeof emulator.stop === 'function') {
            this.emulator.stop();
        }
        if (this.v86Container && this.v86Container.parentNode) {
            this.v86Container.parentNode.removeChild(this.v86Container);
        }
    }
}
