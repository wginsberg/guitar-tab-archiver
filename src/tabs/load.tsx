/*
* Load test the application with a large volume of tabs
*/

import { useEffect, useState } from "react";
import { type GTAMessageType } from "~types/messages"
import { sendGTAMessage } from "~messaging";

function generateRandomChar() {
    return String.fromCharCode(Math.floor(Math.random() * 94) + 33)
}

function generateRandomString (length: number) {
    return Array.from({ length }, generateRandomChar).join('');
} 

export default function LoadTestPage() {
    const [last, setLast] = useState("")
    useEffect(() => {
        (async () => {
            while (true) {
                for (let i = 0; i < 100; i += 1) {
                    const artist = generateRandomString(6)
                    const songCount = 1 + Math.random() * 20
                    for (let j = 0; j < songCount; j += 1) {
                        const song = generateRandomString(20)
                        const tabName = `${artist} - ${song}`
                        const tabContent = generateRandomString(1024 + Math.random() * 1024)
                        const event = {
                            type: "ADD" as GTAMessageType,
                            tabName,
                            tabContent
                        }
                        await sendGTAMessage(event)
                        setLast(JSON.stringify(event))
                        await new Promise(resolve => setTimeout(resolve, 100))
                    }
                }
            }
        })()
    }, [])

    return (<pre>{last}</pre>)
}
