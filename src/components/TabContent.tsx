import React, { useState } from "react"
import classnames from "classnames"
import { type Tab } from "../hooks"
import { sanitizeTabContent, parseTabContent } from "../utils"

interface Props {
    tab: Tab
}

const TabContent: React.FC<Props> = ({ tab }) => {
    const [mulitColumn, setMultiColumn] = useState(true)

    const chunks = parseTabContent(sanitizeTabContent(tab.content))

    return (
        <div id="tab" className={classnames({ center: !mulitColumn })}>
            <h3 id="tab_heading">
                <a href={`#${tab.artist}`}>{tab.artist} </a>
                -
                <span> {tab.song}</span>
            </h3>
            <button onClick={() => setMultiColumn(!mulitColumn)}>
                Toggle Column Layout
            </button>
            <pre className={classnames({ split: mulitColumn })}>
                {chunks.map((chunk, i) => (
                    <div className="tab-section" key={i}>
                        {chunk}
                    </div>
                ))}
            </pre>
        </div>
    )
}

export default TabContent
