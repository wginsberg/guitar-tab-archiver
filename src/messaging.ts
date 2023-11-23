import type { GTAMessage, GTAMessageResult } from "~types/messages";

declare const browser: typeof chrome; // Declaration merging to satisfy TypeScript

export async function sendGTAMessage(event: GTAMessage): Promise<GTAMessageResult> {
    if (typeof browser !== "undefined") {
        return browser.runtime.sendMessage(event)
    } else if (typeof chrome !== undefined) {
        return chrome.runtime.sendMessage(event)
    } else {
        throw new Error("Unsupported browser")
    }
}

export async function addGTAMessageListener(callback: (message: GTAMessage) => Promise<GTAMessageResult>) {
    // there be dragons here
    if (typeof browser !== "undefined") {
        return browser.runtime.onMessage.addListener(callback)
    } else if (typeof chrome !== undefined) {
        const wrappedCallback = (request: any, sender: any, sendResponse: () => void) => {
            callback(request)
                .then(sendResponse)
            return true
        }
        chrome.runtime.onMessage.addListener(wrappedCallback)
    } else {
        throw new Error("Unsupported browser environment")
    }
}
