const menu = document.getElementById("menu")
const hud = document.getElementById("hud")
const overlay = document.getElementById("overlay")

let menuState = false
let overlayState = false
let modalRoot = null
let modalOnCloseCallback = null

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

export function openModalWindow(modalObject, _modalOnCloseCallback) {
    if (modalRoot != null) return

    modalOnCloseCallback = _modalOnCloseCallback

    modalRoot = document.createElement("div")
    modalRoot.classList.add("modal-window")
    modalRoot.appendChild(modalObject)

    hud.appendChild(modalRoot)
}

export function closeModalWindow() {
    if (modalRoot == null) return
    hud.removeChild(modalRoot)
    modalRoot = null
    
    if (modalOnCloseCallback != null) modalOnCloseCallback()
}

export function getModalWindow() {
    return modalRoot
}

export function isControlLocked() {
    return !!(modalRoot || menuState)
}

// -------------------------------- hotkeys

changeMenuState(menuState)
changeOverlayState(overlayState)

document.addEventListener('keydown', (e) => {
    e.preventDefault()

    switch (e.code) {
        case 'Backquote':
            if (getModalWindow()) {
                closeModalWindow()
            } else {
                menuState = !menuState
                changeMenuState(menuState)
            }
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

// -------------------------------- menu

// ------------ create menu

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

// ------------ worlds menu

function loadWorld() {

}

function refreshWorldsList() {

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

// ------------ main buttons

addButton("main", "RESUME", () => {
    changeMenuState(false)
})

addButton("main", "WORLDS", () => {
    openSubMenu("worlds")
})

addButton("main", "CLOSE", () => {
    
})

openSubMenu("main")
