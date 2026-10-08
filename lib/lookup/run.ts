import { randomUUID } from "node:crypto"
import { collectDirectories } from "@/lib/report/collect/directories"
import { pickAttr } from "@/lib/report/collect/fetch"
import { collectLocations } from "@/lib/report/collect/locations"
import { assertPublicUrl, BlockedUrlError } from "@/lib/report/collect/public-url"
import { collectSiteExperience, type BookingCheck } from "@/lib/report/collect/site-experience"
import { collectTechnical } from "@/lib/report/collect/technical"
import { normalizeWebsite } from "@/lib/report/footprint"
import type { PageSnapshot } from "@/lib/report/types"
import type { LookupEvent, LookupFinding, LookupSourceId } from "@/lib/lookup/types"

/**
 * The free business lookup: the Digital Footprint collectors, run without a lead, streamed source by source.
 * Findings are deterministic sentences about what was observed on the business's own pages, robots.txt/sitemap.xml
 * and (when configured) a Google Maps listing confirmed by its website host. No model call, no stored rows.
 * Google Places rating and review count never leave memory (lib/report/types.ts PlacesLookup).
 */

/** Gaps in the order a first look should surface them: the ones closest to a lost customer first. */
const FIRST_LOOK_ORDER = [
  "contact.no_booking",
  "contact.booking_unreachable",
  "website.no_cta",
  "contact.no_contact",
  "measurement.none",
  "search_basics.no_title",
  "search_basics.no_sitemap",
  "google_maps.unconfirmed",
  "search_basics.no_description",
]

function finding(
  source: LookupSourceId,
  key: string,
  tone: LookupFinding["tone"],
  text: string,
  evidence: string,
): LookupFinding {
  return { id: `${source}.${key}`, source, tone, text, evidence }
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)]
}

/** The business name the site gives itself: og:site_name, else the title's first segment. */
function siteName(homeHtml: string | null, title: string | null): string | null {
  const og = homeHtml
    ? pickAttr(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i, homeHtml)
    : null
  const candidate = og || title?.split(/\s[|–—:-]\s/)[0] || null
  const name = candidate?.trim()
  return name && name.length >= 2 && name.length <= 80 ? name : null
}

const PLATFORM_NAMES: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  x: "X",
  twitter: "X",
  pinterest: "Pinterest",
  yelp: "Yelp",
  google: "Google",
}

function platformName(platform: string): string {
  return PLATFORM_NAMES[platform.toLowerCase()] ?? platform.charAt(0).toUpperCase() + platform.slice(1)
}

/** Where booking was confirmed: the tool's name for a third-party scheduler, else the same-site page's path. */
function bookingEvidence(booking: BookingCheck, website: string): string {
  if (!booking.url) return "Homepage"
  try {
    const url = new URL(booking.url)
    if (booking.via === "scheduler") return `Booking tool link (${url.hostname.replace(/^www\./, "")})`
    if (url.origin === new URL(website).origin || url.hostname.replace(/^www\./, "") === hostOf(website)) {
      return url.pathname === "/" ? "Homepage" : `Booking page ${url.pathname}`
    }
    return url.hostname
  } catch {
    return "Homepage"
  }
}

function pagesLabel(pages: PageSnapshot[]): string {
  return pages.length > 1 ? `Homepage and ${pages.length - 1} linked page${pages.length > 2 ? "s" : ""}` : "Homepage"
}

export function newLookupId(): string {
  return randomUUID().replace(/-/g, "")
}

export function hostOf(website: string): string {
  return new URL(website).hostname.toLowerCase().replace(/^www\./, "")
}

/** Validates and normalizes the visitor's input. Null when it isn't a usable public web address. */
export function normalizeLookupWebsite(raw: unknown): string | null {
  if (typeof raw !== "string") return null
  const trimmed = raw.trim()
  if (!trimmed || trimmed.length > 253 || /\s/.test(trimmed)) return null
  const website = normalizeWebsite(trimmed)
  if (!website) return null
  try {
    const url = new URL(website)
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(url.hostname)) return null
    return `${url.protocol}//${url.hostname}/`
  } catch {
    return null
  }
}

