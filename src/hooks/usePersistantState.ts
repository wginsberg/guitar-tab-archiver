import { useState, useEffect } from "react"

export default function<T>(key: string, defaultValue: T): [T, (newValue: T) => void] {
    const [state, _setState] = useState(defaultValue)

    useEffect(() => {
        const perisistedValue = localStorage.getItem(key)
        if(perisistedValue !== null) {
            const { value } = JSON.parse(perisistedValue)
            _setState(value)
        }
    }, [key])

    const setState = (newValue: T) => {
        _setState(newValue)
        const json = JSON.stringify({ value: newValue })
        localStorage.setItem(key, json)
    }

    return [state, setState]
}
