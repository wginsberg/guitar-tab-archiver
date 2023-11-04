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

            const strong = document.createElement("strong")
            strong.className = "artist"
            strong.textContent = artist

            const a = document.createElement("a")
            a.href = `options.html?name=${encodeURIComponent(name)}`
            a.target="_blank"
            a.textContent = song

            li.append(strong)
            li.append(a)

            ul.appendChild(li)
        }

        const container = document.getElementById("loaded")
        container.hidden = ""
  })
