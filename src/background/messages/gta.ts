import type { PlasmoMessaging } from "@plasmohq/messaging"
import type { GTAMessageType, GTAMessage, GTAMessageResult } from "~types/messages"
import { addNewTab, getRecents, getAll, getTab, deleteTab, deleteAllTabs } from "~background/background"

import { pingExtensionPage } from "~messaging"

const handler: PlasmoMessaging.Handler<GTAMessageType, GTAMessage, GTAMessageResult> = async (req, res) => {
    switch (req.body.type) {
        case "ADD": {
            const { tabName, tabContent} = req.body
            await addNewTab(tabName, tabContent)
            pingExtensionPage()
            break
        }
        case "GET_RECENTS": {
            const recents = await getRecents()
            res.send(recents)
            break
        }
        case "GET_ALL": {
            const tabs = await getAll()
            res.send(tabs)
            break
        }
        case "GET_ONE": {
            const { tabName } = req.body
            const { tab } = await getTab(tabName)
            res.send(tab)
            break
        }
        case "DELETE_ONE": {
            const { tabName } = req.body
            await deleteTab(tabName)
            pingExtensionPage()
            break
        }
        case "DELETE_ALL": {
            await deleteAllTabs()
            pingExtensionPage()
            break
        }
        default: {
            throw new Error(`Unsupported message: ${req.name}`)
        }
    }
    res.send("ok")
}
 
export default handler
