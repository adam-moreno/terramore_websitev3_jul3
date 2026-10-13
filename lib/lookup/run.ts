import { randomUUID } from "node:crypto"
import { collectCatalog } from "@/lib/report/collect/catalog"
import { collectDirectories } from "@/lib/report/collect/directories"
import { fetchText, pickAttr } from "@/lib/report/collect/fetch"
import { collectLocations } from "@/lib/report/collect/locations"
import { assertPublicUrl, BlockedUrlError } from "@/lib/report/collect/public-url"
import { collectSiteExperience, placeholderPages, type BookingCheck } from "@/lib/report/collect/site-experience"
import { collectTechnical } from "@/lib/report/collect/technical"
import { normalizeWebsite } from "@/lib/report/footprint"
import type { NextStep, NextStepPath } from "@/lib/report/collect/next-step"
import { scoreDigitalPresence } from "@/lib/report/score/digital-presence"
import type { CatalogSnapshot, DirectoryProfile, PageSnapshot, PlacesLookup, TechnicalSnapshot } from "@/lib/report/types"
import { readAeo } from "@/lib/lookup/aeo"
import { SOCIAL_PLATFORMS, type AddedSocial } from "@/lib/lookup/socials"
import type { LookupEvent, LookupFinding, LookupScore, LookupSourceId } from "@/lib/lookup/types"

/**
 * The free business lookup: the Digital Footprint collectors, run without a lead, streamed source by source.
 * Findings are deterministic sentences about what was observed on the business's own pages, robots.txt/sitemap.xml
 * and (when configured) a Google Maps listing confirmed by its website host. No model call, no stored rows.
 * Google Places rating and review count never leave memory (lib/report/types.ts PlacesLookup).
 */

/** What the score needs, kept by the route for 15 minutes so added profiles re-score without a second read. */
export type ScoreInputs = {
  pages: PageSnapshot[]
  technical: TechnicalSnapshot
  directories: DirectoryProfile[]
  /** In memory only, never sent: Places values stay on the server (lib/report/types.ts). */
  places: PlacesLookup
  catalog: CatalogSnapshot
  hasCheckout: boolean
  /** How the business takes its next step; a quote request or order form scores like booking. */
  nextStep?: NextStep
  where: string
  pagesRead: number
}

/**
 * The social source and the score, with any profiles the visitor added. A profile the site already links to stays as
 * found; an added one counts as a found profile (the report's own rule) and is said to be added and not linked.
 */
export function socialAndScore(inputs: ScoreInputs, socials: AddedSocial[]) {
  const linked = inputs.directories.filter((d) => d.found && d.linkedFromSite)
  const added = socials.filter((s) => !linked.some((d) => d.platform === s.platform))
  const directories: DirectoryProfile[] = [
    ...inputs.directories.filter((d) => !added.some((a) => a.platform === d.platform)),
    ...added.map((a) => ({
      platform: a.platform,
      url: a.url,
      found: true,
      linkedFromSite: false,
      note: "Added by the visitor; not checked.",
    })),
  ]
  const findings: LookupFinding[] = []
  if (linked.length)
    findings.push(
      finding(
        "social",
        "linked",
        "working",
        `Linked from your site: ${unique(linked.map((d) => platformName(d.platform))).join(", ")}`,
        inputs.where,
      ),
    )
  for (const a of added) {
    const label = SOCIAL_PLATFORMS.find((p) => p.id === a.platform)?.label ?? a.platform
    findings.push(
      finding(
        "social",
        `added_${a.platform}`,
        "gap",
        `You added ${label} (@${a.handle}). Your website doesn't link to it, so visitors there can't find it`,
        "Added by you, not checked",
      ),
    )
  }
  if (!findings.length)
    findings.push(finding("social", "none", "note", "No social profiles are linked from the pages we read", inputs.where))

  const breakdown = scoreDigitalPresence({
    pages: inputs.pages,
    technical: inputs.technical,
    directories,
    places: inputs.places,
    catalog: inputs.catalog,
    hasCheckout: inputs.hasCheckout,
    nextStep: inputs.nextStep,
  })
  // Numbers and labels only: factor evidence stays server-side, and Places values never leave memory.
  const score: LookupScore = {
    overall: breakdown.overall,
    pagesRead: inputs.pagesRead,
    mapsChecked: inputs.places.checked,
    profilesLinked: unique(linked.map((d) => d.platform)),
    profilesAdded: added.map((a) => a.platform),
    factors: breakdown.factors.map((f) => ({ id: f.id, label: f.label, score: f.available ? f.score : null })),
  }
  return {
    social: { status: (linked.length || added.length ? "done" : "not_found") as "done" | "not_found", findings },
    score,
  }
}

