import "./browser-polyfill.min.js"

const DB_NAME = "ArchiveOfChordsAndTabs"
const DB_STORE_TABS = "tabs"
const DB_STORE_META = "meta"
const DB_KEY_RECENTS = "recents"

browser.runtime.onMessage.addListener(notify);

function getIndexedDB(name = DB_NAME) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore(DB_STORE_TABS, { keyPath: 'key' });
            const metaObjectStore = db.createObjectStore(DB_STORE_META, { keyPath: 'key' });

            metaObjectStore.transaction.oncomplete = function () {
                db.transaction(DB_STORE_META, "readwrite")
                    .objectStore(DB_STORE_META)
                    .add({ key: DB_KEY_RECENTS, value: [] })
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = reject
    });
}

function getOneFromObjectStore(objectStore, key) {
    return new Promise((resolve, reject) => {
        const request = objectStore.get(key)
        request.onsuccess = function(event) {
            resolve(event.target.result)
        }
        request.onerror = reject
    })
}

function getKeysFromObjectStore(objectStore) {
    return new Promise((resolve, reject) => {
        const request = objectStore.getAllKeys()
        request.onsuccess = function(event) {
            resolve(event.target.result)
        }
        request.onerror = reject
    })
}

function deleteOneFromObjectStore(objectStore, key) {
    return new Promise((resolve, reject) => {
        const request = objectStore.delete(key)
        request.onsuccess = function(event) {
            resolve(event.target.result)
        }
        request.onerror = reject
    })
}

async function addNewTab(tabName, tabContent) {
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

async function getTab(tabName) {
    const db = await getIndexedDB()
    const transaction = db.transaction([DB_STORE_TABS], "readonly")
    return getOneFromObjectStore(transaction.objectStore(DB_STORE_TABS), tabName)
}

async function deleteTab(tabName) {
    const db = await getIndexedDB()
    const transaction = db.transaction([DB_STORE_TABS, DB_STORE_META], "readwrite")

    const { value: recents } = await getOneFromObjectStore(transaction.objectStore(DB_STORE_META), DB_KEY_RECENTS)
    const newRecents = recents.filter(recent => recent !== tabName)
    const metaRecentsRecord = { key: DB_KEY_RECENTS, value: newRecents }
    transaction.objectStore(DB_STORE_META)
        .put(metaRecentsRecord)

    return deleteOneFromObjectStore(transaction.objectStore(DB_STORE_TABS), tabName)
}

async function notify(message) {
    switch (message.type) {
        case "ADD": addNewTab(message.tabName, message.tabContent)
        case "GET_RECENTS": {
            return getRecents()
        }
        case "GET_ALL": {
            return getAll()
        }
        case "GET_ONE": {
            return getTab(message.tabName)
                .then(({ tab }) => tab)
        }
        case "DELETE_ONE": {
            return deleteTab(message.tabName)
        }
    }
}
