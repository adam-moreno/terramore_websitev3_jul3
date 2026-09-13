import { sendEmail } from "@/lib/notify"
import { getServerSupabase } from "@/lib/supabase-server"
import { buildNurtureEmail } from "./templates"
import type { LeadNurtureRow, NurtureStep } from "./types"

const DAY_MS = 24 * 60 * 60 * 1000

export type ProcessNurtureResult = {
  ok: boolean
  checked: number
  sent: { step1: number; step2: number; step3: number }
  errors: string[]
}

function dueStep(row: LeadNurtureRow, now: number): NurtureStep | null {
  if (row.unsubscribed_at) return null
  const enrolled = Date.parse(row.enrolled_at)
  if (!Number.isFinite(enrolled)) return null
  const age = now - enrolled

  if (!row.step1_sent_at && age >= 1 * DAY_MS) return 1
  if (row.step1_sent_at && !row.step2_sent_at && age >= 3 * DAY_MS) return 2
  if (row.step2_sent_at && !row.step3_sent_at && age >= 5 * DAY_MS) return 3
  return null
}

function stampColumn(step: NurtureStep): "step1_sent_at" | "step2_sent_at" | "step3_sent_at" {
  if (step === 1) return "step1_sent_at"
  if (step === 2) return "step2_sent_at"
  return "step3_sent_at"
}

/**
 * Find enrolled leads due for the next nurture step, send branded email, stamp sent_at.
 * Never throws.
 */
export async function processNurtureQueue(): Promise<ProcessNurtureResult> {
  const result: ProcessNurtureResult = {
    ok: true,
    checked: 0,
    sent: { step1: 0, step2: 0, step3: 0 },
    errors: [],
  }

  try {
    const supabase = getServerSupabase()
    if (!supabase) {
      result.ok = false
      result.errors.push("Supabase not configured")
      return result
    }

    const { data, error } = await supabase
      .from("lead_nurture")
      .select(
        "id,email,name,source,business_type,job,business_name,website,enrolled_at,step1_sent_at,step2_sent_at,step3_sent_at,unsubscribed_at",
      )
      .is("unsubscribed_at", null)
      .is("step3_sent_at", null)
      .order("enrolled_at", { ascending: true })
      .limit(200)

    if (error) {
      result.ok = false
      result.errors.push(error.message)
      return result
    }

    const rows = (data || []) as LeadNurtureRow[]
    result.checked = rows.length
    const now = Date.now()

    for (const row of rows) {
      const step = dueStep(row, now)
      if (!step) continue

      const email = buildNurtureEmail(row, step)
      const send = await sendEmail({
        to: row.email,
        subject: email.subject,
        text: email.text,
        html: email.html,
      })

      if (!send.ok) {
        result.errors.push(`${row.email} step${step}: ${send.error || "send failed"}`)
        continue
      }

      const column = stampColumn(step)
      const { error: updateError } = await supabase
        .from("lead_nurture")
        .update({ [column]: new Date().toISOString() })
        .eq("id", row.id)
        .is(column, null)

      if (updateError) {
        result.errors.push(`${row.email} step${step} stamp: ${updateError.message}`)
        continue
      }

      if (step === 1) result.sent.step1 += 1
      else if (step === 2) result.sent.step2 += 1
      else result.sent.step3 += 1
    }

    if (result.errors.length) result.ok = false
    return result
  } catch (error) {
    result.ok = false
    result.errors.push(error instanceof Error ? error.message : String(error))
    return result
  }
}
