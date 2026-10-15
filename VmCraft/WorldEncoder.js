export 

export function encodeWorld(decodedWorldObj) {
    const encodedWorldObj = {}

    encodedWorldObj.id = decodedWorldObj.id
    encodedWorldObj.name = decodedWorldObj.name

    if (decodedWorldObj?.data) {
        encodedWorldObj.data = {

        }
    }

    return JSON.stringify(encodedWorldObj)
}

export function decodeWorld(encodedWorldStr) {
    const encodedWorldObj = JSON.parse(encodedWorldStr)
    const decodedWorldObj = {}

    decodedWorldObj.id = encodedWorldObj.id
    decodedWorldObj.name = encodedWorldObj.name

    if (encodedWorldObj?.data) {
        decodedWorldObj.data = {
            inited: true,
            playerData: 
        }
    }

    return decodedWorldObj
}