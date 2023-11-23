import { useState, useEffect } from "react"
import type { Tab } from "~types/chords"
import { sendGTAMessage } from "~messaging"

export default function useTab(name: string): Tab | undefined {
    const [tab, setTab] = useState<Tab>()

    useEffect(() => {
        if (!name) return
        sendGTAMessage({ type: "GET_ONE", tabName: name })
            .then(content => {
                const [artist, song] = name.split(" - ")
                const tab = {
                    artist,
                    song,
                    content: content as string
                }
                setTab(tab)
            })
    }, [name])

    return tab
}
