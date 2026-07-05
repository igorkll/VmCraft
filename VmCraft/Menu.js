import * as Gui from './Gui.js';

const menu = document.getElementById("menu")

// -------------------------------- create menu

const menuNames = []

function addSubMenu(name) {
    const submenu = document.createElement("div")
    submenu.classList.add("modal-window")
    submenu.classList.add("game-menu")
    submenu.id = "menu-" + name
    menu.appendChild(submenu)
    menuNames.push(name)
    return submenu
}

function getMenu(name) {
    return document.getElementById("menu-" + name)
}

function openSubMenu(name) {
    menuNames.forEach(name => {
        getMenu(name).style.display = "none"
    })

    getMenu(name).style.display = ""
}

addSubMenu("main")
addSubMenu("worlds")

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

// -------------------------------- worlds menu

function loadWorld() {

}

function refreshWorldsList() {
    addTitle("worlds", "WORLDS")

    const serviceHeight = '40px'
    addButton("worlds", "< BACK", () => {
        openSubMenu("main")
    }, serviceHeight, [
        addButton("worlds", "NEW WORLD", () => {
            openSubMenu("main")
        }, serviceHeight),

        addButton("worlds", "IMPORT", () => {
            openSubMenu("main")
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
