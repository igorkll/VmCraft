import { getOverlayText } from './game.js';

const menu = document.getElementById("menu")
const hud = document.getElementById("hud")
const overlay = document.getElementById("overlay")

function changeMenuState(menuOpened) {
    menu.style.display = menuOpened ? "block" : ""
    hud.style.display = menuOpened ? "" : "block"
}

function updateOverlay() {
    overlay.textContent = getOverlayText()
}

changeMenuState(true)


