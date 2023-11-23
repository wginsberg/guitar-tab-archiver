import React from "react"
import JSZip from "jszip"

import { useDownloadURL } from "../hooks"

import { type GTAMessageResult, sendGTAMessage } from "../messaging"

import "../styles/normalize.css"
import "../styles/skeleton.css"
import "../styles/index.css"

async function processZip(file: File) {
    const zip = await JSZip.loadAsync(file)

    const promises: Promise<GTAMessageResult>[] = []
    zip.forEach((fileName, file) => {
        if (!fileName.endsWith(".txt")) throw new Error(`Not a .txt file: ${fileName}`)
        const tabName = fileName.split(".txt")[0]
        const addTabPromise = file.async("string")
            .then(tabContent => {
                return sendGTAMessage({ type: "ADD", tabName, tabContent })
            })

        promises.push(addTabPromise)
    })
    
    return Promise.all(promises)
}

async function importTabs(event: React.ChangeEvent<HTMLInputElement>) {
    const { target: { files } } = event
    if (!files || !files[0]) {
        alert("Failed to import tabs.")
        return
    }

    const [file] = files

    processZip(file)
        .then((results) => {
            alert(`Successfully imported ${results.length} tabs.`)
            window.location.pathname = "options.html"
        })
        .catch(error => alert(error))
}

async function deleteAllTabs() {
    const confirmed = confirm("Are you sure you want to delete all tabs?")
    if (!confirmed) return

    await sendGTAMessage({ type: "DELETE_ALL" })

    alert("Deleted all tabs")
    window.location.pathname = "options.html"
}

export default function AdvancedSettings() {
    const downloadURL = useDownloadURL()

    return (
        <main className="center">
            <h1>Guitar Tab Archiver</h1>
            <a href="options.html">View tabs</a>

            <h2>Export tabs</h2>
            <p>
                {downloadURL && (<a href={downloadURL} download="tabs.zip">Download all tabs</a>) }
            </p>

            <label>
                <h2>Import tabs</h2>
                <input type="file" accept=".zip" name="file" onChange={importTabs} />
            </label>
            <label>
                <h2>Clear data</h2>
                <button onClick={deleteAllTabs}>Delete all tabs</button>
            </label>  
        </main>
    )
}