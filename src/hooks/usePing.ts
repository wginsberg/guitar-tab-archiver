import { useEffect, useState } from "react";

type PingCount = Number

export default function(): PingCount {
    const [pingCount, setPingCount] = useState(0)

    useEffect(() => {
        chrome.runtime.onMessage.addListener((message) => {
            setPingCount(x => x + 1)
        })
    })

    return pingCount
}
