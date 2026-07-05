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
    const btn = document.createElement("button")
    btn.style.flex = '1'
    btn.textContent = name
    btn.classList.add("menu-button")
    if (height) btn.style.height = height
    btn.addEventListener("pointerup", callback)

    if (additionalButtons != true) {
        const btnhost = document.createElement("div")
        btnhost.classList.add("game-menu-hor")
        
        btnhost.appendChild(btn)
        additionalButtons.forEach(additionalBtn => {
            btnhost.appendChild(additionalBtn)
        })

        getMenu(menu).appendChild(btnhost)
    }

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

function smallSecondButton(btn) {
    btn.style.flex = ''
    btn.style.width = '60px'
}

function highlightButton(btn) {
    btn.classList.add("menu-button-highlight")
}

function addWorldToList(name, highlight=false) {
    const btn_rename = addButton("worlds", "B", () => {
    }, null, true)

    const btn_delete = addButton("worlds", "A", () => {
    }, null, true)

    smallSecondButton(btn_rename)
    smallSecondButton(btn_delete)

    const btn_loadWorld = addButton("worlds", name, () => {
        
    }, null, [btn_rename, btn_delete])

    if (highlight) {
        highlightButton(btn_loadWorld)
        highlightButton(btn_rename)
        highlightButton(btn_delete)
    }
}

function refreshWorldsList() {
    addTitle("worlds", "WORLDS")

    addWorldToList("test1", true)
    addWorldToList("test2")

    const serviceHeight = '40px'
    addButton("worlds", "< BACK", () => {
        Gui.closeModalWindow()
    }, serviceHeight, [
        addButton("worlds", "NEW WORLD", () => {
        }, serviceHeight, true),

        addButton("worlds", "IMPORT", () => {
        }, serviceHeight, true)
    ])
}

refreshWorldsList()

// -------------------------------- main menu

addTitle("main", "VmCraft")

addButton("main", "RESUME", () => {
    Gui.closeModalWindow()
})

addButton("main", "WORLDS", () => {
    openSubMenu("worlds")
})

addButton("main", "EXIT", () => {
    
})

export function openModal() {
    openSubMenu("main")
}
