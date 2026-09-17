import type { DirectoryProfile } from "@/lib/report/types"

const SOCIAL: Array<[string, RegExp]> = [
  ["instagram", /https?:\/\/(?:www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?/i],
  ["facebook", /https?:\/\/(?:www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?/i],
  ["tiktok", /https?:\/\/(?:www\.)?tiktok\.com\/@[A-Za-z0-9_.-]+\/?/i],
  ["youtube", /https?:\/\/(?:www\.)?youtube\.com\/(?:@|channel\/|c\/)[A-Za-z0-9_.-]+\/?/i],
  ["linkedin", /https?:\/\/(?:www\.)?linkedin\.com\/(?:company|in)\/[A-Za-z0-9_.-]+\/?/i],
  ["x", /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[A-Za-z0-9_]+\/?/i],
  ["yelp", /https?:\/\/(?:www\.)?yelp\.com\/biz\/[A-Za-z0-9_.-]+\/?/i],
  ["googleMaps", /https?:\/\/(?:www\.)?(?:google\.com\/maps|maps\.app\.goo\.gl|g\.page)\/[^\s"'<>]+/i],
]

const REQUIRED = ["instagram", "facebook", "tiktok", "linkedin", "youtube", "yelp"] as const

/**
 * Discover directory/social links only from page HTML. Never invent profiles.
 */
export function collectDirectories(htmlPages: Array<{ url: string; html: string }>): DirectoryProfile[] {
  const found = new Map<string, string>()
  for (const page of htmlPages) {
    for (const [platform, regex] of SOCIAL) {
      if (found.has(platform)) continue
      const match = page.html.match(regex)
      if (match) found.set(platform, match[0].replace(/[)>,.;]+$/, ""))
    }
  }

  const profiles: DirectoryProfile[] = REQUIRED.map((platform) => {
    const url = found.get(platform) || null
    return {
      platform,
      url,
      found: Boolean(url),
      linkedFromSite: Boolean(url),
      note: url ? "Linked from website pages checked." : "Not found in sources checked",
    }
  })

  for (const [platform, url] of found) {
    if ((REQUIRED as readonly string[]).includes(platform)) continue
    profiles.push({
      platform,
      url,
      found: true,
      linkedFromSite: true,
      note: "Linked from website pages checked.",
    })
  }

  return profiles
}
