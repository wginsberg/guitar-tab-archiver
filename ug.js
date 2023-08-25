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
    .then(() => {
        const tabContent = document.getElementsByTagName('pre')[0].textContent

        const artist = document.getElementsByTagName("h1")[0].nextSibling.nextSibling.textContent
        const [_, title] = document.title.match((/(.*) by .*/))
        const tabName = `${artist} - ${title}`

        browser.runtime.sendMessage({ type: "ADD", tabName, tabContent })
    })
