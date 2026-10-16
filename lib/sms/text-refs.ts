/**
 * Ref codes for "Tap to text us" (website.text_refs, migration 20261016_text_refs.sql). Server only. Never throws.
 */

import { randomInt } from "node:crypto"
import { getServerSupabase } from "@/lib/supabase-server"
import { isRefCode, REF_ALPHABET } from "@/lib/sms/text-link"

const TABLE = "text_refs"

function db() {
  const supabase = getServerSupabase()
  return supabase ? supabase.schema("website") : null
}

export function newRefCode(): string {
  let code = ""
  for (let i = 0; i < 5; i++) code += REF_ALPHABET[randomInt(REF_ALPHABET.length)]
  return code
}

export type TextRef = { code: string; kind: "report" | "booking"; ref_id: string; first_name: string | null; phone: string | null; used_at: string | null }

/** A new code for a report request or booking; null if it couldn't be saved (the button then sends no ref). */
export async function mintTextRef(input: { kind: "report" | "booking"; refId: string; firstName?: string | null }): Promise<string | null> {
  const client = db()
  if (!client || !input.refId) return null
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = newRefCode()
    const { error } = await client.from(TABLE).insert({ code, kind: input.kind, ref_id: input.refId.slice(0, 80), first_name: input.firstName?.trim().slice(0, 60) || null })
    if (!error) return code
    if (error.code !== "23505") {
      console.error(`[text-ref] not saved (run 20261016_text_refs.sql?): ${error.message}`)
      return null
    }
  }
  return null
}

export async function findTextRef(code: string): Promise<TextRef | null> {
  const client = db()
  if (!client || !isRefCode(code)) return null
  const { data, error } = await client.from(TABLE).select("code, kind, ref_id, first_name, phone, used_at").eq("code", code).maybeSingle()
  if (error) {
    console.error(`[text-ref] lookup failed: ${error.message}`)
    return null
  }
  return (data as TextRef | null) ?? null
}

/** Records the number that texted this ref. Returns true the first time only, so the instant reply goes once. */
export async function claimTextRef(code: string, phone: string): Promise<boolean> {
  const client = db()
  if (!client) return false
  const { data, error } = await client.from(TABLE).update({ phone, used_at: new Date().toISOString() }).eq("code", code).is("used_at", null).select("code").maybeSingle()
  if (error) console.error(`[text-ref] claim failed: ${error.message}`)
  return Boolean(data)
}

/** The number that asked for text reminders for this booking, if any. */
export async function bookingTextPhone(bookingId: string): Promise<string | null> {
  const client = db()
  if (!client || !bookingId) return null
  const { data } = await client.from(TABLE).select("phone").eq("kind", "booking").eq("ref_id", bookingId).not("phone", "is", null).order("used_at", { ascending: false }).limit(1).maybeSingle()
  return (data as { phone?: string } | null)?.phone ?? null
}
