/**
 * Sendblue iMessage / SMS / RCS client (https://docs.sendblue.com/api-v2).
 *
 * Env (all three required to enable):
 *   SENDBLUE_API_KEY      → header sb-api-key-id
 *   SENDBLUE_API_SECRET   → header sb-api-secret-key
 *   SENDBLUE_FROM_NUMBER  → from_number (E.164 line on the account)
 *
 * Free shared-line sandbox: outbound only after the recipient is a verified contact
 * (create via ensureContact, then they text your Sendblue number once). Dedicated /
 * paid plans remove that inbound-first allowlist.
 *
 * Wired in product flows today: send message (+ optional media_url), typing indicator
 * before outbound SMS, ensureContact on booking.
 *
 * Exported for later closing sequences (not called from booking/lead paths yet):
 *   markRead, sendReaction — inbound reply UX
 *   sendCarousel — multi-image pitch (V2 lines only; needs media URLs)
 *   evaluateService — check iMessage vs SMS vs RCS before rich sends
 */

const BASE = "https://api.sendblue.com"

export type SendblueResult = {
  ok: boolean
  skipped?: boolean
  error?: string
  /** Raw JSON body when the request reached Sendblue. */
  data?: unknown
}

type Creds = { keyId: string; secret: string; from: string }

function credentials(): Creds | null {
  const keyId = process.env.SENDBLUE_API_KEY?.trim()
  const secret = process.env.SENDBLUE_API_SECRET?.trim()
  const from = process.env.SENDBLUE_FROM_NUMBER?.trim()
  if (!keyId || !secret || !from) return null
  return { keyId, secret, from }
}

export function sendblueConfigured(): boolean {
  return Boolean(credentials())
}

/** Same rules as `normalizePhone` in lib/notify (kept local to avoid a circular import). */
function toE164(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  const digits = trimmed.replace(/[^\d]/g, "")
  if (trimmed.startsWith("+")) return digits.length >= 8 ? `+${digits}` : null
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  return null
}

function authHeaders(creds: Creds): Record<string, string> {
  return {
    "sb-api-key-id": creds.keyId,
    "sb-api-secret-key": creds.secret,
    "Content-Type": "application/json",
  }
}

async function readError(response: Response): Promise<string> {
  const body = await response.text().catch(() => "")
  return `${response.status} ${body.slice(0, 300)}`
}

function skip(why: string): SendblueResult {
  console.info(`[sendblue] skipped: ${why}`)
  return { ok: false, skipped: true, error: why }
}

