async function zipTabs(tabs = {}) {
    const zip = new JSZip();

    for (const [title, content] of Object.entries(tabs)) {
        zip.file(`${title}.txt`, content)
    }

    return zip.generateAsync({type:"blob"})
}

browser.runtime.sendMessage({ type: "GET_ALL"})
    .then(async tabNames => {
        const zip = new JSZip()

        for (const tabName of tabNames) {
            const tab = await browser.runtime.sendMessage( { type: "GET_ONE", tabName })
            zip.file(`${tabName}.txt`, tab)
        }

        return zip.generateAsync({type:"blob"})
    })
    .then(zipContent => {
        const url = URL.createObjectURL(zipContent);

        const link = document.getElementById("download");
        link.href = url;
        link.download = `tabs.zip`;
        link.textContent = "Download all tabs"
})
