
type MessageType = "ADD" | "GET_RECENTS" | "GET_ONE" | "GET_ALL" | "DELETE_ONE" | "DELETE_ALL"

interface MessageBase {
  type: MessageType;
}

interface MessageAdd extends MessageBase {
    type: "ADD"
    tabName: string;
    tabContent: string;
}

interface MessageQueryOne extends MessageBase {
    type: "GET_ONE";
    tabName: string;
}

interface MessageQueryAll extends MessageBase {
    type: "GET_ALL";
}


interface MessageQueryRecents extends MessageBase {
    type: "GET_RECENTS";
}

interface MessageDeleteOne extends MessageBase {
    type: "DELETE_ONE";
    tabName: string;
}

interface MessageDeleteAll extends MessageBase {
    type: "DELETE_ALL";
}

export type GTAMessage = MessageAdd | MessageQueryOne | MessageQueryAll | MessageQueryRecents | MessageDeleteOne | MessageDeleteAll

type MessageResultQueryOne = string
type MessageResultQueryAll = string[]

export type GTAMessageResult = MessageResultQueryAll | MessageResultQueryOne

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
