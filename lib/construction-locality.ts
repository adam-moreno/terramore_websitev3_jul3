/**
 * Approximate local place names for illustrative inquiry toasts.
 * Prefer neighborhood / mid-size city over mega-metro names.
 * Each metro maps to a mix of higher-end and mid-market places so the
 * notification cycle can rotate distinct names.
 */

export type VisitorLocality = {
  /** Primary place (first in rotation). */
  place: string
  /** Distinct places to rotate through notifications (length 4). */
  places: string[]
  /** Broader metro label for search/SERP copy — e.g. "Los Angeles". */
  metro: string
  region: string | null
  source: "geo" | "fallback"
}

/** [higher-end … mid-market] — order is shuffled per visitor via seed. */
const METRO_TO_LOCAL: Record<string, string[]> = {
  "los angeles": ["Bel Air", "Manhattan Beach", "Sherman Oaks", "Glendale", "Pasadena", "Torrance"],
  la: ["Bel Air", "Pacific Palisades", "Sherman Oaks", "Burbank", "Glendale", "Downey"],
  "new york": ["Tribeca", "Park Slope", "Hoboken", "Astoria", "Forest Hills", "Bay Ridge"],
  nyc: ["Tribeca", "Park Slope", "Hoboken", "Astoria"],
  chicago: ["Lincoln Park", "Winnetka", "Evanston", "Oak Park", "Naperville", "Bridgeport"],
  houston: ["River Oaks", "Memorial", "The Heights", "Sugar Land", "Katy", "Pearland"],
  dallas: ["Highland Park", "University Park", "Plano", "Frisco", "Richardson", "Garland"],
  "fort worth": ["Southlake", "Westover Hills", "Arlington", "Grapevine"],
  phoenix: ["Paradise Valley", "Scottsdale", "Arcadia", "Tempe", "Chandler", "Mesa"],
  "san diego": ["La Jolla", "Del Mar", "Carlsbad", "North Park", "Encinitas", "Chula Vista"],
  "san francisco": ["Pacific Heights", "Noe Valley", "Berkeley", "Oakland", "Daly City", "South San Francisco"],
  "san jose": ["Los Altos", "Palo Alto", "Cupertino", "Mountain View", "Santa Clara", "Milpitas"],
  seattle: ["Medina", "Bellevue", "Kirkland", "Ballard", "Redmond", "Renton"],
  denver: ["Cherry Creek", "Boulder", "Highlands", "Lakewood", "Aurora", "Arvada"],
  atlanta: ["Buckhead", "Alpharetta", "Decatur", "Marietta", "Sandy Springs", "Smyrna"],
  miami: ["Coral Gables", "Surfside", "Brickell", "Fort Lauderdale", "Doral", "Homestead"],
  orlando: ["Windermere", "Winter Park", "Lake Nona", "Celebration", "Kissimmee"],
  tampa: ["Davis Islands", "Hyde Park", "St. Petersburg", "Clearwater", "Brandon"],
  washington: ["McLean", "Bethesda", "Arlington", "Alexandria", "Silver Spring", "Rockville"],
  "washington, d.c.": ["Georgetown", "McLean", "Bethesda", "Arlington", "Alexandria", "Silver Spring"],
  "washington dc": ["Georgetown", "McLean", "Bethesda", "Arlington", "Alexandria", "Silver Spring"],
  boston: ["Beacon Hill", "Brookline", "Cambridge", "Newton", "Somerville", "Quincy"],
  philadelphia: ["Main Line", "Chestnut Hill", "Conshohocken", "South Philly", "King of Prussia"],
  detroit: ["Bloomfield Hills", "Birmingham", "Royal Oak", "Ann Arbor", "Dearborn"],
  minneapolis: ["Edina", "Wayzata", "St. Paul", "Minnetonka", "Bloomington"],
  portland: ["Lake Oswego", "Pearl District", "Beaverton", "Hillsboro", "Gresham"],
  "las vegas": ["Summerlin", "Henderson", "Spring Valley", "North Las Vegas"],
  austin: ["West Lake Hills", "Tarrytown", "South Congress", "Round Rock", "Cedar Park", "Pflugerville"],
  charlotte: ["Myers Park", "Ballantyne", "South End", "Dilworth", "Concord"],
  nashville: ["Belle Meade", "Green Hills", "Franklin", "Brentwood", "East Nashville", "Murfreesboro"],
  baltimore: ["Ruxton", "Federal Hill", "Towson", "Columbia", "Canton", "Catonsville"],
  sacramento: ["East Sacramento", "Roseville", "Davis", "Folsom", "Elk Grove"],
  "kansas city": ["Mission Hills", "Prairie Village", "Overland Park", "Leawood", "Independence"],
  indianapolis: ["Meridian-Kessler", "Carmel", "Fishers", "Broad Ripple", "Greenwood"],
  columbus: ["New Albany", "Dublin", "Upper Arlington", "Short North", "Westerville"],
  cleveland: ["Shaker Heights", "Huntington Woods", "Westlake", "Lakewood", "Parma"],
  pittsburgh: ["Sewickley", "Shadyside", "Mt. Lebanon", "Squirrel Hill", "Cranberry"],
  cincinnati: ["Indian Hill", "Hyde Park", "Mason", "Oakley", "Norwood"],
  "st louis": ["Ladue", "Clayton", "Kirkwood", "Webster Groves", "Florissant"],
  "st. louis": ["Ladue", "Clayton", "Kirkwood", "Webster Groves", "Florissant"],
  richmond: ["Windsor Farms", "The Fan", "Short Pump", "Midlothian", "Henrico"],
  raleigh: ["North Hills", "Cary", "Chapel Hill", "Durham", "Garner"],
  "salt lake city": ["Park City", "Federal Heights", "Sugar House", "Draper", "West Valley"],
}

