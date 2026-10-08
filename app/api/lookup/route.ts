import { newLookupId, hostOf, normalizeLookupWebsite, runLookup } from "@/lib/lookup/run"
import type { LookupEvent } from "@/lib/lookup/types"

/**
 * POST /api/lookup { website } → newline-delimited JSON LookupEvents, streamed as each source finishes.
 * The free business lookup: no lead row, no email, nothing stored. The full report (and its conversion) still goes
 * through POST /api/report from the report form.
 *
 * Abuse limits (per server instance; good enough to stop casual loops, not a substitute for edge rate limiting):
 * 6 lookups per IP per 10 minutes, and the same domain is answered from a 15-minute cache.
 */

export const runtime = "nodejs"
export const maxDuration = 60

const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 6
const CACHE_MS = 15 * 60 * 1000
/** Leave headroom under maxDuration for the stream to close cleanly. */
const BUDGET_MS = 40 * 1000

const hits = new Map<string, number[]>()
const cache = new Map<string, { at: number; events: LookupEvent[] }>()

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
}

function allow(ip: string, now: number): boolean {
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return false
  }
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return true
}

function line(event: LookupEvent): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(event)}\n`)
}

function single(event: LookupEvent, status: number): Response {
  return new Response(JSON.stringify(event) + "\n", {
    status,
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return single({ type: "error", code: "invalid_website", message: "" }, 400)
  }
  const website = normalizeLookupWebsite((body as { website?: unknown } | null)?.website)
  if (!website) return single({ type: "error", code: "invalid_website", message: "" }, 400)

  const now = Date.now()
  if (!allow(clientIp(request), now)) return single({ type: "error", code: "rate_limited", message: "" }, 429)

  const lookupId = newLookupId()
  const host = hostOf(website)
  const cached = cache.get(host)

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      if (cached && now - cached.at < CACHE_MS) {
        for (const event of cached.events) {
          controller.enqueue(line(event.type === "start" ? { ...event, lookupId } : event))
        }
        controller.close()
        return
      }
      const events: LookupEvent[] = []
      const emit = (event: LookupEvent) => {
        events.push(event)
        controller.enqueue(line(event))
      }
      try {
        await runLookup(website, lookupId, emit, now + BUDGET_MS)
      } catch {
        emit({ type: "error", code: "server", message: "" })
      }
      if (events.some((e) => e.type === "done")) {
        cache.set(host, { at: now, events })
        if (cache.size > 500) cache.delete(cache.keys().next().value as string)
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  })
}
