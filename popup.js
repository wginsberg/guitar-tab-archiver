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
            strong.textContent = artist

            const a = document.createElement("a")
            a.href = `options.html?name=${encodeURIComponent(name)}`
            a.target="_blank"
            a.textContent = song

            const span = document.createElement("span")
            span.append(strong)
            span.append(" - ")
            span.append(a)

            li.append(span)

            ul.appendChild(li)
        }

        const container = document.getElementById("loaded")
        container.hidden = ""
  })
