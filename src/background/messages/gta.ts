import type { PlasmoMessaging } from "@plasmohq/messaging"
import type { GTAMessageType, GTAMessage, GTAMessageResult } from "~types/messages"
import { addNewTab, getRecents, getAll, getTab, deleteTab, deleteAllTabs } from "~background/background"


console.log("env = = ", process.env["NODE_ENV"])

const handler: PlasmoMessaging.Handler<GTAMessageType, GTAMessage, GTAMessageResult> = async (req, res) => {
    console.log({req})
    switch (req.body.type) {
        case "ADD": {
            const { tabName, tabContent} = req.body
            await addNewTab(tabName, tabContent)
        }
        case "GET_RECENTS": {
            const recents = await getRecents()
            console.log({recents})
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
            break
        }
        case "DELETE_ALL": {
            await deleteAllTabs()
            break
        }
    }
}
 
export default handler
