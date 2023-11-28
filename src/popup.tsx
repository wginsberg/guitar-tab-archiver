import React from "react"
import SearchForm from "~components/SearchForm"
import usePing from "~hooks/usePing"
import useRecentTabs from "~hooks/useRecentTabs"
import useTabCount from "~hooks/useTabCount"
import "~styles/popup.css"

const PopupPage = () => {
  const lastPing = usePing()
  const [recentTabs, isRecentTabsLoading] = useRecentTabs([lastPing])
  const [tabCount, isTabCountLoading] = useTabCount()

  const isLoadingState = isTabCountLoading || isRecentTabsLoading
  const hasRecentTabs = recentTabs.length > 0

  if (isLoadingState) {
    return (
      <main>
        <h1>Guitar Tab Archiver</h1>
      </main>
    )
  }

  const isEmptyState = tabCount === 0

  if (isEmptyState) {
    return (
      <main>
        <h1>Guitar Tab Archiver</h1>
        <p>No guitar tabs archived yet.</p>
        <SearchForm />
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

  if (!hasRecentTabs) {
    return (
      <main>
        <h1>Guitar Tab Archiver</h1>
        <SearchForm />
        <br></br>
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
    <main>
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

export default PopupPage
