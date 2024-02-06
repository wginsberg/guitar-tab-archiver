import { useState, useEffect } from "react"
import { sendGTAMessage } from "~messaging";
import { parseTabName } from "~utils"

interface Tab {
    artist: string;
    song: string
}

function useRecentTabs(dependencies: any[]): [Tab[], Boolean] {
    const [loading, setLoading] = useState(true)
    const [recents, setRecents] = useState([] as Tab[])

    useEffect(() => {
        sendGTAMessage({ type: "GET_RECENTS" })
            .then(recents =>  {
                const formattedRecents = (recents as string[])
                    .map(recent => {
                        const [artist, song] = parseTabName(recent)
                        return { artist, song }
                    })
                    .reverse()
                setRecents(formattedRecents)
                setLoading(false)
            })
    }, dependencies)

    return [recents, loading]
}

export default useRecentTabs
