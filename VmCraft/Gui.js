import * as Menu from './Menu.js';

const menu = document.getElementById("menu")
const hud = document.getElementById("hud")
const debugOverlay = document.getElementById("debug-overlay")

let menuState = false
let debugOverlayState = false

let modalRoot = null
let modalOnCloseCallback = null

// --------------------------------

export function changeDebugOverlayState(debugOverlayOpened) {
    debugOverlay.style.display = debugOverlayOpened ? "block" : ""
    debugOverlayState = debugOverlayOpened
}

export function updateDebugOverlay(text) {
    debugOverlay.textContent = text
}

export function openModalWindow(modalObject, _modalOnCloseCallback) {
    if (modalRoot) {
        modalRoot.style.display = 'none'

        const old_modalRoot = modalRoot
        const old_modalOnCloseCallback = modalOnCloseCallback
        modalOnCloseCallback = () => {
            modalRoot.style.display = ''

            modalRoot = old_modalRoot
            modalOnCloseCallback = old_modalOnCloseCallback
        }
    } else {
        modalOnCloseCallback = _modalOnCloseCallback
    }

    modalRoot = document.createElement("div")
    modalRoot.classList.add("modal-window")
    modalRoot.appendChild(modalObject)

    menu.appendChild(modalRoot)
}

export function closeModalWindow() {
    if (!modalRoot) return
    menu.removeChild(modalRoot)
    modalRoot = null
    
    if (modalOnCloseCallback) modalOnCloseCallback()

    hud.style.display = modalRoot ? "block" : ""
}

export function getModalWindow() {
    return modalRoot
}

export function isControlLocked() {
    return !!(modalRoot || menuState)
}

// -------------------------------- hotkeys

changeDebugOverlayState(debugOverlayState)

document.addEventListener('keydown', (e) => {
    e.preventDefault()

    switch (e.code) {
        case 'Backquote':
            if (getModalWindow()) {
                closeModalWindow()
            } else {
                Menu.openModal()
            }
            break
        
        case 'F3':
            debugOverlayState = !debugOverlayState
            changeDebugOverlayState(debugOverlayState)
            break

        case 'F11':
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
    }
});
