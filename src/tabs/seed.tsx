import { useEffect } from "react";
import { sendGTAMessage } from "~messaging";
import seed from "~seed";

export default function SeedPage() {
    useEffect(() => {
        seed.events.forEach(sendGTAMessage)
    }, [])

    return "seed"
}