function fail(error: unknown): SendblueResult {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[sendblue] failed: ${message}`)
  return { ok: false, error: message }
}

function sendblueErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") return fallback
  const row = data as { message?: unknown; error_message?: unknown }
  if (row.message != null && String(row.message)) return String(row.message)
  if (row.error_message != null && String(row.error_message)) return String(row.error_message)
  return fallback
}

async function post(
  path: string,
  body: Record<string, unknown>,
  creds: Creds,
): Promise<SendblueResult> {
  try {
    const response = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: authHeaders(creds),
      body: JSON.stringify(body),
    })
    const raw = await response.text().catch(() => "")
    let data: unknown = null
    if (raw) {
      try {
        data = JSON.parse(raw)
      } catch {
        data = null
      }
    }
    if (!response.ok) {
      return fail(sendblueErrorMessage(data, `${response.status} ${raw.slice(0, 300)}`))
    }
    // Some endpoints return status ERROR with HTTP 200.
    if (
      data &&
      typeof data === "object" &&
      "status" in data &&
      String((data as { status?: unknown }).status).toUpperCase() === "ERROR"
    ) {
      return fail(sendblueErrorMessage(data, "Sendblue ERROR status"))
    }
    return { ok: true, data }
  } catch (error) {
    return fail(error)
  }
}

/**
 * POST /api/send-message — content and/or media_url required.
 * media_url must be a public CDN URL with a file extension (no signed URLs).
 */
export async function sendblueSendMessage(input: {
  to: string
  content?: string
  mediaUrl?: string
}): Promise<SendblueResult> {
  const creds = credentials()
  if (!creds) return skip("SENDBLUE_API_KEY, SENDBLUE_API_SECRET, or SENDBLUE_FROM_NUMBER missing")

  const number = toE164(input.to)
  if (!number) return skip("no usable phone number")

  const content = input.content?.trim() || undefined
  const mediaUrl = input.mediaUrl?.trim() || undefined
  if (!content && !mediaUrl) return skip("content or mediaUrl required")

  return post(
    "/api/send-message",
    {
      number,
      from_number: creds.from,
      ...(content ? { content } : {}),
      ...(mediaUrl ? { media_url: mediaUrl } : {}),
    },
    creds,
  )
}

/**
 * POST /api/send-typing-indicator — iMessage only; needs an existing conversation route.
 * Failures are expected on first outbound to a new number; callers should ignore errors.
 */
export async function sendTypingIndicator(
  to: string,
  opts: { state?: "start" | "stop"; maxDurationMs?: number } = {},
): Promise<SendblueResult> {
  const creds = credentials()
  if (!creds) return skip("Sendblue not configured")

  const number = toE164(to)
  if (!number) return skip("no usable phone number")

  return post(
    "/api/send-typing-indicator",
    {
      number,
      from_number: creds.from,
      state: opts.state || "start",
      ...(opts.maxDurationMs != null ? { max_duration_ms: opts.maxDurationMs } : {}),
    },
    creds,
  )
}

/**
 * POST /api/mark-read — iMessage/RCS; account may need Sendblue to enable read receipts.
 * Useful later when handling inbound webhooks before an agent reply.
 */
export async function markRead(to: string): Promise<SendblueResult> {
  const creds = credentials()
  if (!creds) return skip("Sendblue not configured")

  const number = toE164(to)
  if (!number) return skip("no usable phone number")

  return post("/api/mark-read", { number, from_number: creds.from }, creds)
}

/**
 * POST /api/send-reaction — tapback on a received iMessage (message_handle from webhook).
 * Classic: love | like | dislike | laugh | emphasize | question; or one emoji; prefix - to remove.
 */
export async function sendReaction(input: {
  messageHandle: string
  reaction: string
  partIndex?: number
}): Promise<SendblueResult> {
  const creds = credentials()
  if (!creds) return skip("Sendblue not configured")

  const handle = input.messageHandle?.trim()
  const reaction = input.reaction
  if (!handle) return skip("messageHandle required")
  if (!reaction) return skip("reaction required")

  return post(
    "/api/send-reaction",
    {
      from_number: creds.from,
      message_handle: handle,
      reaction,
      ...(input.partIndex != null ? { part_index: input.partIndex } : {}),
    },
    creds,
  )
}

/**
 * POST /api/v2/contacts — grow the free-plan allowlist when a lead shares a phone.
 * Free plan still needs the contact to text your line once before outbound works.
 * update_if_exists avoids 409 on repeat bookers.
 */
export async function ensureContact(input: {
  phone: string
  firstName?: string
  lastName?: string
  tags?: string[]
  updateIfExists?: boolean
}): Promise<SendblueResult> {
  const creds = credentials()
  if (!creds) return skip("Sendblue not configured")

  const number = toE164(input.phone)
  if (!number) return skip("no usable phone number")

  return post(
    "/api/v2/contacts",
    {
      number,
      sendblue_number: creds.from,
      update_if_exists: input.updateIfExists !== false,
      ...(input.firstName?.trim() ? { first_name: input.firstName.trim() } : {}),
      ...(input.lastName?.trim() ? { last_name: input.lastName.trim() } : {}),
      ...(input.tags?.length ? { tags: input.tags } : {}),
    },
    creds,
  )
}

/**
 * POST /api/send-carousel — V2 lines only; 2–20 HTTPS image URLs.
 * Not wired into booking yet; use from a future closing sequence when you have assets.
 */
export async function sendCarousel(input: {
  to: string
  mediaUrls: string[]
}): Promise<SendblueResult> {
  const creds = credentials()
  if (!creds) return skip("Sendblue not configured")

  const number = toE164(input.to)
  if (!number) return skip("no usable phone number")
  const urls = input.mediaUrls.map((u) => u.trim()).filter(Boolean)
  if (urls.length < 2) return skip("carousel needs at least 2 mediaUrls")

  return post(
    "/api/send-carousel",
    {
      number,
      from_number: creds.from,
      media_urls: urls,
    },
    creds,
  )
}

/** GET /api/evaluate-service — iMessage | SMS | RCS for a recipient (useful before rich/RCS sends). */
export async function evaluateService(to: string): Promise<SendblueResult> {
  const creds = credentials()
  if (!creds) return skip("Sendblue not configured")

  const number = toE164(to)
  if (!number) return skip("no usable phone number")

  try {
    const url = new URL(`${BASE}/api/evaluate-service`)
    url.searchParams.set("number", number)
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "sb-api-key-id": creds.keyId,
        "sb-api-secret-key": creds.secret,
      },
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) return fail(await readError(response))
    return { ok: true, data }
  } catch (error) {
    return fail(error)
  }
}
