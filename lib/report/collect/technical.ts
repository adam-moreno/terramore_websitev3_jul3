import type { TechnicalSnapshot } from "@/lib/report/types"
import { fetchText, pickAttr } from "@/lib/report/collect/fetch"
import { hasSitemapAt } from "@/lib/report/collect/sitemap"

export async function collectTechnical(website: string | null, homeHtml?: string | null, homeStatus?: number | null, finalUrl?: string | null): Promise<TechnicalSnapshot> {
  const empty: TechnicalSnapshot = {
    https: Boolean(website?.startsWith("https://")),
    title: null,
    description: null,
    canonical: null,
    hasRobots: false,
    hasSitemap: false,
    viewport: false,
    status: homeStatus ?? null,
    note: website ? "Technical basics collected from public responses." : "No website provided.",
  }
  if (!website) return empty

  let html = homeHtml || null
  let status = homeStatus ?? null
  let resolved = finalUrl || website
  if (!html) {
    const page = await fetchText(website)
    if (!page) return { ...empty, note: "Homepage not reachable for technical checks." }
    html = page.text
    status = page.status
    resolved = page.finalUrl
  }

  let origin: string
  try {
    origin = new URL(resolved).origin
  } catch {
    return { ...empty, status, note: "Could not resolve origin for robots/sitemap." }
  }

  const robots = await fetchText(`${origin}/robots.txt`, 6000)
  // robots.txt "Sitemap:" lines, the site's folder (user.wixsite.com/name/sitemap.xml), then /sitemap.xml.
  const hasSitemap = await hasSitemapAt(resolved, robots && robots.status < 400 ? robots.text : null, fetchText)

  return {
    https: resolved.startsWith("https://"),
    title: pickAttr(/<title[^>]*>([\s\S]*?)<\/title>/i, html),
    description:
      pickAttr(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i, html) ||
      pickAttr(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i, html),
    canonical: pickAttr(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i, html),
    hasRobots: Boolean(robots && robots.status < 400 && /user-agent/i.test(robots.text)),
    hasSitemap,
    viewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    status,
    note: "HTTPS, metadata, robots, and sitemap checked from public responses. Not a full SEO crawl.",
  }
}
