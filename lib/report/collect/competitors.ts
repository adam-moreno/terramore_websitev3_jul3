/**
 * MVP: only use competitor mentions already present on the site.
 * Full SERP competitor matrix is Phase 2.
 */
export function collectCompetitors(pageExcerpts: string[]) {
  const text = pageExcerpts.join(" ").slice(0, 8000)
  const competitors: Array<{ name: string; note: string }> = []
  const vs = Array.from(text.matchAll(/\b(?:vs\.?|versus|compared to|unlike)\s+([A-Z][A-Za-z0-9&.\- ]{2,40})/g))
  for (const match of vs.slice(0, 3)) {
    const name = match[1].trim()
    if (name.length < 3) continue
    competitors.push({
      name,
      note: "Mentioned on the business website in comparative language. Not independently ranked.",
    })
  }
  if (!competitors.length) {
    return {
      available: false as const,
      note: "Competitive comparison: Not available in this report version",
      competitors: [],
    }
  }
  return {
    available: true as const,
    note: "Limited competitor mentions found on the business website only. No SERP competitor matrix in MVP.",
    competitors,
  }
}
