
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
