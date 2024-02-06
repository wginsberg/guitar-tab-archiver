export function sanitizeTabContent(text:string): string {
    return text
        .trim()
        .replace(/X$/, "")
        .replace(/\s*\n\s*\n/g, "\n\n")
        .replace(/\]\n\n/g, "]\n")
}

export function parseTabContent(text: string): string[] {
    return text.split("\n\n")
}

export function parseTabName(tabName: string): [string, string] {
    const SEPARATOR = " - "
    const separatorIndex = tabName.indexOf(SEPARATOR)
    const artist = tabName.slice(0, separatorIndex)
    const song = tabName.slice(separatorIndex + SEPARATOR.length)
    return [artist, song]
}
