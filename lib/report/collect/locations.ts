import type { LocationSnapshot } from "@/lib/report/types"

/**
 * Uses existing Places Text Search when GOOGLE_PLACES_API_KEY is set.
 * Does not fabricate missing ratings, hours, or locations.
 */
export async function collectLocations(businessName: string, website: string | null): Promise<LocationSnapshot> {
  const empty: LocationSnapshot = {
    checked: false,
    found: false,
    name: null,
    address: null,
    rating: null,
    reviewCount: null,
    hasHours: false,
    mapsUrl: null,
    note: "Places not checked (no API key or query).",
  }
  const key = process.env.GOOGLE_PLACES_API_KEY
  const query = businessName || (website ? new URL(website).hostname.replace(/^www\./, "") : "")
  if (!key || !query) return empty

  try {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.regularOpeningHours,places.googleMapsUri,places.websiteUri",
      },
      body: JSON.stringify({ textQuery: query, maxResultCount: 3 }),
    })
    if (!response.ok) {
      return { ...empty, checked: true, note: `Places lookup failed (HTTP ${response.status}).` }
    }
    const data = (await response.json()) as { places?: Array<Record<string, any>> }
    const places = data.places || []
    const host = website ? new URL(website).hostname.replace(/^www\./, "") : null
    const place =
      places.find((p) => host && typeof p.websiteUri === "string" && p.websiteUri.includes(host)) || places[0]
    if (!place) {
      return { ...empty, checked: true, note: "Not found in sources checked" }
    }
    return {
      checked: true,
      found: true,
      name: place.displayName?.text || null,
      address: place.formattedAddress || null,
      rating: typeof place.rating === "number" ? place.rating : null,
      reviewCount: typeof place.userRatingCount === "number" ? place.userRatingCount : null,
      hasHours: Boolean(place.regularOpeningHours),
      mapsUrl: place.googleMapsUri || null,
      note: "Observable Places listing matched from public search. Additional locations may exist.",
    }
  } catch (error) {
    return {
      ...empty,
      checked: true,
      note: `Places lookup error: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
