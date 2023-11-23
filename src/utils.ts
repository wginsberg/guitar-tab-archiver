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
