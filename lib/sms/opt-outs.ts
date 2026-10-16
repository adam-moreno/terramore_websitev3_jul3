/**
 * Text opt-outs (website.sms_opt_outs, migration 20261015_sms_opt_outs.sql). Server only.
 * isOptedOut fails open on a read error (logged), so an outage never blocks Adam's own lead alerts; the STOP itself is
 * always recorded first, before any reply.
 */

import { getServerSupabase, isMissingColumnError } from "@/lib/supabase-server"

const TABLE = "sms_opt_outs"

function client() {
  const supabase = getServerSupabase()
  return supabase ? supabase.schema("website") : null
}

export async function isOptedOut(phone: string): Promise<boolean> {
  const db = client()
  if (!db) return false
  const { data, error } = await db.from(TABLE).select("phone").eq("phone", phone).maybeSingle()
  if (error) {
    if (!isMissingColumnError(error)) console.error(`[sms] opt-out lookup failed: ${error.message}`)
    return false
  }
  return Boolean(data)
}

export async function recordOptOut(phone: string, keyword: string): Promise<boolean> {
  const db = client()
  if (!db) return false
  const { error } = await db.from(TABLE).upsert({ phone, keyword: keyword.slice(0, 20), source: "sendblue", opted_out_at: new Date().toISOString() }, { onConflict: "phone" })
  if (error) console.error(`[sms] opt-out not saved (run 20261015_sms_opt_outs.sql?): ${error.message}`)
  return !error
}

export async function clearOptOut(phone: string): Promise<void> {
  const db = client()
  if (!db) return
  const { error } = await db.from(TABLE).delete().eq("phone", phone)
  if (error) console.error(`[sms] opt-in not saved: ${error.message}`)
}
