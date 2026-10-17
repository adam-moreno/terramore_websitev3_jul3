/**
 * TerraAI → Adam hand-offs on the 612 line (Adam, 2026-10-17). Table: website.sms_handoffs
 * (migration 20261017_terraai_handoffs.sql). Server only; never throws.
 *
 * - When TerraAI hands off, the conversation gets a short code (A7) and TerraAI goes quiet on that number only.
 * - Adam gets a text on his cell (HANDOFF_ALERT_PHONE, kept out of this public repo) with who it is, what they want and
 *   the code. He answers from his iPhone by texting the 612 line "A7 <message>"; it's relayed from 612, so the owner
 *   sees one thread. "A7 done" gives the conversation back to TerraAI. Replies from the Sendblue inbox also count.
 * - No answer in 10 minutes during business hours (Mon–Fri 8am–6pm Pacific): one "still getting someone" text.
 *   After hours that text goes right away, with the next business morning.
 * - A hand-off with no activity for 24 hours ends on its own, and TerraAI picks the conversation back up.
 */

import { normalizePhone } from "@/lib/notify"
import { getServerSupabase } from "@/lib/supabase-server"

export const CLAIM_MINUTES = 10
export const IDLE_HOURS = 24
const TZ = "America/Los_Angeles"
const OPEN_HOUR = 8
const CLOSE_HOUR = 18

export type Handoff = {
  id: string
  phone: string
  code: string
  status: "open" | "claimed" | "closed"
  reason: string | null
  created_at: string
  last_activity_at: string
  claimed_at: string | null
  followup_sent_at: string | null
  closed_at: string | null
}

/** Adam's cell for hand-off alerts and "A7 …" replies. Unset means alerts go to Slack and email only. */
export function alertPhone(): string | null {
  return normalizePhone(process.env.HANDOFF_ALERT_PHONE)
}

function pacific(now: number): { weekday: number; hour: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(new Date(now))
  const day = parts.find((p) => p.type === "weekday")?.value ?? "Mon"
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0)
  return { weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(day), hour }
}

/** Mon–Fri, 8am to 6pm Pacific. */
export function inBusinessHours(now = Date.now()): boolean {
  const { weekday, hour } = pacific(now)
  return weekday >= 1 && weekday <= 5 && hour >= OPEN_HOUR && hour < CLOSE_HOUR
}

/** "tomorrow morning" or "Monday morning": when Customer Success is next in, said from an after-hours moment. */
export function nextOpening(now = Date.now()): string {
  const { weekday, hour } = pacific(now)
  if (weekday >= 1 && weekday <= 5 && hour < OPEN_HOUR) return "this morning"
  const next = (weekday + 1) % 7
  if (next >= 1 && next <= 5) return "tomorrow morning"
  return "Monday morning"
}

/** The text the owner gets when nobody has picked up their hand-off. */
export function followupText(book: string, now = Date.now()): string {
  if (inBusinessHours(now)) return `Still getting someone from our Customer Success team for you. Want to pick a time instead? ${book}`
  return `It's after hours here, so someone from our Customer Success team will text you ${nextOpening(now)}. Or grab a time that works for you: ${book}`
}

/** "A7 hello there" → { code: "A7", rest: "hello there" }. Only Adam's texts are read this way. */
export function parseCommand(text: string): { code: string; rest: string } | null {
  const m = /^\s*([A-Za-z][0-9])(?:\s+|$)([\s\S]*)$/.exec(text)
  return m ? { code: m[1].toUpperCase(), rest: m[2].trim() } : null
}

export function isGiveBack(rest: string): boolean {
  return /^(done|back|release|give back|terraai)\.?$/i.test(rest.trim())
}

/** What Adam reads on his phone when TerraAI hands off. */
export function alertText(h: { code: string; who: string; phone: string; said: string; reason: string | null; notes: string | null }): string {
  return [
    `${h.code}: TerraAI handed you ${h.who}`,
    h.reason ? `Why: ${h.reason}` : "",
    `They said: "${h.said.slice(0, 280)}"`,
    h.notes ? `Notes: ${h.notes}` : "",
    `Call: ${h.phone}`,
    `Reply here with "${h.code} your message" to text them from this line. "${h.code} done" gives it back to TerraAI.`,
  ]
    .filter(Boolean)
    .join("\n")
}

