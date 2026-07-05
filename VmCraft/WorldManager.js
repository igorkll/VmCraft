import { Dexie } from './dexie.mjs';

const db = new Dexie("Worlds");

db.version(1).stores({
    worlds: '++id, name'
});

export function worldList() {
    
}
