const ul = document.getElementById("tabs")

chrome.storage.local.get("meta.recent")
    .then((storage) => {
        const recents = storage["meta.recent"] || []

        if (recents.length === 0) {
            const container = document.getElementById("error")
            container.hidden = ""
            return
        }

        for(const name of recents.reverse()) {
            const li = document.createElement("li")
            li.textContent = name
            ul.appendChild(li)
        }

        const container = document.getElementById("loaded")
        container.hidden = ""
    })
