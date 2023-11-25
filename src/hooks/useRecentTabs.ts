import { useState, useEffect } from "react"
import { sendGTAMessage } from "~messaging";

interface Tab {
    artist: string;
    song: string
}

function useRecentTabs(dependencies: any[]): Tab[] {
    const [recents, setRecents] = useState([] as Tab[])

    useEffect(() => {
        sendGTAMessage({ type: "GET_RECENTS" })
            .then(recents => 
                (recents as string[]).map(recent => {
                    const [artist, song] = recent.split(" - ")
                    return { artist, song }
                })
                .reverse()
            )
            .then(setRecents)
    }, dependencies)

    return recents
}

export default useRecentTabs
