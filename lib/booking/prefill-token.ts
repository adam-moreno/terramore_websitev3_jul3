/**
 * Signed, encrypted /book?ref= tokens, so an owner who clicks "Book a free call" in one of our emails doesn't retype
 * what we already know. Server only (node:crypto).
 *
 * Token format v1 (the Terra IQ dashboard mints the same token with the same BOOKING_PREFILL_SECRET):
 *   key   = HMAC-SHA256(key: BOOKING_PREFILL_SECRET, message: "terramore/book-prefill/v1")   (32 bytes)
 *   plain = UTF-8 JSON {"e": email lowercased and trimmed, "x": expiry in unix seconds}
 *   token = "v1." + base64url( iv (12 random bytes) || AES-256-GCM(key, iv, plain) ciphertext || GCM tag (16 bytes) )
 * GCM authenticates the token (tampering fails), and the email isn't readable from the URL: base64 alone would put the
 * email in page URLs, analytics and logs.
 */

import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto"

export const PREFILL_TOKEN_PREFIX = "v1."
export const PREFILL_DEFAULT_TTL_SECONDS = 30 * 24 * 60 * 60
const KEY_INFO = "terramore/book-prefill/v1"
const IV_BYTES = 12
const TAG_BYTES = 16
const MAX_TOKEN_LENGTH = 600
const SITE = "https://www.terramore.io"

export function prefillSecret(): string | null {
  return process.env.BOOKING_PREFILL_SECRET?.trim() || null
}

function keyFrom(secret: string): Buffer {
  return createHmac("sha256", secret).update(KEY_INFO).digest()
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromB64url(value: string): Buffer | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) return null
  return Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64")
}

/** Mints a token. Returns null without a secret or a usable email. */
export function signPrefillToken(
  email: string,
  opts: { secret?: string | null; ttlSeconds?: number; now?: number } = {},
): string | null {
  const secret = opts.secret === undefined ? prefillSecret() : opts.secret
  const e = typeof email === "string" ? email.trim().toLowerCase() : ""
  if (!secret || !e || !e.includes("@")) return null
  const now = Math.floor((opts.now ?? Date.now()) / 1000)
  const plain = Buffer.from(JSON.stringify({ e, x: now + (opts.ttlSeconds ?? PREFILL_DEFAULT_TTL_SECONDS) }), "utf8")
  const iv = randomBytes(IV_BYTES)
  const cipher = createCipheriv("aes-256-gcm", keyFrom(secret), iv)
  const body = Buffer.concat([cipher.update(plain), cipher.final()])
  return PREFILL_TOKEN_PREFIX + b64url(Buffer.concat([iv, body, cipher.getAuthTag()]))
}

/** The email in a valid, unexpired token; null for anything else. Never throws. */
export function verifyPrefillToken(token: unknown, opts: { secret?: string | null; now?: number } = {}): string | null {
  try {
    const secret = opts.secret === undefined ? prefillSecret() : opts.secret
    if (!secret || typeof token !== "string" || token.length > MAX_TOKEN_LENGTH || !token.startsWith(PREFILL_TOKEN_PREFIX)) return null
    const raw = fromB64url(token.slice(PREFILL_TOKEN_PREFIX.length))
    if (!raw || raw.length <= IV_BYTES + TAG_BYTES) return null
    const iv = raw.subarray(0, IV_BYTES)
    const tag = raw.subarray(raw.length - TAG_BYTES)
    const body = raw.subarray(IV_BYTES, raw.length - TAG_BYTES)
    const decipher = createDecipheriv("aes-256-gcm", keyFrom(secret), iv)
    decipher.setAuthTag(tag)
    const plain = Buffer.concat([decipher.update(body), decipher.final()]).toString("utf8")
    const parsed = JSON.parse(plain) as { e?: unknown; x?: unknown }
    if (typeof parsed.e !== "string" || !parsed.e.includes("@") || typeof parsed.x !== "number") return null
    if (parsed.x < Math.floor((opts.now ?? Date.now()) / 1000)) return null
    return parsed.e
  } catch {
    return null
  }
}

export type BookingUtm = { source?: string; medium?: string; campaign?: string; content?: string }

/**
 * The /book link for an email we send to `email`: with `ref` when BOOKING_PREFILL_SECRET is set, plain /book otherwise.
 * UTMs are added as utm_* parameters. The email itself never goes in the URL.
 */
export function bookingRefUrl(email: string | null | undefined, utm: BookingUtm = {}, opts: { secret?: string | null; now?: number } = {}): string {
  const url = new URL(`${SITE}/book`)
  const ref = email ? signPrefillToken(email, opts) : null
  if (ref) url.searchParams.set("ref", ref)
  for (const [key, value] of Object.entries(utm)) {
    if (typeof value === "string" && value.trim()) url.searchParams.set(`utm_${key}`, value.trim())
  }
  return url.toString()
}
