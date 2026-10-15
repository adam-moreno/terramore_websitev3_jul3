/**
 * Social links that come with a website template, not the business: a Wix theme's footer links to facebook.com/wix,
 * a WordPress theme to twitter.com/wordpressdotcom, and share buttons to facebook.com/sharer. Counting those as the
 * owner's profiles told Buynest "we found your Facebook" when it has none. Found in the 2026-10-15 owner rerun.
 */

/** Handles that belong to website builders and hosts. */
const BUILDER_HANDLES = new Set([
  "wix", "wixcom", "wordpress", "wordpressdotcom", "wordpresscom", "automattic", "squarespace", "shopify", "godaddy",
  "weebly", "webflow", "jimdo", "duda", "elementor", "hostinger", "ionos", "strikingly", "carrd", "framer",
])

/** First path segments that are features or share endpoints, not profiles. */
const NOT_A_PROFILE = new Set([
  "sharer", "sharer.php", "share", "share.php", "dialog", "plugins", "tr", "intent", "home", "home.php", "explore",
  "accounts", "p", "reel", "watch", "embed", "hashtag", "search", "login", "signup", "help", "legal", "policies",
  "privacy", "about", "your-profile", "yourpage", "yourprofile", "username", "profile.php",
])

/** True for a template or share link; a real profile URL returns false. Never throws. */
export function isPlaceholderSocial(url: string): boolean {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return true
  }
  // Maps and Yelp links are business-specific by construction.
  if (/(^|\.)(google\.com|goo\.gl|g\.page|yelp\.com)$/i.test(parsed.hostname)) return false
  const parts = parsed.pathname.split("/").filter(Boolean).map((p) => p.toLowerCase())
  if (!parts.length) return true
  // linkedin.com/company/<name>, youtube.com/channel/<id>, /c/<name>: the handle is the second segment.
  const handle = ["company", "in", "channel", "c"].includes(parts[0]) ? parts[1] ?? "" : parts[0].replace(/^@/, "")
  if (!handle) return true
  return BUILDER_HANDLES.has(handle) || NOT_A_PROFILE.has(parts[0])
}

/** The first match of `regex` in `html` that isn't a placeholder (regex is used with a global copy). */
export function firstRealSocial(html: string, regex: RegExp): string | null {
  const global = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : `${regex.flags}g`)
  for (const match of html.matchAll(global)) {
    const url = match[0].replace(/[)>,.;]+$/, "")
    if (!isPlaceholderSocial(url)) return url
  }
  return null
}
