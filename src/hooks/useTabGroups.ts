import { useState, useEffect } from "react"
import type { TabGroup } from "~types/chords"
import { sendGTAMessage } from "~messaging"

export default function useTabGroups(dependency: string): TabGroup[] {
    const [tabGroups, setTabGroups] = useState([] as TabGroup[])

    useEffect(() => {
        sendGTAMessage({ type: "GET_ALL" })
            .then(titles => 
                (titles as string[]).map(recent => {
                    const [artist, song] = recent.split(" - ")
                    return { artist, song }
                })
                .reduce((prev, next) => {
                    const { artist, song } = next
                    const existingSongList = prev.get(artist) || []
                    const newSongList = [...existingSongList, song]
                    prev.set(artist, newSongList)
                    return prev
                }, new Map<string, string[]>())
            )
            .then((artistMap: Map<string, string[]>) => 
                Array.from(artistMap.entries())
                    .map(([artist, songs]) => ({ artist, songs }))
            )
            .then(setTabGroups)
    }, [dependency])

    return tabGroups
}