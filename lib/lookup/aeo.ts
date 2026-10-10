/**
 * Answer-engine (AEO) basics, read from the homepage and robots.txt: what an AI answer engine needs to describe and
 * quote the business. Listed as findings beside the SEO basics. Not part of the Digital Presence Score, which stays
 * the full report's own method.
 */

/** AI crawlers that answer engines use. A site that blocks them can't be read for AI answers. */
export const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"] as const

export type AeoRead = {
  /** schema.org types found in JSON-LD on the homepage, e.g. LocalBusiness, Organization, FAQPage. */
  structuredDataTypes: string[]
  /** AI crawlers whose robots.txt group disallows the whole site. Empty when robots.txt is missing or allows them. */
  blockedCrawlers: string[]
  robotsRead: boolean
  /** An FAQ on the homepage: FAQPage markup or a "frequently asked" / "FAQ" heading. */
  hasFaq: boolean
}

export function structuredDataTypes(html: string): string[] {
  const types = new Set<string>()
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*(\[[^\]]*\]|"[^"]+")/g)) {
      for (const name of t[1].matchAll(/"([^"]+)"/g)) types.add(name[1])
    }
  }
  return [...types].slice(0, 8)
}

/**
 * robots.txt groups: the most specific group for each crawler (its own name, else "*"). Blocked only when that group
 * has "Disallow: /" and no "Allow: /". A partial disallow (a folder) isn't counted as blocking the site.
 */
export function blockedAiCrawlers(robots: string): string[] {
  const groups: Array<{ agents: string[]; rules: string[] }> = []
  let current: { agents: string[]; rules: string[] } | null = null
  for (const rawLine of robots.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim()
    if (!line) continue
    const [key, ...rest] = line.split(":")
    const field = key.trim().toLowerCase()
    const value = rest.join(":").trim()
    if (field === "user-agent") {
      if (!current || current.rules.length) {
        current = { agents: [], rules: [] }
        groups.push(current)
      }
      current.agents.push(value.toLowerCase())
    } else if (current && (field === "disallow" || field === "allow")) {
      current.rules.push(`${field}:${value}`)
    }
  }
  const blocks = (g: { rules: string[] }) => g.rules.includes("disallow:/") && !g.rules.includes("allow:/")
  return AI_CRAWLERS.filter((bot) => {
    const own = groups.find((g) => g.agents.includes(bot.toLowerCase()))
    const group = own ?? groups.find((g) => g.agents.includes("*"))
    return group ? blocks({ rules: group.rules.map((r) => r.replace(/\s+/g, "")) }) : false
  })
}

export function readAeo(homeHtml: string, robots: string | null): AeoRead {
  const types = structuredDataTypes(homeHtml)
  return {
    structuredDataTypes: types,
    blockedCrawlers: robots ? blockedAiCrawlers(robots) : [],
    robotsRead: robots != null,
    hasFaq:
      types.includes("FAQPage") || /<h[1-4][^>]*>[^<]*(?:frequently asked|\bFAQs?\b)[^<]*<\/h[1-4]>/i.test(homeHtml),
  }
}
