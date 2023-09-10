import { addNewTab } from "./background.prod.js"

browser.runtime.onInstalled.addListener(() => {
    addNewTab("Test Artist - TEST CHORDS", "test content")
});
