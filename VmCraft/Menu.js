import * as Gui from './Gui.js';

// -------------------------------- create menu

const submenuList = {}

function addSubMenu(name) {
    const submenu = document.createElement("div")
    submenu.classList.add("modal-window")
    submenu.classList.add("game-menu")
    submenu.id = "menu-" + name
    submenuList[name] = submenu
}

function getMenu(name) {
    return submenuList[name]
}

function openSubMenu(name) {
    Gui.openModalWindow(getMenu(name))
}

function addButton(menu, name, callback, height=null, additionalButtons=[]) {
    const btnhost = document.createElement("div")
    btnhost.classList.add("game-menu-hor")

    const btn = document.createElement("button")
    btn.style.flex = '1'
    btn.textContent = name
    btn.classList.add("menu-button")
    if (height) btn.style.height = height
    btn.addEventListener("pointerup", callback)
    btnhost.appendChild(btn)

    additionalButtons.forEach(additionalBtn => {
        btnhost.appendChild(additionalBtn)
    })

    getMenu(menu).appendChild(btnhost)
    return btn
}

function addTitle(menu, name) {
    const title = document.createElement("div")
    title.textContent = name
    title.classList.add("menu-title")

    getMenu(menu).appendChild(title)
    return title
}

addSubMenu("main")
addSubMenu("worlds")

// -------------------------------- worlds menu

function loadWorld() {

}

function refreshWorldsList() {
    addTitle("worlds", "WORLDS")

    const serviceHeight = '40px'
    addButton("worlds", "< BACK", () => {
        Gui.closeModalWindow()
    }, serviceHeight, [
        addButton("worlds", "NEW WORLD", () => {
        }, serviceHeight),

        addButton("worlds", "IMPORT", () => {
        }, serviceHeight)
    ])
}

refreshWorldsList()

// -------------------------------- main menu

addTitle("main", "VmCraft")

addButton("main", "RESUME", () => {
    Gui.changeMenuState(false)
})

addButton("main", "WORLDS", () => {
    openSubMenu("worlds")
})

addButton("main", "EXIT", () => {
    
})

openSubMenu("main")
