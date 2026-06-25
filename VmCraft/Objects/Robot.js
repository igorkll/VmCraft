import * as Three from "three";
import * as Utils from "../Utils.js";
import html2canvas from '../html2canvas.esm.js';

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
        this.v86Container.classList.add("vm-display");
        document.body.appendChild(this.v86Container);

        this.emulator = new window.V86({
            wasm_path: "v86/v86.wasm",
        
            screen_container: this.v86Container,
            screen_options: {
                use_graphical_text: true
            },
        
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

        const canvas = document.createElement('canvas')
        canvas.classList.add("vm-canvas")

        const vmTexture = new Three.CanvasTexture(canvas);
        vmTexture.minFilter = Three.LinearFilter;
        vmTexture.magFilter = Three.LinearFilter;
        vmTexture.format = Three.RGBAFormat;

        const screenMaterial = new Three.MeshLambertMaterial({
            map: vmTexture,
            side: Three.DoubleSide
        });

        const screenGeometry = new Three.PlaneGeometry(1, 1);
        this.screen = new Three.Mesh(screenGeometry, screenMaterial);
        
        this.screen.position.set(0, 0.6, 0.5);
        this.object.add(this.screen);

        setInterval(() => {
            html2canvas(this.v86Container, {
                canvas: canvas,
                useCORS: true,
                scale: 1,
                backgroundColor: '#000000',
            }).then(() => {
                vmTexture.needsUpdate = true;
            })
        }, 100)
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
