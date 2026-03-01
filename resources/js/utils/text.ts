export function stripHtml(html: string): string {
  if (!html) return ""
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()
}

export function getExcerpt(
  html: string,
  wordLimit: number = 25
): string {
  if (!html) return "বিস্তারিত পাওয়া যায়নি"

  const cleanText = stripHtml(html)

  const words = cleanText.split(" ")

  if (words.length <= wordLimit) return cleanText

  return words.slice(0, wordLimit).join(" ") + "…"
}