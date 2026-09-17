import type { CatalogSnapshot } from "@/lib/report/types"
import { fetchText, stripToText } from "@/lib/report/collect/fetch"

/**
 * Ecommerce: try public /products.json when platform looks like Shopify or path is reachable.
 * Services: infer from service-ish page excerpts already collected (passed in).
 */
export async function collectCatalog(input: {
  website: string | null
  platform: string | null
  hasCheckout: boolean
  servicePageExcerpts: string[]
}): Promise<CatalogSnapshot> {
  const { website, platform, hasCheckout, servicePageExcerpts } = input
  if (!website) {
    return {
      kind: "unknown",
      available: false,
      productCount: null,
      sampleNames: [],
      variantHeavy: false,
      prices: [],
      note: "Not found in sources checked",
      sourceUrl: null,
    }
  }

  const origin = new URL(website).origin
  const productsUrl = `${origin}/products.json`
  const shouldTryProducts = hasCheckout || platform === "Shopify" || /shopify/i.test(platform || "")

  if (shouldTryProducts) {
    const page = await fetchText(productsUrl, 8000)
    if (page && page.status < 400) {
      try {
        const data = JSON.parse(page.text) as {
          products?: Array<{ title?: string; variants?: Array<{ price?: string; title?: string }>; body_html?: string }>
        }
        const products = data.products || []
        const sampleNames = products.map((p) => p.title || "").filter(Boolean).slice(0, 12)
        const prices = products
          .flatMap((p) => (p.variants || []).map((v) => (v.price ? `$${v.price}` : "")))
          .filter(Boolean)
          .slice(0, 12)
        const variantHeavy = products.filter((p) => (p.variants || []).length > 3).length >= Math.max(1, Math.floor(products.length / 3))
        return {
          kind: "ecommerce",
          available: true,
          productCount: products.length,
          sampleNames,
          variantHeavy,
          prices: Array.from(new Set(prices)),
          note: `Public products.json returned ${products.length} products (Shopify-style feed; may be paginated/limited).`,
          sourceUrl: productsUrl,
        }
      } catch {
        // fall through to services/unknown
      }
    }
  }

  const joined = servicePageExcerpts.join(" ").slice(0, 4000)
  if (/service|services|we (?:offer|provide)|consultation|package/i.test(joined)) {
    const headings = Array.from(joined.matchAll(/\b([A-Z][A-Za-z0-9 &/-]{3,40})\b/g))
      .map((m) => m[1])
      .slice(0, 8)
    return {
      kind: "services",
      available: true,
      productCount: null,
      sampleNames: headings,
      variantHeavy: false,
      prices: Array.from(new Set(joined.match(/\$\s?\d{1,4}(?:[.,]\d{2})?/g) || [])).slice(0, 8),
      note: "Service-oriented language found on linked pages. Exact commercial priority not inferred.",
      sourceUrl: website,
    }
  }

  if (hasCheckout) {
    return {
      kind: "ecommerce",
      available: false,
      productCount: null,
      sampleNames: [],
      variantHeavy: false,
      prices: [],
      note: "Checkout signals found, but products.json was not available in sources checked.",
      sourceUrl: productsUrl,
    }
  }

  return {
    kind: "unknown",
    available: false,
    productCount: null,
    sampleNames: [],
    variantHeavy: false,
    prices: [],
    note: "Not found in sources checked",
    sourceUrl: null,
  }
}

/** Lightweight service-page text helper for catalog inference. */
export function pageExcerptForCatalog(excerpt: string): string {
  return stripToText(excerpt).slice(0, 2000)
}
