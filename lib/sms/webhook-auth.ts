import { timingSafeEqual } from "node:crypto"

function same(a: string, b: string): boolean {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

/**
 * Sendblue webhook auth: SENDBLUE_WEBHOOK_SECRET as ?key= on the webhook URL, or as any header's value (Sendblue puts
 * its signing secret in a header it doesn't name; "Bearer " is ignored). Constant-time; a short or missing secret
 * refuses everything.
 */
export function authorised(request: { url: string; headers: Headers }, secret: string | undefined): boolean {
  const want = secret?.trim()
  if (!want || want.length < 24) return false
  const key = new URL(request.url).searchParams.get("key")
  if (key && same(key, want)) return true
  for (const [, value] of request.headers) {
    const v = value.replace(/^Bearer\s+/i, "").trim()
    if (v && same(v, want)) return true
  }
  return false
}
