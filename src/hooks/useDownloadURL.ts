import JSZip from "jszip"
import { useState, useEffect } from "react"
import { sendGTAMessage } from "~messaging"

export default function useDownloadURL(): string | undefined {
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
