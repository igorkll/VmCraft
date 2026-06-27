const menu = document.getElementById("menu")
const hud = document.getElementById("hud")
const overlay = document.getElementById("overlay")

function changeMenuState(menuOpened) {
    menu.style.display = menuOpened ? "block" : ""
    hud.style.display = menuOpened ? "" : "block"
}

function changeOverlayState(overlayOpened) {
    overlay.style.display = overlayOpened ? "block" : ""
}

export function updateOverlay(text) {
    overlay.textContent = text
}

// --------------------------------

let menuState = true
let overlayState = false

changeMenuState(menuState)
changeOverlayState(overlayState)

document.addEventListener('keydown', (e) => {
    e.preventDefault()

    switch (e.code) {
        case 'F3':
            overlayState = !overlayState
            changeOverlayState(overlayState)
            break

        case 'F11':
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
    }
});
