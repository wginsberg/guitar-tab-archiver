import { sendToBackground } from "@plasmohq/messaging"
import type { GTAMessage, GTAMessageResult } from "~types/messages";

export async function sendGTAMessage(body: GTAMessage) {
    const result = await sendToBackground<GTAMessage, GTAMessageResult>({
        name: "gta",
        body
    })
    return result
}
