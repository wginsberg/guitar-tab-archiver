import React, { useState } from "react"
import classnames from "classnames"
import type { Tab } from "~types/chords"
import { sanitizeTabContent, parseTabContent } from "~utils"
import usePersistantState from "~hooks/usePersistantState"
import IconMinus from "react:~/assets/magnifying-glass-with-minus-sign-svgrepo-com.svg"
import IconPlus from "react:~/assets/plus-zoom-magnifying-glass-interface-symbol-svgrepo-com.svg"

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
                        <button aria-label="Decrease font size" title="Decrease font size" disabled={fontSizeDelta < -2} onClick={decrementFontSize}>
                            <IconMinus />
                        </button>
                        <button aria-label="Increase font size" title="Increase font size" disabled={fontSizeDelta > 2} onClick={incrementFontSize}>
                            <IconPlus />
                        </button>
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