function aeoFindings(aeo: ReturnType<typeof readAeo>): LookupFinding[] {
  const out: LookupFinding[] = []
  out.push(
    aeo.structuredDataTypes.length
      ? finding(
          "search_basics",
          "aeo_structured",
          "working",
          `AI answers: structured data describes the business (${aeo.structuredDataTypes.slice(0, 3).join(", ")})`,
          "Homepage code",
        )
      : finding(
          "search_basics",
          "aeo_no_structured",
          "gap",
          "AI answers: no structured data tells answer engines what the business is and does",
          "Homepage code",
        ),
  )
  if (aeo.blockedCrawlers.length)
    out.push(
      finding(
        "search_basics",
        "aeo_blocked",
        "gap",
        `AI answers: robots.txt blocks ${aeo.blockedCrawlers.join(", ")}, so those answer engines can't read the site`,
        "robots.txt",
      ),
    )
  else if (aeo.robotsRead)
    out.push(
      finding("search_basics", "aeo_allowed", "working", "AI answers: robots.txt lets AI answer engines read the site", "robots.txt"),
    )
  if (aeo.hasFaq)
    out.push(finding("search_basics", "aeo_faq", "working", "AI answers: the homepage has an FAQ answer engines can quote", "Homepage"))
  else
    out.push(
      finding("search_basics", "aeo_no_faq", "note", "AI answers: no FAQ on the homepage for answer engines to quote", "Homepage"),
    )
  return out
}

/** No Places key or no lookup: scored as not confirmed, and the score says Maps wasn't checked. */
const PLACES_NOT_CHECKED: PlacesLookup = {
  checked: false,
  confirmed: false,
  placeId: null,
  rating: null,
  reviewCount: null,
  hasAddress: false,
}

/**
 * Gaps in the order a first look should surface them: the ones closest to a lost customer first, for the way this
 * business takes its next step. No way to reach the business at all always comes first. Online booking only leads
 * for appointment-style businesses; a contractor who quotes, a store or a maker is never told to "book a time online".
 */
