import { DB_STORE_TABS, DB_KEY_RECENTS, DB_STORE_META } from "./constants"
import { getIndexedDB, getOneFromObjectStore, getKeysFromObjectStore, deleteOneFromObjectStore } from "./indexedDB"

import seed from "./seed"

seed.forEach((({ tabName, tabContent}) => addNewTab(tabName, tabContent)))

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

async function getRecents(): Promise<string[]> {
    const db = await getIndexedDB()
    const transaction = db.transaction([DB_STORE_META], "readonly")
    const { value: recents } = await getOneFromObjectStore(transaction.objectStore(DB_STORE_META), DB_KEY_RECENTS)
    return recents
}

async function getAll(): Promise<string[]>  {
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

export {
    addNewTab,
    getRecents,
    getAll,
    getTab,
    deleteTab,
    deleteAllTabs
}
