/**
 * Where a site's sitemap lives. Not always /sitemap.xml at the domain root: a free Wix site at
 * user.wixsite.com/buynest publishes /buynest/sitemap.xml, and robots.txt can name any address ("Sitemap: …").
 * Checking only the root told Buynest it had no sitemap when Wix publishes one (2026-10-15 owner rerun).
 */

type Fetched = { status: number; text: string } | null

/** Addresses to try, in order: robots.txt "Sitemap:" lines on the same host, the site's folder, then the root. */
export function sitemapCandidates(siteUrl: string, robotsText: string | null | undefined): string[] {
  let site: URL
  try {
    site = new URL(siteUrl)
  } catch {
    return []
  }
  const out: string[] = []
  const add = (raw: string) => {
    try {
      const url = new URL(raw, site.origin)
      if (url.host === site.host && !out.includes(url.toString())) out.push(url.toString())
    } catch {
      // ignore a malformed robots line
    }
  }
  for (const match of (robotsText ?? "").matchAll(/^\s*sitemap:\s*(\S+)/gim)) add(match[1])
  const folder = site.pathname.split("/").filter(Boolean)[0]
  if (folder && !/\.\w{2,5}$/.test(folder)) add(`/${folder}/sitemap.xml`)
  add("/sitemap.xml")
  return out.slice(0, 4)
}

export function isSitemap(page: Fetched): boolean {
  return Boolean(page && page.status < 400 && /<urlset|<sitemapindex/i.test(page.text))
}

/** True when any candidate answers with a sitemap. Tries them one at a time and stops at the first. */
export async function hasSitemapAt(
  siteUrl: string,
  robotsText: string | null | undefined,
  fetchText: (url: string, timeoutMs?: number) => Promise<Fetched>,
): Promise<boolean> {
  for (const url of sitemapCandidates(siteUrl, robotsText)) {
    if (isSitemap(await fetchText(url, 6000))) return true
  }
  return false
}