const LATER_GAPS = ["search_basics.no_title", "search_basics.no_sitemap", "google_maps.unconfirmed", "search_basics.no_description"]
export const FIRST_LOOK_ORDER: Record<NextStepPath, string[]> = {
  // A business people can already call or write to loses more to not knowing where customers come from than to the
  // lack of online booking, so the measurement gap comes first once contact basics are in place.
  booking: [
    "contact.no_contact",
    "contact.booking_unreachable",
    "website.no_cta",
    "measurement.none",
    "contact.no_booking",
    "contact.no_phone",
    "contact.no_message",
    ...LATER_GAPS,
  ],
  quote: ["contact.no_contact", "website.no_cta", "contact.no_phone", "contact.no_message", "measurement.none", ...LATER_GAPS],
  store: ["website.no_cta", "contact.no_contact", "measurement.none", "contact.no_message", "contact.no_phone", ...LATER_GAPS],
  order: ["contact.no_contact", "website.no_cta", "measurement.none", "contact.no_message", "contact.no_phone", ...LATER_GAPS],
}

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
/** The same site with "www." added or removed; null for hosts where that makes no sense (subdomains, IPs). */
export function alternateWww(website: string): string | null {
  try {
    const url = new URL(website)
    const host = url.hostname
    if (host.startsWith("www.")) return `${url.protocol}//${host.slice(4)}/`
    if (host.split(".").length === 2) return `${url.protocol}//www.${host}/`
    return null
  } catch {
    return null
  }
}

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
  opts: {
    /** Profiles the visitor added after a first look; scored like found profiles, marked as added. */
    socials?: AddedSocial[]
    /** Receives the scoring inputs, so the caller can re-score added profiles without reading the site again. */
    onInputs?: (inputs: ScoreInputs) => void
  } = {},
) {
  // With or without www: if the address as typed doesn't resolve, try the other form before giving up.
  const other = alternateWww(website)
  try {
    await assertPublicUrl(website)
  } catch (error) {
    const unresolved = error instanceof BlockedUrlError && /resolve/.test(error.message)
    let recovered = false
    if (unresolved && other) {
      try {
        await assertPublicUrl(other)
        website = other
        recovered = true
      } catch {}
    }
    if (!recovered) {
      emit({ type: "error", code: unresolved ? "unreachable" : "blocked", message: "" })
      return
    }
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
  let site = await collectSiteExperience(website, { maxExtraPages: 2 })
  let pages = site.pages.filter((p) => p.status !== null && p.status < 400)
  if (pages.length === 0 && other && website !== other) {
    try {
      await assertPublicUrl(other)
      const retry = await collectSiteExperience(other, { maxExtraPages: 2 })
      const retryPages = retry.pages.filter((p) => p.status !== null && p.status < 400)
      if (retryPages.length) {
        website = other
        site = retry
        pages = retryPages
      }
    } catch {}
  }
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
  for (const page of placeholderPages(pages).slice(0, 1))
    websiteFindings.push(finding("website", "placeholder", "gap", `Your "${page.name}" page says "${page.phrase}"`, page.url))
  report("website", "done", websiteFindings)

  const booking = site.booking
  const nextStep = site.nextStep
  const phone = pages.some((p) => p.hasPhone)
  const onSiteForm = pages.some((p) => p.formCount > 0)
  const forms = onSiteForm || Boolean(nextStep.externalForm) || Boolean(nextStep.orderForm)
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
  } else if (nextStep.path === "booking") {
    contactFindings.push(
      finding("contact", "no_booking", "gap", "There's no way to book a time online on the pages we read", where),
    )
  } else if (nextStep.quoteRequest) {
    contactFindings.push(finding("contact", "quote", "working", "Visitors can ask for a quote or estimate", where))
  }
  if (phone) contactFindings.push(finding("contact", "phone", "working", "A phone number is listed", where))
  if (nextStep.orderForm)
    contactFindings.push(finding("contact", "order_form", "working", "Visitors can order through a form linked from the site", where))
  if (onSiteForm || nextStep.externalForm) contactFindings.push(finding("contact", "form", "working", "There's a form to get in touch", where))
  if (email) contactFindings.push(finding("contact", "email", "working", "An email address is listed", where))
  if (booking.status === "none" && !phone && !forms && !email) {
    contactFindings.push(
      finding("contact", "no_contact", "gap", "We didn't find a phone number or contact form either", where),
    )
  }
  // Each missing contact basic is said in words, so the score (lib/lookup/score.ts) never counts a gap it doesn't name.
  else {
    if (!phone) contactFindings.push(finding("contact", "no_phone", "gap", "No phone number is listed on the pages we read", where))
    if (!forms && !email)
      contactFindings.push(
        finding("contact", "no_message", "gap", "There's no contact form or email address on the pages we read", where),
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
      finding("measurement", "none", "gap", "Nothing on your site shows where your visitors come from (no analytics or ad tags found)", "Homepage code"),
    )
  }
  report("measurement", "done", measurementFindings)

  // The full report's Digital Presence Score, from this check's pages. Null when the technical read didn't run.
  let score: LookupScore | null = null
  if (Date.now() > deadline) {
    for (const source of ["search_basics", "social", "google_maps"] as const) report(source, "failed")
  } else {
    let origin = website
    try {
      origin = new URL(site.homeFinalUrl || website).origin
    } catch {}
    const [technical, places, catalog, robots] = await Promise.all([
      collectTechnical(website, site.homeHtml, home.status, site.homeFinalUrl),
      process.env.GOOGLE_PLACES_API_KEY ? collectLocations(name || "", website) : Promise.resolve(null),
      collectCatalog({
        website,
        platform: site.platform,
        hasCheckout: site.hasCheckout,
        servicePageExcerpts: site.pages.map((p) => p.excerpt),
      }),
      fetchText(`${origin}/robots.txt`, 6000),
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
    search.push(...aeoFindings(readAeo(site.homeHtml || "", robots && robots.status < 400 ? robots.text : null)))
    report("search_basics", "done", search)

    const inputs: ScoreInputs = {
      pages: site.pages,
      technical,
      directories: collectDirectories(site.pageHtml),
      places: places ?? PLACES_NOT_CHECKED,
      catalog,
      hasCheckout: site.hasCheckout,
      nextStep,
      where,
      pagesRead: pages.length,
    }
    opts.onInputs?.(inputs)
    const scored = socialAndScore(inputs, opts.socials ?? [])
    report("social", scored.social.status, scored.social.findings)

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

    score = scored.score
  }

  const gaps = found.filter((f) => f.tone === "gap")
  const firstLook = FIRST_LOOK_ORDER[nextStep.path].map((id) => gaps.find((g) => g.id === id)).find(Boolean) ?? gaps[0] ?? null
  emit({ type: "done", firstLook, checked: 6, score })
}
