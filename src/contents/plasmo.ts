import type { PlasmoCSConfig } from "plasmo"
import { sendGTAMessage } from "../messaging"

export const config: PlasmoCSConfig = {
  matches: ["*://*.ultimate-guitar.com/*"]
}

waitForElement('pre')
  .then(() => {
    const tabContent = document.getElementsByTagName('pre')[0].textContent
      if (!tabContent) return

      const artistElement = document.getElementsByTagName("h1")[0].nextSibling?.nextSibling || // desktop
          document.getElementsByTagName('h2')[0].childNodes[1]                                // mobile

      const artist = artistElement.textContent
      const [_, title] = document.title.match((/(.*) by .*/)) || []

      if (!artist || !title) return

      const tabName = `${artist} - ${title}`

      return sendGTAMessage({ type: "ADD", tabName, tabContent })
  })

function waitForElement(selector: string) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
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
