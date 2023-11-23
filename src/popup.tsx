import React from "react"
import useRecentTabs from "~hooks/useRecentTabs"

import "~styles/normalize.css"
import "~styles/skeleton.css"
import "~styles/index.css"
import "~styles/popup.css"

const PopupPage = () => {
  const recentTabs = useRecentTabs()
  const hasRecentTabs = recentTabs.length > 0

  if (hasRecentTabs) {
    return (
      <main id="popup">
        <h1>Guitar Tab Archiver</h1>
        <ol>
          {recentTabs.map(({ artist, song }, i) => {
            return (
              <li key={i}>
                <a href={`tabs/options.html?name=${encodeURIComponent(`${artist} - ${song}`)}`} target="_blank">
                  <strong className="artist">{artist}</strong>
                  <br/>
                  <span className="song">{song}</span>
                </a>
              </li>
            )
          })}
        </ol>
        <footer>
            <a href="tabs/options.html" target="_blank">
              <span className="icon">📖</span>
              <span>View all tabs</span>
            </a>
            <a href="tabs/advanced.html" target="_blank">
              <span className="icon">⚙️</span>
              <span>Settings</span>
            </a>
        </footer>
      </main>
    )
  }

  return (
    <main id="popup">
      <h1>Guitar Tab Archiver</h1>
      <p>No guitar tabs archived yet.</p>
      <p>Try browsing <a href="https://www.ultimate-guitar.com/" target="_blank" rel="noopener noreferrer">ultimate-guitar.com</a> and opening some guitar tabs, then check back here.</p>
      <hr />
      <footer>
        <a href="tabs/advanced.html" target="_blank">
          <span className="icon">⚙️</span>
          <span>Settings</span>
        </a>
      </footer>
    </main>
  )
}

export default PopupPage
