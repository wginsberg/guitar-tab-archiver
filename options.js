const ul = document.getElementById("tabs")

browser.runtime.sendMessage({ type: "GET_ALL"})
    .then((result) => {
        const tabNames = result.sort()

        if (tabNames.length === 0) {
            document.getElementById("loading").hidden = "hidden"
            document.getElementById("error").hidden = ""
            return
        }

        let currentArtistName
        for(const name of tabNames) {

            // Add artist name heading
            const [artistName, songName] = name.split(" - ")
            if (artistName !== currentArtistName) {
                currentArtistName = artistName
                const h3 = document.createElement("h5")
                h3.textContent = artistName
                h3.id = artistName
                const hr = document.createElement("hr")
                ul.append(h3)
                ul.append(hr)
            }

            // const tab = storage[name]

            const li = document.createElement("li")
            const button = document.createElement("a")
            button.textContent = songName            
            li.onclick = async event => {
                if (event.target.tagName === "BUTTON") return

                const tabContent = await browser.runtime.sendMessage({ type: "GET_ONE", tabName: name })
                const tabContainerDiv = document.getElementById("tab")
                tabContainerDiv.hidden = ""

                const tab_heading = document.getElementById("tab_heading")
                tab_heading.replaceChildren()
                {
                    const a = document.createElement("a")
                    a.href= `#${artistName}`
                    a.text = artistName
                    tab_heading.appendChild(a)
                }
                {
                    const text = document.createTextNode(" - ")
                    tab_heading.appendChild(text)
                }
                {
                    const span = document.createElement("span")
                    span.innerText = songName
                    tab_heading.appendChild(span)
                }

                const pre = document.getElementById("pre")
                pre.textContent = tabContent

                setTimeout(() => tab_heading.scrollIntoView({behavior:"smooth"}), 150)
                document.title = name
            }
            li.appendChild(button)

            const deleteButton = document.createElement("button")
            const deleteButtonLabel = `Delete ${name}`
            deleteButton.title = deleteButtonLabel
            deleteButton.ariaLabel = deleteButtonLabel
            deleteButton.classList.add("delete")
            deleteButton.innerText = "❌"
            deleteButton.onclick = () => {
                const confirmation = window.confirm(`Are you sure you want to delete ${name}?`)
                if (!confirmation) return
                browser.runtime.sendMessage({ type: "DELETE_ONE", tabName: name })
                    .then(() => window.location.reload())
            }

            li.append(deleteButton)
            ul.appendChild(li)
        }

        document.getElementById("loading").hidden = "hidden"
        document.getElementById("loaded").hidden = ""
    })
