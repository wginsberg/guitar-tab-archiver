const ul = document.getElementById("tabs")

chrome.storage.local.get()
    .then(storage => {
        const tabNames = Object.keys(storage).sort()

        if (tabNames.length === 0) {
            document.getElementById("loading").hidden = "hidden"
            document.getElementById("error").hidden = ""
            return
        }

        let currentArtistName
        for(const name of tabNames) {
            if (name.startsWith("meta.")) continue

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

            const tab = storage[name]

            const li = document.createElement("li")
            const button = document.createElement("a")
            button.textContent = songName            
            li.onclick = event => {
                if (event.target.tagName === "BUTTON") return

                const tabContainerDiv = document.getElementById("tab")
                tabContainerDiv.hidden = ""

                const tab_heading = document.getElementById("tab_heading")
                tab_heading.innerHTML = `<a href="#${artistName}">${artistName}</a> - <span>${songName}</span>`

                const pre = document.getElementById("pre")
                pre.textContent = tab

                setTimeout(() => tab_heading.scrollIntoView({behavior:"smooth"}), 150)
                document.title = name
            }
            li.appendChild(button)

            const deleteButton = document.createElement("button")
            const deleteButtonLabel = `Delete ${name}`
            deleteButton.title = deleteButtonLabel
            deleteButton.ariaLabel = deleteButtonLabel
            deleteButton.classList.add("delete")
            deleteButton.innerHTML = "&#10060;"
            deleteButton.onclick = () => {
                const confirmation = window.confirm(`Are you sure you want to delete ${name}?`)
                if (!confirmation) return
                // remove tab data
                chrome.storage.local.remove(name)
                    .then(() => location.reload())
                // remove tab from "recent" list
                chrome.storage.local.get("meta.recent")
                    .then(storage => {
                        const recents = storage["meta.recent"]
                        console.log({ recents, name, includes: recents.includes(name)})
                        if (!recents.includes(name)) return
                        const newRecents = recents.filter(recent => recent !== name)
                        console.log({ newRecents })
                        chrome.storage.local.set({ "meta.recent": newRecents })
                            .then(s => console.log("done", s))
                    })
            }

            li.append(deleteButton)
            ul.appendChild(li)
        }

        document.getElementById("loading").hidden = "hidden"
        document.getElementById("loaded").hidden = ""
    })
