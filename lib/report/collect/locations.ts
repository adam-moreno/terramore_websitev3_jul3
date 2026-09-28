import type { LocationSnapshot, PlacesLookup } from "@/lib/report/types"

/** Hosts shared by many businesses. A match on these does not identify one business. */
const SHARED_HOSTS = new Set([
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "yelp.com",
  "google.com",
  "sites.google.com",
  "business.site",
  "linktr.ee",
  "wixsite.com",
  "square.site",
  "godaddysites.com",
])

const NOTES = {
  notChecked: "Google Maps not checked.",
  unconfirmed: "Google Maps checked live. No listing was confirmed for this website, so nothing was stored.",
  confirmed: "Google Maps checked live. Only the place ID is stored.",
} as const

function hostOf(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    return url.hostname.toLowerCase().replace(/^www\./, "")
  } catch {
    return null
  }
}

/** Same site, or one is a subdomain of the other. Never confirms on shared platform hosts. */
export function hostsMatch(leadHost: string | null, listingHost: string | null): boolean {
  if (!leadHost || !listingHost) return false
  if (SHARED_HOSTS.has(leadHost) || SHARED_HOSTS.has(listingHost)) return false
  return leadHost === listingHost || listingHost.endsWith(`.${leadHost}`) || leadHost.endsWith(`.${listingHost}`)
}

function emptyLookup(checked: boolean): PlacesLookup {
  return { checked, confirmed: false, placeId: null, rating: null, reviewCount: null, hasAddress: false }
}

/**
 * Live Places Text Search when GOOGLE_PLACES_API_KEY is set.
 * The result stays in memory for scoring. A listing counts only when its website matches the lead's website;
 * otherwise it is unconfirmed and no Places data is used or stored.
 */
export async function collectLocations(businessName: string, website: string | null): Promise<PlacesLookup> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  const leadHost = hostOf(website)
  if (!key || !leadHost) return emptyLookup(false)
  const query = businessName || leadHost

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id,places.rating,places.userRatingCount,places.formattedAddress,places.websiteUri",
      },
      body: JSON.stringify({ textQuery: query, maxResultCount: 3 }),
    })
    if (!response.ok) return emptyLookup(true)
    const data = (await response.json()) as { places?: Array<Record<string, any>> }
    const place = (data.places || []).find((p) => typeof p.id === "string" && hostsMatch(leadHost, hostOf(p.websiteUri)))
    if (!place) return emptyLookup(true)
    return {
      checked: true,
      confirmed: true,
      placeId: place.id,
      rating: typeof place.rating === "number" ? place.rating : null,
      reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      hasAddress: typeof place.formattedAddress === "string" && place.formattedAddress.length > 0,
    }
  } catch {
    return emptyLookup(true)
  }
}

/** The only Places-derived record that may be persisted. */
export function toLocationSnapshot(lookup: PlacesLookup): LocationSnapshot {
  if (!lookup.checked) return { checked: false, placeId: null, note: NOTES.notChecked }
  if (lookup.confirmed && lookup.placeId) return { checked: true, placeId: lookup.placeId, note: NOTES.confirmed }
  return { checked: true, placeId: null, note: NOTES.unconfirmed }
}
