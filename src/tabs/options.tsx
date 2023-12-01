import React, { useState, useRef, useEffect } from "react"

import { sendGTAMessage } from "~messaging"
import useTabGroups from "~hooks/useTabGroups"
import usePing from "~hooks/usePing"
import useTab from "~hooks/useTab"
import TabContent from "~components/TabContent"
import TabItem from "~components/TabItem"
import SearchForm from "~components/SearchForm"

import "~styles/normalize.css"
import "~styles/skeleton.css"
import "~styles/index.css"
import "~styles/settings.css"

export default function SettingsPage() {
  const lastPing = usePing()
  const [lastDeletion, setLastDeletion] = useState("")
  const dirtyDependencies = [lastPing, lastDeletion]

  const tabGroups = useTabGroups(dirtyDependencies)
  const [activeTab, setActiveTab] = useState("")
  const tabContentRef = useRef<HTMLDivElement>(null)
  const activeTabContent = useTab(activeTab)

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    const name = searchParams.get("name")
    if (!name) return
    setActiveTab(name)
  }, [])

  const scrollTabIntoView = () => {
    tabContentRef.current?.scrollIntoView()
  }

  useEffect(() => {
    if (!activeTabContent) return
    scrollTabIntoView()
  }, [activeTabContent])

  const deleteTab = (tabName: string) => {
    const confirmation = confirm(`Are you sure you want to delete ${tabName}`)
    if (!confirmation) return
    sendGTAMessage({ type: "DELETE_ONE", tabName })
      .then(() => {
        setLastDeletion(tabName)
        if (activeTab === tabName) setActiveTab("")
      })
  }

  const onSelectTab = (artist: string, song: string) => {
    const name = `${artist} - ${song}`

    const searchParams = new URLSearchParams()
    searchParams.append("name", name)

    const nextURL = `${location.pathname}?${searchParams.toString()}`
    history.replaceState(null, null, nextURL)

    if (name === activeTab) scrollTabIntoView()

    setActiveTab(name)
  }

  const hasTabGroups = tabGroups.length > 0

  if (!hasTabGroups) return (
    <main>
      <h1 className="center">Guitar Tab Archiver</h1>
      <div className="center">
        <p>No guitar tabs archived yet.</p>
        <SearchForm />
        <p>Try browsing <a href="https://www.ultimate-guitar.com/" target="_blank" rel="noopener noreferrer">ultimate-guitar.com</a> and opening some guitar tabs, then check back here.</p>
        <a href="/tabs/advanced.html">Advanced Settings</a>
      </div>
    </main>
  )


  return (
    <main>
      <h1 className="center">Guitar Tab Archiver</h1>
      <p className="center">
        <a href="/tabs/advanced.html">Advanced Settings</a>
      </p>
      <SearchForm />
      <ol className="center">
        {tabGroups.map(({ artist, songs }) => (
          <div key={artist}>
            <h5 id={artist}>{artist}</h5>
            <hr />
            {songs.map(song => (
              <li key={`${artist} - ${song}`}>
                <TabItem
                  song={song}
                  onSelect={() => onSelectTab(artist, song)}
                  onDelete={() => deleteTab(`${artist} - ${song}`)}
                />
              </li>
            ))}
          </div>
        ))}
      </ol>
      <div>
        {activeTabContent && (
          <div ref={tabContentRef} >
            <TabContent tab={activeTabContent} />
          </div>
        )}
      </div>
    </main>
  )
}
