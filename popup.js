const ul = document.getElementById("tabs")

chrome.storage.local.get("meta.recent")
    .then((storage) => {
        const recents = storage["meta.recent"] || []
        for(const name of recents.reverse()) {
            const li = document.createElement("li")
            li.textContent = name
            ul.appendChild(li)
        }        
    })
