import React, { useEffect, useRef, useState } from "react"
import classnames from "classnames"
import type { Tab } from "~types/chords"
import { sanitizeTabContent, parseTabContent } from "~utils"
import usePersistantState from "~hooks/usePersistantState"
import IconMinus from "react:~/assets/magnifying-glass-with-minus-sign-svgrepo-com.svg"
import IconPlus from "react:~/assets/plus-zoom-magnifying-glass-interface-symbol-svgrepo-com.svg"

interface Props {
    tab: Tab,
    close: () => void
}

const MAX_FONT_SIZE_DELTA = 5

const TabContent: React.FC<Props> = ({ tab, close }) => {
    const [mulitColumn, setMultiColumn] = usePersistantState("multiColumn", true)
    const [fontSizeDelta, setFontSizeDelta] = usePersistantState("fontSize", 0)
    const preRef = useRef(null)

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                close()
            }
        }
        addEventListener("keydown", listener)
        return () => removeEventListener("keydown", listener)
    }, [])

    useEffect(() => {
        preRef.current.scrollTo({ left: 0, top: 0 })
    }, [tab])

    const chunks = parseTabContent(sanitizeTabContent(tab.content))

    const incrementFontSize = () => setFontSizeDelta(fontSizeDelta + 1)
    const decrementFontSize = () => setFontSizeDelta(fontSizeDelta - 1)
    const fontStyle = {
        fontSize: `${2 + (0.2 * fontSizeDelta)}rem`
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
                        <button
                            aria-label="Decrease font size"
                            title="Decrease font size"
                            disabled={fontSizeDelta < -MAX_FONT_SIZE_DELTA}
                            onClick={decrementFontSize}
                        >
                            <IconMinus />
                        </button>
                        <button
                            aria-label="Increase font size"
                            title="Increase font size"
                            disabled={fontSizeDelta > MAX_FONT_SIZE_DELTA}
                            onClick={incrementFontSize}
                        >
                            <IconPlus />
                        </button>
                    </div>
                </div>
            </div>
            <pre
                ref={preRef}
                className={classnames({ split: mulitColumn, center: !mulitColumn })}
                style={fontStyle}
            >
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
