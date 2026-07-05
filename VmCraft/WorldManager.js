import { Dexie } from './dexie.mjs'

// ----------------------------------------- init database

const db = new Dexie("Worlds")

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

export async function saveWorld(world) {
    try {
        const name = world.name.trim()

        const existing = await db.worlds.where('name').equals(name).first()

        if (existing) {
            const updatedWorld = {
                id: existing.id,
                name: name,
                data: world.data ?? {}
            }
            await db.worlds.put(updatedWorld)
            console.log(`World "${name}" saved (ID: ${existing.id})`)
            return updatedWorld
        } else {
            const newWorld = {
                name: name,
                data: world.data ?? {}
            }
            const id = await db.worlds.add(newWorld)
            console.log(`World "${name}" created (ID: ${id})`)
            return newWorld
        }
    } catch (error) {
        console.error('Failed saving world:', error)
        throw error
    }
}

// -----------------------------------------


