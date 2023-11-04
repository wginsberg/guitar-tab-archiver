import { addNewTab } from "./background.prod.js"

const tabName = "Test Artist - TEST CHORDS"
const tabContent = `
    Test content

    A long line:
    ----------------------------------------------------------------------------------------
`

browser.runtime.onInstalled.addListener(() => {
    addNewTab(tabName, tabContent)
    addNewTab(tabName+"2", tabContent)
    addNewTab("King Gizzard and the Lizard Wizard - ROBOT STOP", tabContent)

});
