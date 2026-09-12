/**
 * Server-only bridge to the Terra IQ booking API. The secret never reaches the browser:
 * the client talks to app/api/booking/*, which calls these helpers.
 *
 * Env:
 * - BOOKING_API_URL     Terra IQ origin, default https://dashboard.terramore.io
 * - BOOKING_API_SECRET  shared secret, sent as the x-booking-secret header
 */

export const SITE_URL = "https://www.terramore.io"

export type BookingRecord = {
  id: string
  startIso: string
  endIso: string
  meetUrl: string | null
  meetProvider: "google_meet" | "teams" | null
  manageToken: string
  ownerTz?: string
  status?: string
  name?: string
  email?: string
}

export function bookingApiConfigured(): boolean {
  return Boolean(process.env.BOOKING_API_SECRET?.trim())
}

function baseUrl(): string {
  return (process.env.BOOKING_API_URL?.trim() || "https://dashboard.terramore.io").replace(/\/+$/, "")
}

export type BookingApiResult<T> = { ok: true; status: number; data: T } | { ok: false; status: number; error: string }

/** Calls Terra IQ. Never throws; a missing secret or a network failure comes back as ok:false. */
export async function bookingApi<T>(path: string, init: { method?: "GET" | "POST"; body?: unknown } = {}): Promise<BookingApiResult<T>> {
  const secret = process.env.BOOKING_API_SECRET?.trim()
  if (!secret) return { ok: false, status: 503, error: "not_configured" }

  try {
    const response = await fetch(`${baseUrl()}${path}`, {
      method: init.method || "GET",
      headers: { "x-booking-secret": secret, "Content-Type": "application/json" },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    })
    const data = (await response.json().catch(() => ({}))) as T & { error?: string }
    if (!response.ok) {
      console.warn(`[booking] Terra IQ ${path} answered ${response.status}: ${data.error || "no error field"}`)
      return { ok: false, status: response.status, error: data.error || `upstream_${response.status}` }
    }
    return { ok: true, status: response.status, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[booking] Terra IQ ${path} failed: ${message}`)
    return { ok: false, status: 502, error: "upstream_unreachable" }
  }
}

export function manageUrl(token: string): string {
  return `${SITE_URL}/book/manage?token=${encodeURIComponent(token)}`
}
