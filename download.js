async function zipTabs(tabs = {}) {
    const zip = new JSZip();

    for (const [title, content] of Object.entries(tabs)) {
        zip.file(`${title}.txt`, content)
    }

    return zip.generateAsync({type:"blob"})
}

async function downloadFile() {
    const tabs = await chrome.storage.local.get()
    delete tabs["meta.recent"]

    zipTabs(tabs)
        .then(zipContent => {
            const url = URL.createObjectURL(zipContent);

            const link = document.getElementById("download");
            link.href = url;
            link.download = "tabs.zip";
            link.textContent = "Download all tabs"
        })
  }

downloadFile()