function db() {
  const supabase = getServerSupabase()
  return supabase ? supabase.schema("website") : null
}

const idleCutoff = (now: number) => new Date(now - IDLE_HOURS * 3600 * 1000).toISOString()

/** The hand-off TerraAI is waiting on for this number, if any. */
export async function activeHandoff(phone: string, now = Date.now()): Promise<Handoff | null> {
  const client = db()
  if (!client) return null
  const { data } = await client
    .from("sms_handoffs")
    .select("*")
    .eq("phone", phone)
    .is("closed_at", null)
    .gte("last_activity_at", idleCutoff(now))
    .order("last_activity_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data as Handoff | null) ?? null
}

export async function handoffByCode(code: string, now = Date.now()): Promise<Handoff | null> {
  const client = db()
  if (!client) return null
  const { data } = await client
    .from("sms_handoffs")
    .select("*")
    .eq("code", code.toUpperCase())
    .is("closed_at", null)
    .gte("last_activity_at", idleCutoff(now))
    .order("last_activity_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  return (data as Handoff | null) ?? null
}

/** A code no active hand-off is using: A1…Z9, starting from a random spot. */
async function freeCode(now: number): Promise<string> {
  const client = db()
  const taken = new Set<string>()
  if (client) {
    const { data } = await client.from("sms_handoffs").select("code").is("closed_at", null).gte("last_activity_at", idleCutoff(now))
    for (const row of (data ?? []) as Array<{ code: string }>) taken.add(row.code)
  }
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const start = Math.floor(Math.random() * letters.length * 9)
  for (let i = 0; i < letters.length * 9; i++) {
    const n = (start + i) % (letters.length * 9)
    const code = `${letters[Math.floor(n / 9)]}${(n % 9) + 1}`
    if (!taken.has(code)) return code
  }
  return "Z9"
}

/** Opens a hand-off (or returns the one already open for this number). */
export async function openHandoff(phone: string, reason: string | null, now = Date.now()): Promise<Handoff | null> {
  const existing = await activeHandoff(phone, now)
  if (existing) {
    await touchHandoff(existing.id)
    return existing
  }
  const client = db()
  if (!client) return null
  const code = await freeCode(now)
  const { data, error } = await client.from("sms_handoffs").insert({ phone, code, reason: reason?.slice(0, 300) || null }).select("*").maybeSingle()
  if (error) {
    console.error(`[handoff] not saved (run 20261017_terraai_handoffs.sql?): ${error.message}`)
    return null
  }
  return (data as Handoff | null) ?? null
}

export async function touchHandoff(id: string, patch: Partial<Pick<Handoff, "status" | "claimed_at" | "followup_sent_at">> = {}): Promise<void> {
  const client = db()
  if (!client) return
  await client.from("sms_handoffs").update({ last_activity_at: new Date().toISOString(), ...patch }).eq("id", id)
}

export async function claimHandoff(h: Handoff): Promise<void> {
  await touchHandoff(h.id, h.claimed_at ? { status: "claimed" } : { status: "claimed", claimed_at: new Date().toISOString() })
}

export async function closeHandoff(id: string): Promise<void> {
  const client = db()
  if (!client) return
  await client.from("sms_handoffs").update({ status: "closed", closed_at: new Date().toISOString() }).eq("id", id)
}

/** Open (unclaimed) hand-offs older than the claim window that haven't had their follow-up. */
export async function dueFollowups(now = Date.now()): Promise<Handoff[]> {
  const client = db()
  if (!client) return []
  const { data } = await client
    .from("sms_handoffs")
    .select("*")
    .eq("status", "open")
    .is("closed_at", null)
    .is("followup_sent_at", null)
    .lte("created_at", new Date(now - CLAIM_MINUTES * 60 * 1000).toISOString())
    .gte("last_activity_at", idleCutoff(now))
    .limit(20)
  return (data ?? []) as Handoff[]
}
