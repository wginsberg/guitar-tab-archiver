function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElement('pre')
    .then(async () => {
        const tab = document.getElementsByTagName('pre')[0].textContent

        const artist = document.getElementsByTagName("h1")[0].nextSibling.nextSibling.textContent
        const [_, title] = document.title.match((/(.*) by .*/))
        const key = `${artist} - ${title}`
        
        const recents = await chrome.storage.local.get("meta.recent")
            .then(storage => storage["meta.recent"])

        const newRecents = recents
            ? recents.includes(key)
                ? recents
                : [...recents, key].slice(-3)
            : [key]

        chrome.storage.local.set({
            [key]: tab,
            "meta.recent": newRecents
        })
    })