/** National single-metro default when geo and timezone both fail. */
const DEFAULT_METRO = "los angeles"

/** Display label for greater metro (search queries, SERP). Neighborhoods stay for toasts. */
const METRO_LABEL: Record<string, string> = {
  "los angeles": "Los Angeles",
  la: "Los Angeles",
  "new york": "New York",
  nyc: "New York",
  chicago: "Chicago",
  houston: "Houston",
  dallas: "Dallas",
  "fort worth": "Fort Worth",
  phoenix: "Phoenix",
  "san diego": "San Diego",
  "san francisco": "San Francisco",
  "san jose": "San Jose",
  seattle: "Seattle",
  denver: "Denver",
  atlanta: "Atlanta",
  miami: "Miami",
  orlando: "Orlando",
  tampa: "Tampa",
  washington: "Washington DC",
  "washington, d.c.": "Washington DC",
  "washington dc": "Washington DC",
  boston: "Boston",
  philadelphia: "Philadelphia",
  detroit: "Detroit",
  minneapolis: "Minneapolis",
  portland: "Portland",
  "las vegas": "Las Vegas",
  austin: "Austin",
  charlotte: "Charlotte",
  nashville: "Nashville",
  baltimore: "Baltimore",
  sacramento: "Sacramento",
  "kansas city": "Kansas City",
  indianapolis: "Indianapolis",
  columbus: "Columbus",
  cleveland: "Cleveland",
  pittsburgh: "Pittsburgh",
  cincinnati: "Cincinnati",
  "st louis": "St. Louis",
  "st. louis": "St. Louis",
  richmond: "Richmond",
  raleigh: "Raleigh",
  "salt lake city": "Salt Lake City",
}

function titleCaseMetro(key: string): string {
  return key
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function pickStable<T>(items: T[], seed: string): T {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return items[hash % items.length]!
}

function shuffleStable<T>(items: T[], seed: string): T[] {
  const arr = [...items]
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) >>> 0
    const j = hash % (i + 1)
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

function normalizeCity(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, " ")
}

/** Timezone → metro key when IP geo fails (common in local dev / VPN). */
const TZ_TO_METRO: Record<string, string> = {
  "America/Los_Angeles": "los angeles",
  "America/New_York": "new york",
  "America/Chicago": "chicago",
  "America/Denver": "denver",
  "America/Phoenix": "phoenix",
  "America/Detroit": "detroit",
  "America/Indiana/Indianapolis": "indianapolis",
  "America/Boise": "salt lake city",
  "America/Anchorage": "seattle",
}

function metroKeyFromTimezone(tz?: string | null): string | null {
  if (!tz) return null
  return TZ_TO_METRO[tz] ?? null
}

