import type { GTAMessage, GTAMessageResult } from "~types/messages";
import { addGTAMessageListener } from "~messaging";
import seed from "~seed"

const DB_NAME = "ArchiveOfChordsAndTabs"
const DB_STORE_TABS = "tabs"
const DB_STORE_META = "meta"
const DB_KEY_RECENTS = "recents"

// Process seed events
seed.events.forEach(notify)

// Watch for incoming new events
addGTAMessageListener(notify);

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

async function addNewTab(tabName: string, tabContent: string) {
    const db = await getIndexedDB()
    const transaction = db.transaction([DB_STORE_TABS, DB_STORE_META], "readwrite")
    const { value: recents } = await getOneFromObjectStore(transaction.objectStore(DB_STORE_META), DB_KEY_RECENTS)

    const newRecents = recents
        ? recents.includes(tabName)
            ? recents
            : [...recents, tabName].slice(-3)
        : [tabName]

    const metaRecentsRecord = { key: DB_KEY_RECENTS, value: newRecents }
    transaction.objectStore(DB_STORE_META)
        .put(metaRecentsRecord)

    const tabRecord = { key: tabName, tab: tabContent }
    transaction.objectStore(DB_STORE_TABS)
        .add(tabRecord)
}

async function getRecents() {
    const db = await getIndexedDB()
    const transaction = db.transaction([DB_STORE_META], "readonly")
    const { value: recents } = await getOneFromObjectStore(transaction.objectStore(DB_STORE_META), DB_KEY_RECENTS)
    return recents
}

async function getAll() {
    const db = await getIndexedDB()
    const transaction = db.transaction([DB_STORE_TABS], "readonly")
    const result = await getKeysFromObjectStore(transaction.objectStore(DB_STORE_TABS))
    return result
}


async function getTab(tabName: string) {
    const db = await getIndexedDB()
    const transaction = db.transaction([DB_STORE_TABS], "readonly")
    return getOneFromObjectStore(transaction.objectStore(DB_STORE_TABS), tabName)
}

async function deleteTab(tabName: string) {
    const db = await getIndexedDB()
    const transaction = db.transaction([DB_STORE_TABS, DB_STORE_META], "readwrite")

    const { value: recents } = await getOneFromObjectStore(transaction.objectStore(DB_STORE_META), DB_KEY_RECENTS)
    const newRecents = recents.filter((recent: string) => recent !== tabName)
    const metaRecentsRecord = { key: DB_KEY_RECENTS, value: newRecents }
    transaction.objectStore(DB_STORE_META)
        .put(metaRecentsRecord)

    return deleteOneFromObjectStore(transaction.objectStore(DB_STORE_TABS), tabName)
}

async function deleteAllTabs() {
    const db = await getIndexedDB()
    const transaction = db.transaction([DB_STORE_TABS, DB_STORE_META], "readwrite")

    transaction.objectStore(DB_STORE_META).put({ key: DB_KEY_RECENTS, value: [] })

    return transaction.objectStore(DB_STORE_TABS).clear()
}

async function notify (message: GTAMessage): Promise<GTAMessageResult> {
    switch (message.type) {
        case "ADD": {
          const { tabName, tabContent } = message
          addNewTab(tabName, tabContent)
        }
        case "GET_RECENTS": {
            return getRecents()
        }
        case "GET_ALL": {
            return getAll()
        }
        case "GET_ONE": {
          const { tabName } = message
          const { tab } = await getTab(tabName)
          return tab
        }
        case "DELETE_ONE": {
          const { tabName } = message
          return deleteTab(tabName)
        }
        case "DELETE_ALL": {
            await deleteAllTabs()
            return "success"
        }
    }
}
