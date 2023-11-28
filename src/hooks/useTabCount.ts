import { useState, useEffect } from "react"
import type { Tab } from "~types/chords"
import { sendGTAMessage } from "~messaging"
import type { MessageResultQueryCount } from "~types/messages"

export default function useTabCount(): [Number, Boolean] {
    const [loading, setLoading] = useState(true)
    const [count, setCount] = useState<Number>()

    useEffect(() => {
        sendGTAMessage({ type: "GET_COUNT" })
            .then((count: MessageResultQueryCount) => {
                setCount(count)
                setLoading(false)
            })
    }, [])

    return [count, loading]
}
