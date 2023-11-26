import { useEffect } from "react";
import { sendGTAMessage } from "~messaging";
import seed from "~seed";

export default function SeedPage() {
    useEffect(() => {
        Promise.all(seed.events.map(sendGTAMessage))
            .then(() => {
                window.location.pathname = "/tabs/options.html"
            })
    }, [])

    return "seed"
}
