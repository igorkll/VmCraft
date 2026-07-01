
export function detectDoubleKey(keyCode, callback, delay = 300) {
    let lastTime = 0;
    return (e) => {
        if (e.code === keyCode) {
            const now = performance.now();
            if (now - lastTime <= delay) {
                callback(e);
            }
            lastTime = now;
        }
    };
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
