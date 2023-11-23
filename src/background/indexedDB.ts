import { DB_NAME, DB_STORE_TABS, DB_STORE_META, DB_KEY_RECENTS } from "./constants"

function getIndexedDB(name = DB_NAME): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name);

        request.onupgradeneeded = function () {
            const db = request.result
            db.createObjectStore(DB_STORE_TABS, { keyPath: 'key' });
            const metaObjectStore = db.createObjectStore(DB_STORE_META, { keyPath: 'key' });

            metaObjectStore.transaction.oncomplete = function () {
                db.transaction(DB_STORE_META, "readwrite")
                    .objectStore(DB_STORE_META)
                    .add({ key: DB_KEY_RECENTS, value: [] })
            }
        };

        request.onsuccess = () => resolve(request.result)
        request.onerror = reject
    });
}

function getOneFromObjectStore(objectStore: IDBObjectStore, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const request = objectStore.get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = reject
    })
}

function getKeysFromObjectStore(objectStore: IDBObjectStore): Promise<any> {
    return new Promise((resolve, reject) => {
        const request = objectStore.getAllKeys()
        request.onsuccess = () => resolve(request.result)
        request.onerror = reject
    })
}

function deleteOneFromObjectStore(objectStore: IDBObjectStore, key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const request = objectStore.delete(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = reject
    })
}

export {
    getIndexedDB,
    getOneFromObjectStore,
    getKeysFromObjectStore,
    deleteOneFromObjectStore
}
