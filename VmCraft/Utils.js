import * as Three from "three"

export function detectDoubleKey(keyCode, callback, delay = 300) {
    let lastTime = 0
    let pressed = false

    const keydown = (e) => {
        if (e.code === keyCode) {
            if (pressed) return
            pressed = true

            const now = performance.now();
            if (now - lastTime <= delay) {
                callback(e);
            }
            lastTime = now;
        }
    }

    const keyup = (e) => {
        if (e.code === keyCode) pressed = false
    }

    return [keydown, keyup]
}

async function loadPart(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Load error ${url}: ${response.statusText}`);
    }
    return await response.arrayBuffer();
}

export async function loadAndCombineImages(urls) {
    const parts = await Promise.all(urls.map(loadPart));
    const totalSize = parts.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combinedBuffer = new Uint8Array(totalSize);

    let offset = 0;
    for (const part of parts) {
        combinedBuffer.set(new Uint8Array(part), offset);
        offset += part.byteLength;
    }

    return combinedBuffer.buffer;
}

export function getRandomHexNum() {
    const randomInt = Math.floor(Math.random() * 16);
    return randomInt.toString(16).toUpperCase()
}

export function getRandomSuffix() {
    let suffix = ""
    for (let i = 0; i < 4; i++) {
        suffix += getRandomHexNum()
    }
    return suffix
}

export function getVecFromObj(vec) {
    return new Three.Vector3(vec.x, vec.y, vec.z)
}

export function getNullObj() {
    return {x: 0, y: 0, z: 0}
}

export function getObj(x, y, z) {
    return {x, y, z}
}

export function anyClone(obj) {
    return Object.assign({}, obj)
}
