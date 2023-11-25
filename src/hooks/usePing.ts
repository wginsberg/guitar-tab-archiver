import { useEffect, useState } from "react";

type PingCount = Number

export default function(): PingCount {
    const [pingCount, setPingCount] = useState(0)

    useEffect(() => {
        function listener () {
            setPingCount(x => x + 1)
        }
        chrome.runtime.onMessage.addListener(listener)
        return () => chrome.runtime.onMessage.removeListener(listener)
    }, [])

    return pingCount
}
