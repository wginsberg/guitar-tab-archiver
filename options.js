const ul = document.getElementById("tabs")

chrome.storage.local.get()
    .then(storage => {
        const tabNames = Object.keys(storage).sort()

        for(const name of tabNames) {
            if (name.startsWith("meta.")) continue

            const tab = storage[name]

            const li = document.createElement("li")
            const button = document.createElement("button")
            button.textContent = name            
            button.onclick = () => {
                const pre = document.getElementById("pre")
                pre.textContent = tab
                setTimeout(() => pre.scrollIntoView({behavior:"smooth"}), 150)
                document.title = name

                // Set id for styling
                const lastSelected = document.getElementById("selected")
                if (lastSelected) {
                    lastSelected.id = ""
                }
                li.id = "selected"
            }
            li.appendChild(button)

            const deleteButton = document.createElement("button")
            deleteButton.textContent = "X"
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
