const ul = document.getElementById("tabs")

browser.runtime.sendMessage({ type: "GET_RECENTS"})
  .then((recents) => {
        if (recents.length === 0) {
            const container = document.getElementById("error")
            container.hidden = ""
            return
        }

        for(const name of recents.reverse()) {
            const [artist, song] = name.split(" - ")
            const li = document.createElement("li")

            li.innerHTML = `
                <span>
                    <strong>${artist}</strong> - <a href="options.html?name=${encodeURIComponent(name)}" target="_blank">${song}</a>
                </span>
            `

            ul.appendChild(li)
        }

        const container = document.getElementById("loaded")
        container.hidden = ""
  })
