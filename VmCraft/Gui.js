const menu = document.getElementById("menu")
const hud = document.getElementById("hud")
const overlay = document.getElementById("overlay")

let menuState = false
let overlayState = false
let modalRoot = null

// --------------------------------

export function changeMenuState(menuOpened) {
    menu.style.display = menuOpened ? "block" : ""
    hud.style.display = menuOpened ? "" : "block"
    menuState = menuOpened
}

export function changeOverlayState(overlayOpened) {
    overlay.style.display = overlayOpened ? "block" : ""
    overlayState = overlayOpened
}

export function updateOverlay(text) {
    overlay.textContent = text
}

export function openModalWindow(modalObject) {
    if (modalRoot != null) return

    modalRoot = document.createElement("div")
    modalRoot.classList.add("modal-window")
    modalRoot.appendChild(modalObject)

    hud.appendChild(modalRoot)
}

// --------------------------------

changeMenuState(menuState)
changeOverlayState(overlayState)

document.addEventListener('keydown', (e) => {
    e.preventDefault()

    switch (e.code) {
        case 'Backquote':
            menuState = !menuState
            changeMenuState(menuState)
            break
        
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
