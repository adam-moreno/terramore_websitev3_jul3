/**
 * Social profiles a visitor adds after the lookup. A profile the site already links to is counted as found from the
 * site; one the visitor adds is counted the same way by the report's scoring (a profile that exists), but it's marked
 * as added by them and not checked, and the findings say it isn't linked from the site.
 */

export const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", prefix: "instagram.com/", url: (h: string) => `https://www.instagram.com/${h}` },
  { id: "facebook", label: "Facebook", prefix: "facebook.com/", url: (h: string) => `https://www.facebook.com/${h}` },
  { id: "tiktok", label: "TikTok", prefix: "tiktok.com/@", url: (h: string) => `https://www.tiktok.com/@${h}` },
  { id: "youtube", label: "YouTube", prefix: "youtube.com/@", url: (h: string) => `https://www.youtube.com/@${h}` },
  { id: "linkedin", label: "LinkedIn", prefix: "linkedin.com/company/", url: (h: string) => `https://www.linkedin.com/company/${h}` },
] as const

export type SocialPlatformId = (typeof SOCIAL_PLATFORMS)[number]["id"]

export type AddedSocial = { platform: SocialPlatformId; handle: string; url: string }

const HOSTS: Record<SocialPlatformId, RegExp> = {
  instagram: /^(?:www\.)?instagram\.com$/i,
  facebook: /^(?:www\.|m\.)?facebook\.com$/i,
  tiktok: /^(?:www\.)?tiktok\.com$/i,
  youtube: /^(?:www\.|m\.)?youtube\.com$/i,
  linkedin: /^(?:www\.)?linkedin\.com$/i,
}

const HANDLE = /^[A-Za-z0-9._-]{1,100}$/

/**
 * Accepts "@name", "name", "instagram.com/name" or a full profile URL. Returns null for anything that isn't a plain
 * handle on that platform, so a pasted link can never point somewhere else.
 */
export function parseSocial(platform: SocialPlatformId, raw: unknown): AddedSocial | null {
  if (typeof raw !== "string") return null
  let value = raw.trim()
  if (!value) return null
  const def = SOCIAL_PLATFORMS.find((p) => p.id === platform)
  if (!def) return null

  if (/[/.]/.test(value) && /(?:^https?:\/\/)|(?:\.com\b)/i.test(value)) {
    let url: URL
    try {
      url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    } catch {
      return null
    }
    if (!HOSTS[platform].test(url.hostname)) return null
    const parts = url.pathname.split("/").filter(Boolean)
    if (platform === "linkedin") {
      if (parts.length < 2 || !["company", "in"].includes(parts[0])) return null
      value = parts[1]
    } else if (platform === "youtube" && parts[0] && ["channel", "c"].includes(parts[0])) {
      value = parts[1] ?? ""
    } else {
      value = parts[0] ?? ""
    }
  }
  value = value.replace(/^@/, "")
  if (!HANDLE.test(value)) return null
  return { platform, handle: value, url: def.url(value) }
}

/** The request body's socials, parsed; unknown platforms and duplicates are dropped. At most one per platform. */
export function parseSocials(raw: unknown): AddedSocial[] {
  if (!Array.isArray(raw)) return []
  const out = new Map<SocialPlatformId, AddedSocial>()
  for (const item of raw.slice(0, SOCIAL_PLATFORMS.length)) {
    const platform = (item as { platform?: unknown } | null)?.platform
    if (typeof platform !== "string" || !SOCIAL_PLATFORMS.some((p) => p.id === platform)) continue
    const parsed = parseSocial(platform as SocialPlatformId, (item as { handle?: unknown }).handle)
    if (parsed && !out.has(parsed.platform)) out.set(parsed.platform, parsed)
  }
  return [...out.values()]
}
