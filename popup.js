const ul = document.getElementById("tabs")

browser.runtime.sendMessage({ type: "GET_RECENTS"})
  .then((recents) => {
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