/**
 * Runs the lookup and emits events as each source finishes. Never throws: failures become `failed` sources or an
 * `error` event. `deadline` is an epoch-ms cut-off; sources not started by then are reported as not checked.
 */
export async function runLookup(
  website: string,
  lookupId: string,
  emit: (event: LookupEvent) => void,
  deadline: number,
) {
  try {
    await assertPublicUrl(website)
  } catch (error) {
    emit({
      type: "error",
      code: error instanceof BlockedUrlError && /resolve/.test(error.message) ? "unreachable" : "blocked",
      message: "",
    })
    return
  }

  emit({ type: "start", lookupId, domain: hostOf(website), website })
  const found: LookupFinding[] = []
  const report = (
    source: LookupSourceId,
    status: "done" | "not_found" | "unavailable" | "failed",
    findings: LookupFinding[] = [],
  ) => {
    found.push(...findings)
    emit({ type: "source", source, status, findings })
  }

  // Website, contact and measurement all come from one read of the homepage and two linked pages.
  const site = await collectSiteExperience(website, { maxExtraPages: 2 })
  const pages = site.pages.filter((p) => p.status !== null && p.status < 400)
  if (pages.length === 0) {
    emit({ type: "error", code: "unreachable", message: "" })
    return
  }
  const where = pagesLabel(pages)
  const home = pages[0]
  const name = siteName(site.homeHtml, home.title)
  emit({ type: "identity", name })

  const ctas = unique(pages.flatMap((p) => p.ctaTexts)).slice(0, 3)
  const websiteFindings: LookupFinding[] = []
  if (home.h1[0])
    websiteFindings.push(finding("website", "headline", "note", `Your homepage leads with “${home.h1[0]}”`, "Homepage"))
  websiteFindings.push(
    ctas.length
      ? finding("website", "ctas", "working", `Visitors are asked to: ${ctas.join(", ")}`, where)
      : finding("website", "no_cta", "gap", "We didn't find a clear next step for visitors to take", where),
  )
  if (site.prices.length)
    websiteFindings.push(finding("website", "prices", "working", "Prices are shown on the site", where))
  report("website", "done", websiteFindings)

  const booking = site.booking
  const phone = pages.some((p) => p.hasPhone)
  const forms = pages.some((p) => p.formCount > 0)
  const email = pages.some((p) => p.hasEmail)
  const contactFindings: LookupFinding[] = []
  if (booking.status === "found") {
    contactFindings.push(finding("contact", "booking", "working", "Visitors can book a time online", bookingEvidence(booking, website)))
  } else if (booking.status === "unreachable") {
    contactFindings.push(
      finding("contact", "booking_unreachable", "gap", "A booking link on the site didn't open when we checked it", bookingEvidence(booking, website)),
    )
  } else if (booking.status === "unconfirmed") {
    contactFindings.push(
      finding(
        "contact",
        "booking_unconfirmed",
        "note",
        "There's a booking link or button, but we couldn't see the booking step behind it",
        booking.url ? bookingEvidence(booking, website) : where,
      ),
    )
  } else {
    contactFindings.push(
      finding("contact", "no_booking", "gap", "There's no way to book a time online on the pages we read", where),
    )
  }
  if (phone) contactFindings.push(finding("contact", "phone", "working", "A phone number is listed", where))
  if (forms) contactFindings.push(finding("contact", "form", "working", "There's a form to get in touch", where))
  if (email) contactFindings.push(finding("contact", "email", "working", "An email address is listed", where))
  if (booking.status === "none" && !phone && !forms && !email) {
    contactFindings.push(
      finding("contact", "no_contact", "gap", "We didn't find a phone number or contact form either", where),
    )
  }
  report("contact", "done", contactFindings)

  const pixels = site.pixels
  const measurementFindings: LookupFinding[] = []
  if (pixels.includes("Google Analytics"))
    measurementFindings.push(finding("measurement", "ga", "working", "Google Analytics is installed", "Homepage code"))
  if (pixels.includes("Meta Pixel"))
    measurementFindings.push(
      finding(
        "measurement",
        "meta",
        "working",
        "The Meta Pixel is installed, so visits from Meta ads can be measured",
        "Homepage code",
      ),
    )
  if (pixels.includes("TikTok Pixel"))
    measurementFindings.push(
      finding("measurement", "tiktok", "working", "The TikTok Pixel is installed", "Homepage code"),
    )
  if (pixels.includes("Google Tag Manager")) {
    measurementFindings.push(
      finding(
        "measurement",
        "gtm",
        "note",
        "Google Tag Manager is installed. Tags it loads later aren't visible to this check",
        "Homepage code",
      ),
    )
  }
  if (measurementFindings.length === 0) {
    measurementFindings.push(
      finding("measurement", "none", "gap", "We didn't find analytics or ad tracking on the homepage", "Homepage code"),
    )
  }
  report("measurement", "done", measurementFindings)

  if (Date.now() > deadline) {
    for (const source of ["search_basics", "social", "google_maps"] as const) report(source, "failed")
  } else {
    const [technical, places] = await Promise.all([
      collectTechnical(website, site.homeHtml, home.status, site.homeFinalUrl),
      process.env.GOOGLE_PLACES_API_KEY ? collectLocations(name || "", website) : Promise.resolve(null),
    ])

    const search: LookupFinding[] = []
    if (!technical.title)
      search.push(
        finding(
          "search_basics",
          "no_title",
          "gap",
          "The homepage has no page title, the line Google shows in results",
          "Homepage",
        ),
      )
    if (!technical.description) {
      search.push(
        finding(
          "search_basics",
          "no_description",
          "gap",
          "The homepage has no meta description for search results",
          "Homepage",
        ),
      )
    }
    search.push(
      technical.hasSitemap
        ? finding("search_basics", "sitemap", "working", "A sitemap tells Google which pages exist", "sitemap.xml")
        : finding(
            "search_basics",
            "no_sitemap",
            "gap",
            "No sitemap was found to help Google find your pages",
            "sitemap.xml",
          ),
    )
    if (!technical.https)
      search.push(
        finding(
          "search_basics",
          "no_https",
          "gap",
          "The site doesn't load over a secure (https) connection",
          "Homepage",
        ),
      )
    if (!technical.viewport)
      search.push(
        finding("search_basics", "no_viewport", "gap", "The homepage isn't set up for phone screens", "Homepage"),
      )
    report("search_basics", "done", search)

    const linked = collectDirectories(site.pageHtml).filter((d) => d.found && d.linkedFromSite)
    report(
      "social",
      linked.length ? "done" : "not_found",
      linked.length
        ? [
            finding(
              "social",
              "linked",
              "working",
              `Linked from your site: ${unique(linked.map((d) => platformName(d.platform))).join(", ")}`,
              where,
            ),
          ]
        : [finding("social", "none", "note", "No social profiles are linked from the pages we read", where)],
    )

    if (!places) report("google_maps", "unavailable")
    else if (!places.checked) report("google_maps", "failed")
    else if (places.confirmed) {
      report("google_maps", "done", [
        finding("google_maps", "confirmed", "working", "A Google Maps listing points to this website", "Google Maps"),
      ])
    } else {
      report("google_maps", "not_found", [
        finding(
          "google_maps",
          "unconfirmed",
          "gap",
          "We couldn't confirm a Google Maps listing that points to this website",
          "Google Maps",
        ),
      ])
    }
  }

  const gaps = found.filter((f) => f.tone === "gap")
  const firstLook = FIRST_LOOK_ORDER.map((id) => gaps.find((g) => g.id === id)).find(Boolean) ?? gaps[0] ?? null
  emit({ type: "done", firstLook, checked: 6 })
}
