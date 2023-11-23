import { useState, useEffect } from "react"
import JSZip from "jszip";

import { sendGTAMessage } from "./messaging";

interface TabGroup {
    artist: string;
    songs: string[];
}

export interface Tab {
    artist: string;
    song: string;
    content: string;
}

export function useTabGroups(dependency: string): TabGroup[] {
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

export function useTab(name: string): Tab | undefined {
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

export function useDownloadURL(): string | undefined {
    const [downloadURL, setDownloadURL] = useState("")

    useEffect(() => {
        sendGTAMessage({ type: "GET_ALL" })
            .then(async tabNames => {
                const zip = new JSZip()

                for (const tabName of tabNames) {
                    const tab = await sendGTAMessage( { type: "GET_ONE", tabName })
                    zip.file(`${tabName}.txt`, tab as string)
                }
        
                return zip.generateAsync({type:"blob"})
            })
            .then(zipContent => {
                const url = URL.createObjectURL(zipContent);
                setDownloadURL(url)
        })
    }, [])

    return downloadURL
}
