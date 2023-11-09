const ul = document.getElementById("tabs")

/*
* Handle deeplinks from popup
*/
document.addEventListener("DOMContentLoaded", async () => {
    const searchParams = new URLSearchParams(document.location.search)
    const name = searchParams.get("name")
    if (!name) return

    await openTab(name)
})

/*
* Handle click events
*/
browser.runtime.sendMessage({ type: "GET_ALL"})
    .then((result) => {
        const tabNames = result.sort()

        if (tabNames.length === 0) {
            document.getElementById("loading").hidden = "hidden"
            document.getElementById("error").hidden = ""
            return
        }

        let currentArtistName
        for(const name of tabNames) {

            // Add artist name heading
            const [artistName, songName] = name.split(" - ")
            if (artistName !== currentArtistName) {
                currentArtistName = artistName
                const h3 = document.createElement("h5")
                h3.textContent = artistName
                h3.id = artistName
                const hr = document.createElement("hr")
                ul.append(h3)
                ul.append(hr)
            }

            const li = document.createElement("li")
            const button = document.createElement("a")
            button.textContent = songName            
            li.onclick = async event => {
                if (event.target.tagName === "BUTTON") return
                openTab(name)
            }
            li.appendChild(button)

            const deleteButton = document.createElement("button")
            const deleteButtonLabel = `Delete ${name}`
            deleteButton.title = deleteButtonLabel
            deleteButton.ariaLabel = deleteButtonLabel
            deleteButton.classList.add("delete")
            deleteButton.innerText = "❌"
            deleteButton.onclick = () => {
                const confirmation = window.confirm(`Are you sure you want to delete ${name}?`)
                if (!confirmation) return
                browser.runtime.sendMessage({ type: "DELETE_ONE", tabName: name })
                    .then(() => window.location.reload())
            }

            li.append(deleteButton)
            ul.appendChild(li)
        }

        document.getElementById("loading").hidden = "hidden"
        document.getElementById("loaded").hidden = ""
    })

async function openTab(tabName) {
    const tabContent = await browser.runtime.sendMessage({ type: "GET_ONE", tabName })
    const tabContainerDiv = document.getElementById("tab")
    tabContainerDiv.hidden = ""

    const tab_heading = document.getElementById("tab_heading")
    tab_heading.replaceChildren()

    const [artistName, songName] = tabName.split(" - ")
    {
        const a = document.createElement("a")
        a.href= `#${artistName}`
        a.text = artistName
        tab_heading.appendChild(a)
    }
    {
        const text = document.createTextNode(" - ")
        tab_heading.appendChild(text)
    }
    {
        const span = document.createElement("span")
        span.innerText = songName
        tab_heading.appendChild(span)
    }

    const pre = document.getElementById("pre")
    pre.replaceChildren()
    pre.scrollLeft = 0
    pre.scrollTop = 0
    
    {
        const sanitizedtabContent = sanitizeTabContent(tabContent)
        const tabContentChunks = sanitizedtabContent.split(/\n\n/)
    
        for (const line of tabContentChunks) {
            const div = document.createElement("div")
            div.textContent = line
            div.className = "tab-section"
            pre.appendChild(div)
        }    
    }

    {
        const button = document.getElementById("split")
        button.onclick = () => {
            const hasSplit = pre.classList.toggle("split")
            const message = hasSplit
                ? "Single Column"
                : "Multi Column"
            button.textContent = message
            pre.scrollLeft = 0
            pre.scrollTop = 0
            tab_heading.scrollIntoView()
        }
    }

    setTimeout(() => tab_heading.scrollIntoView({behavior:"smooth"}), 150)
    document.title = tabName
}

function sanitizeTabContent(tabContent=""){
    return tabContent
        .trim()
        .replace(/X$/, "")
        .replaceAll(/\s*\n\s*\n/g, "\n\n")
        .replaceAll(/\]\n\n/g, "]\n")
}
