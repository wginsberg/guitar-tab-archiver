const ul = document.getElementById("tabs")

chrome.storage.local.get()
    .then(storage => {
        const tabNames = Object.keys(storage).sort()
        console.log({tabNames})
        for(const name of tabNames) {
            if (name.startsWith("meta.")) continue

            const tab = storage[name]

            const a = document.createElement("button")
            a.textContent = name            
            a.onclick = () => {
                const pre = document.getElementById("pre")
                pre.textContent = tab
                pre.scrollIntoView({behavior:"smooth"})
            }

            const li = document.createElement("li")
            li.appendChild(a)

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