/** Resolve which metro key drives place rotation for this visitor. */
function resolveMetroKey(
  city: string | null | undefined,
  timezone?: string | null
): string {
  const key = city ? normalizeCity(city) : null
  if (key && METRO_TO_LOCAL[key]) return key
  return metroKeyFromTimezone(timezone) ?? DEFAULT_METRO
}

/** Greater metro label for geo-targeted search copy (not neighborhood). */
export function metroLabelForLocality(
  city: string | null | undefined,
  _region?: string | null,
  timezone?: string | null
): string {
  const key = resolveMetroKey(city, timezone)
  return METRO_LABEL[key] ?? titleCaseMetro(key)
}

/** Build 4 distinct rotating places (mix of tiers) for a visitor metro — never mix metros. */
export function placesForLocality(
  city: string | null | undefined,
  region?: string | null,
  timezone?: string | null
): string[] {
  const seed = `${city ?? "fallback"}|${region ?? ""}|${timezone ?? ""}`
  let key = city ? normalizeCity(city) : null
  let locals = key ? METRO_TO_LOCAL[key] : undefined

  if (!locals?.length) {
    const fromTz = metroKeyFromTimezone(timezone)
    if (fromTz) {
      key = fromTz
      locals = METRO_TO_LOCAL[fromTz]
    }
  }

  if (!locals?.length) {
    // No geo / tz — stay inside one coherent metro, not a national grab bag
    locals = METRO_TO_LOCAL[DEFAULT_METRO]
    key = DEFAULT_METRO
  }

  const rotated = shuffleStable(locals!, seed)
  const out: string[] = []
  for (const p of rotated) {
    if (!out.includes(p)) out.push(p)
    if (out.length === 4) return out
  }
  // Mid-size city name from IP that isn't in our map — lead with it, fill from nearest metro list
  if (city && !METRO_TO_LOCAL[normalizeCity(city)]) {
    const base = city.trim()
    const fill = rotated.filter((p) => p.toLowerCase() !== base.toLowerCase())
    return [base, ...fill].filter((p, i, a) => a.indexOf(p) === i).slice(0, 4)
  }
  return out.length ? out : shuffleStable(METRO_TO_LOCAL[DEFAULT_METRO]!, seed).slice(0, 4)
}

/** Prefer a local place name over a mega-metro label. */
export function localizePlaceName(
  city: string | null | undefined,
  region?: string | null,
  timezone?: string | null
): string {
  return placesForLocality(city, region, timezone)[0]!
}

export async function resolveVisitorLocality(): Promise<VisitorLocality> {
  const timezone =
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : null

  // Prefer browser-side IP lookup so we resolve the visitor, not the server.
  // Accuracy: city / metro level is typical; neighborhoods are illustrative locals in that metro.
  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(3500),
    })
    if (res.ok) {
      const data = (await res.json()) as {
        city?: string
        region?: string
        region_code?: string
        error?: boolean
      }
      if (!data.error && data.city) {
        const region = data.region || data.region_code || null
        const places = placesForLocality(data.city, region, timezone)
        return {
          place: places[0]!,
          places,
          metro: metroLabelForLocality(data.city, region, timezone),
          region,
          source: "geo",
        }
      }
    }
  } catch {
    // continue to same-origin proxy
  }

  try {
    const res = await fetch("/api/construction-locality", {
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) throw new Error(`geo ${res.status}`)
    const data = (await res.json()) as {
      place?: string
      places?: string[]
      region?: string | null
      source?: "geo" | "fallback"
      city?: string
    }
    const places =
      data.places && data.places.length >= 4 && data.source === "geo"
        ? data.places.slice(0, 4)
        : placesForLocality(data.city ?? null, data.region, timezone)
    return {
      place: places[0]!,
      places,
      metro: metroLabelForLocality(data.city ?? null, data.region, timezone),
      region: data.region ?? null,
      source: data.source ?? "geo",
    }
  } catch {
    const places = placesForLocality(null, null, timezone)
    return {
      place: places[0]!,
      places,
      metro: metroLabelForLocality(null, null, timezone),
      region: null,
      source: "fallback",
    }
  }
}

export const INQUIRY_CHANNELS = [
  "Google Ads",
  "Instagram Ads",
  "Google Search",
  "Facebook Ads",
  "Website form",
] as const

export type InquiryChannel = (typeof INQUIRY_CHANNELS)[number]

export function pickInquiryChannel(seed: string): InquiryChannel {
  return pickStable([...INQUIRY_CHANNELS], seed)
}
