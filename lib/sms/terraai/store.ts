/**
 * Full-text message log and TerraAI drafts (website.sms_messages, website.sms_drafts; migration
 * 20261016_terraai_texting.sql). Server only. Never throws; a missing table just means no history and no drafts.
 */

import { createHmac, timingSafeEqual } from "node:crypto"
import { getServerSupabase } from "@/lib/supabase-server"

export type SmsSource = "owner" | "terraai" | "adam" | "auto"
export type StoredMessage = { id: string; phone: string; direction: "inbound" | "outbound"; body: string; source: SmsSource; at: string }
export type Draft = {
  id: string
  phone: string
  inbound_id: string | null
  draft: string
  intent: string
  handoff: boolean
  notes: string | null
  status: "pending" | "sent" | "edited" | "discarded" | "superseded" | "failed"
  final_text: string | null
  created_at: string
}

function db() {
  const supabase = getServerSupabase()
  return supabase ? supabase.schema("website") : null
}

export async function saveMessage(m: { phone: string; direction: "inbound" | "outbound"; body: string; source: SmsSource; providerId?: string | null }): Promise<string | null> {
  const client = db()
  if (!client) return null
  const { data, error } = await client
    .from("sms_messages")
    .insert({ phone: m.phone, direction: m.direction, body: m.body.slice(0, 2000), source: m.source, provider_id: m.providerId ?? null })
    .select("id")
    .maybeSingle()
  if (error) {
    if (error.code !== "23505") console.error(`[terraai] message not saved (run 20261016_terraai_texting.sql?): ${error.message}`)
    return null
  }
  return (data as { id: string } | null)?.id ?? null
}

/** The last `limit` messages with this number, oldest first. */
export async function recentMessages(phone: string, limit = 20): Promise<StoredMessage[]> {
  const client = db()
  if (!client) return []
  const { data, error } = await client.from("sms_messages").select("id, phone, direction, body, source, at").eq("phone", phone).order("at", { ascending: false }).limit(limit)
  if (error) return []
  return ((data ?? []) as StoredMessage[]).reverse()
}

export async function createDraft(d: { phone: string; inboundId: string | null; draft: string; intent: string; handoff: boolean; notes: string | null }): Promise<string | null> {
  const client = db()
  if (!client) return null
  // A newer text replaces any draft still waiting for this number.
  await client.from("sms_drafts").update({ status: "superseded", decided_at: new Date().toISOString() }).eq("phone", d.phone).eq("status", "pending")
  const { data, error } = await client
    .from("sms_drafts")
    .insert({ phone: d.phone, inbound_id: d.inboundId, draft: d.draft.slice(0, 1200), intent: d.intent, handoff: d.handoff, notes: d.notes?.slice(0, 600) || null })
    .select("id")
    .maybeSingle()
  if (error) {
    console.error(`[terraai] draft not saved: ${error.message}`)
    return null
  }
  return (data as { id: string } | null)?.id ?? null
}

export async function getDraft(id: string): Promise<Draft | null> {
  const client = db()
  if (!client || !/^[0-9a-f-]{36}$/i.test(id)) return null
  const { data } = await client.from("sms_drafts").select("*").eq("id", id).maybeSingle()
  return (data as Draft | null) ?? null
}

/** Moves a pending draft to its final state. Returns false if it was already decided (a second click does nothing). */
export async function decideDraft(id: string, status: "sent" | "edited" | "discarded" | "failed", finalText: string | null): Promise<boolean> {
  const client = db()
  if (!client) return false
  const { data } = await client
    .from("sms_drafts")
    .update({ status, final_text: finalText?.slice(0, 1200) ?? null, decided_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending")
    .select("id")
    .maybeSingle()
  return Boolean(data)
}

// --- Review links: /sms/drafts/{id}?t={expiry}.{signature}, valid 72 hours, signed with TERRAAI_DRAFT_SECRET.

const LINK_HOURS = 72

function secret(): string | null {
  const s = (process.env.TERRAAI_DRAFT_SECRET || process.env.SENDBLUE_WEBHOOK_SECRET || "").trim()
  return s.length >= 24 ? s : null
}

function sign(id: string, exp: number, key: string): string {
  return createHmac("sha256", key).update(`terraai-draft:${id}:${exp}`).digest("base64url")
}

export function draftToken(id: string, now = Date.now()): string | null {
  const key = secret()
  if (!key) return null
  const exp = Math.floor(now / 1000) + LINK_HOURS * 3600
  return `${exp}.${sign(id, exp, key)}`
}

export function verifyDraftToken(id: string, token: unknown, now = Date.now()): boolean {
  const key = secret()
  if (!key || typeof token !== "string") return false
  const [expRaw, sig] = token.split(".")
  const exp = Number(expRaw)
  if (!Number.isFinite(exp) || exp < Math.floor(now / 1000) || !sig) return false
  const want = Buffer.from(sign(id, exp, key))
  const got = Buffer.from(sig)
  return want.length === got.length && timingSafeEqual(want, got)
}

export function draftReviewUrl(id: string): string | null {
  const token = draftToken(id)
  return token ? `https://www.terramore.io/sms/drafts/${id}?t=${encodeURIComponent(token)}` : null
}

// --- Auto-send (Adam, 2026-10-17): TerraAI's replies go out as written. TERRAAI_TEXT_MODE=draft switches back to
// approving each one. A number that gets AUTO_REPLY_HOURLY_CAP TerraAI texts within an hour falls back to drafts,
// so two bots can't text each other forever.

export const AUTO_REPLY_HOURLY_CAP = 6

export function textMode(): "auto" | "draft" {
  return (process.env.TERRAAI_TEXT_MODE || "").trim().toLowerCase() === "draft" ? "draft" : "auto"
}

/** TerraAI texts sent to this number in the last hour (from the message log). */
export async function terraaiRepliesLastHour(phone: string, now = Date.now()): Promise<number> {
  const since = now - 60 * 60 * 1000
  const messages = await recentMessages(phone, 30)
  return messages.filter((m) => m.direction === "outbound" && m.source === "terraai" && Date.parse(m.at) >= since).length
}
