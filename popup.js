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

            const a = document.createElement("a")
            a.href = `options.html?name=${encodeURIComponent(name)}`
            a.target="_blank"
            li.append(a)

            const strong = document.createElement("strong")
            strong.className = "artist"
            strong.textContent = artist
            a.append(strong)

            const br = document.createElement("br")
            a.append(br)

            const span = document.createElement("span")
            span.className = "song"
            span.textContent = song
            a.append(span)

            ul.appendChild(li)
        }

        const container = document.getElementById("loaded")
        container.hidden = ""
  })
