const upload = document.getElementById("upload");
upload.textContent = "Upload some tabs"

upload.onchange = async ({ target: { files: [file] } }) => {
    processZip(file)
        .then(() => alert("Tabs imported successfully."))
        .catch(error => alert(error))
}

async function processZip(file) {
    const zip = await JSZip.loadAsync(file)

    const promises = []
    zip.forEach((fileName, file) => {
        if (!fileName.endsWith(".txt")) throw new Error(`Not a .txt file: ${fileName}`)
        const tabName = fileName.split(".txt")[0]
        const addTabPromise = file.async("string")
            .then(tabContent => {
                return browser.runtime.sendMessage({ type: "ADD", tabName, tabContent })
            })

        promises.push(addTabPromise)
    })
    
    return Promise.all(promises)
}
