import React, { useState } from "react"
import classnames from "classnames"
import type { Tab } from "~types/chords"
import { sanitizeTabContent, parseTabContent } from "~utils"
import usePersistantState from "~hooks/usePersistantState"

interface Props {
    tab: Tab
}

const TabContent: React.FC<Props> = ({ tab }) => {
    const [mulitColumn, setMultiColumn] = usePersistantState("multiColumn", true)
    const [fontSizeDelta, setFontSizeDelta] = usePersistantState("fontSize", 0)

    const chunks = parseTabContent(sanitizeTabContent(tab.content))

    const incrementFontSize = () => setFontSizeDelta(fontSizeDelta + 1)
    const decrementFontSize = () => setFontSizeDelta(fontSizeDelta - 1)
    const fontStyle = {
        fontSize: `${2 + (0.5 * fontSizeDelta)}rem`
    }

    return (
        <div id="tab">
            <div className="center">
                <h3 id="tab_heading">
                    <a href={`#${tab.artist}`}>{tab.artist} </a>
                    -
                    <span> {tab.song}</span>
                </h3>
                <div className="tab-controls">
                    <button onClick={() => setMultiColumn(!mulitColumn)}>
                        Toggle Column Layout
                    </button>
                    <div className="font-controls">
                        <span>Font size</span>
                        <button disabled={fontSizeDelta > 2} onClick={incrementFontSize}>+</button>
                        <button disabled={fontSizeDelta < -2} onClick={decrementFontSize}>-</button>
                    </div>
                </div>
            </div>
            <pre className={classnames({ split: mulitColumn, center: !mulitColumn })} style={fontStyle}>
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
