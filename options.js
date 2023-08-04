const ul = document.getElementById("tabs")

chrome.storage.local.get()
    .then(storage => {
        const tabNames = Object.keys(storage).sort()

        let currentArtistName
        for(const name of tabNames) {
            if (name.startsWith("meta.")) continue

            // Add artist name heading
            const [artistName, songName] = name.split(" - ")
            if (artistName !== currentArtistName) {
                currentArtistName = artistName
                const h3 = document.createElement("h3")
                h3.textContent = artistName
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

                const tab_heading = document.getElementById("tab_heading")
                tab_heading.innerHTML = `<span>${artistName}</span> - <span>${songName}</span>`

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
    })
