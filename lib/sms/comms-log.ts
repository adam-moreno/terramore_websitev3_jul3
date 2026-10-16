/**
 * Writes texts to the dashboard's Comms log (public.comms_messages, dashboard migration 090), so the staff Comms page
 * shows website texts and replies. Same rules as the dashboard's lib/comms/log.ts: phone in E.164 as the counterpart, a
 * preview of at most 300 characters with links removed, never a full body. Never throws.
 * Returns "duplicate" when the provider already delivered this message (a webhook retry), so callers act once.
 */

import { getServerSupabase } from "@/lib/supabase-server"

export function smsPreview(text: string): string {
  return text.replace(/https?:\/\/\S+/g, "[link]").replace(/\s+/g, " ").trim().slice(0, 300)
}

export async function logText(row: {
  direction: "inbound" | "outbound"
  phone: string
  status: string
  text: string
  providerId?: string | null
  stream?: string | null
}): Promise<"logged" | "duplicate" | "failed"> {
  try {
    const supabase = getServerSupabase()
    if (!supabase) return "failed"
    const { error } = await supabase
      .schema("public")
      .from("comms_messages")
      .insert({
        channel: "sms",
        direction: row.direction,
        counterpart: row.phone.toLowerCase(),
        stream: row.stream && /^[A-Za-z0-9_-]{1,64}$/.test(row.stream) ? row.stream : null,
        provider: "sendblue",
        provider_id: row.providerId ? row.providerId.slice(0, 200) : null,
        status: row.status.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 40) || "unknown",
        preview: smsPreview(row.text),
        occurred_at: new Date().toISOString(),
      })
    if (!error) return "logged"
    if (error.code === "23505") return "duplicate"
    console.error(`[sms] comms log failed: ${error.message}`)
    return "failed"
  } catch (error) {
    console.error(`[sms] comms log failed: ${error instanceof Error ? error.message : String(error)}`)
    return "failed"
  }
}
