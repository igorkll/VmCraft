import { Dexie } from './dexie.mjs';

// ----------------------------------------- init database

const db = new Dexie("Worlds");

db.version(1).stores({
    worlds: '++id, name'
})

// -----------------------------------------

export async function worldList() {
    try {
        return await db.worlds.toArray()
    } catch (error) {
        console.error('Failed to get worlds:', error)
        return null
    }
}

export async function getWorldFromName(name) {
    try {
        const world = await db.worlds.where('name').equals(name).first()
        return world || null
    } catch (error) {
        console.error('Failed to find world:', error)
        return null
    }
}


