import type { TechnicalSnapshot } from "@/lib/report/types"
import { fetchText, pickAttr } from "@/lib/report/collect/fetch"

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

  const [robots, sitemap] = await Promise.all([
    fetchText(`${origin}/robots.txt`, 6000),
    fetchText(`${origin}/sitemap.xml`, 6000),
  ])

  return {
    https: resolved.startsWith("https://"),
    title: pickAttr(/<title[^>]*>([\s\S]*?)<\/title>/i, html),
    description:
      pickAttr(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i, html) ||
      pickAttr(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i, html),
    canonical: pickAttr(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i, html),
    hasRobots: Boolean(robots && robots.status < 400 && /user-agent/i.test(robots.text)),
    hasSitemap: Boolean(sitemap && sitemap.status < 400 && /<urlset|<sitemapindex/i.test(sitemap.text)),
    viewport: /<meta[^>]+name=["']viewport["']/i.test(html),
    status,
    note: "HTTPS, metadata, robots, and sitemap checked from public responses. Not a full SEO crawl.",
  }
}
