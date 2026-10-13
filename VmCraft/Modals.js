import * as Gui from './Gui.js'
import * as Menu from './Menu.js'

function createBaseModal(title) {
    const modal = document.createElement("div")
    modal.classList.add("modal-window")
    modal.classList.add("modal-menu")

    const titleObj = document.createElement("div")
    titleObj.classList.add("menu-title")
    titleObj.textContent = title
    modal.appendChild(titleObj)

    return modal
}

function addModalDescription(modal, description) {
    const descriptionObj = document.createElement("div")
    descriptionObj.classList.add("menu-description")
    descriptionObj.textContent = description
    modal.appendChild(descriptionObj)
}

export async function modalInput(title, defaultInput="") {
    const modal = createBaseModal(title)

    Gui.openModalWindow(modal)
}

export function modalYesno(title, description=null) {
    const modal = createBaseModal(title)
    if (description) addModalDescription(modal, description)

    const yesButton = Menu.addButton(modal, "Yes")
    const noButton = Menu.addButton(modal, "No", null, null, [yesButton])

    return new Promise((resolve) => {
        let result = null

        noButton.addEventListener("click", () => {
            result = false
            Gui.closeModalWindow()
        });

        yesButton.addEventListener("click", () => {
            result = true
            Gui.closeModalWindow()
        });

        Gui.openModalWindow(modal, () => {
            resolve(result)
        })
    });
}

export function modalShow(title, description=null) {
    const modal = createBaseModal(title)
    if (description) addModalDescription(modal, description)

    const okayButton = Menu.addButton(modal, "Okay")

    return new Promise((resolve) => {
        okayButton.addEventListener("click", () => {
            Gui.closeModalWindow()
        })

        Gui.openModalWindow(modal, () => {
            resolve()
        })
    });
}

export async function windowSelectJsonFile() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json, application/json'
        input.onchange = (event) => {
            const file = event.target.files[0]
            if (!file) {
                reject(new Error('File not select'))
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    resolve(JSON.parse(e.target.result))
                } catch (err) {
                    reject(new Error('incorent json JSON'))
                }
            }
            reader.onerror = () => reject(new Error('Error reading file'))
            reader.readAsText(file)
        }
        input.click()
    })
}

export async function windowExportFileAdvanced(data, suggestedName='export', ext="json") {
    try {
        const acceptKey = `application/${ext}`
        const handle = await window.showSaveFilePicker({
            suggestedName: suggestedName + "." + ext,
            types: [{
                description: `${ext}-file`,
                accept: {[acceptKey]: [`.${ext}`] }
            }]
        })
        const writable = await handle.createWritable()
        const json = JSON.stringify(data, null, 2)
        await writable.write(json)
        await writable.close()
        console.log('File saved')
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Save failed:', err)
            modalShow("FAILED TO SAVE FILE", err)
        }
    }
}
