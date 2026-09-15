/**
 * Digital Footprint report SMS (Sendblue primary via sendSms).
 *
 * Message 1 — after accepted submission (phone present).
 * Message 2 — after report PDF delivered.
 * Message 3 — optional later (stub only; not activated).
 *
 * Fail soft. Idempotent via report_sms_m1_sent_at / report_sms_m2_sent_at.
 * Already-requested path must not call these.
 */

import { getServerSupabase, isMissingColumnError } from "@/lib/supabase-server"
import { normalizePhone, sendSms, type SendResult } from "@/lib/notify"
import { ensureContactAndVerify, sendblueConfigured } from "@/lib/sendblue"

export const REPORT_SMS = {
  m1: (firstName: string) =>
    `Hey ${firstName}, Adam from Terramore here. We received your Digital Footprint Report request. We're putting it together now and will send it to your email shortly.`,
  m2: (firstName: string) =>
    `Your Digital Footprint Report is ready, ${firstName}. Check your inbox for the findings and priorities.`,
  /** Optional later — not wired. Timing TBD (e.g. +24h soft book CTA). */
  m3: (firstName: string) =>
    `Hi ${firstName}, Adam here. If you want to walk through your Digital Footprint Report together, pick a time: https://terramore.io/book`,
} as const

function firstOf(name: string): string {
  return name.trim().split(/\s+/)[0] || "there"
}

async function markSmsSent(email: string, column: "report_sms_m1_sent_at" | "report_sms_m2_sent_at"): Promise<void> {
  const supabase = getServerSupabase()
  if (!supabase) return
  const { error } = await supabase
    .from("free_courses_signups")
    .update({ [column]: new Date().toISOString() })
    .eq("email", email)
  if (error && !isMissingColumnError(error)) {
    console.error(`[report-sms] could not mark ${column}:`, error.message)
  }
}

async function alreadySent(email: string, column: "report_sms_m1_sent_at" | "report_sms_m2_sent_at"): Promise<boolean> {
  const supabase = getServerSupabase()
  if (!supabase) return false
  const { data, error } = await supabase.from("free_courses_signups").select(column).eq("email", email).maybeSingle()
  if (error) {
    if (!isMissingColumnError(error)) console.error(`[report-sms] lookup ${column} failed:`, error.message)
    return false
  }
  const value = data ? (data as Record<string, unknown>)[column] : null
  return Boolean(value)
}

async function prepareContact(phone: string, name: string): Promise<void> {
  if (!sendblueConfigured()) return
  const parts = name.trim().split(/\s+/)
  await ensureContactAndVerify({
    phone,
    firstName: parts[0] || "there",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
    tags: ["report", "terramore.io"],
    updateIfExists: true,
  }).catch(() => undefined)
}

/** Message 1 after report accept. No-op without phone. Never throws. */
export async function sendReportAcceptSms(input: {
  email: string
  name: string
  phone?: string | null
}): Promise<SendResult> {
  const phone = normalizePhone(input.phone)
  if (!phone) {
    return { ok: false, channel: "sms", skipped: true, error: "no phone on this form" }
  }
  if (await alreadySent(input.email, "report_sms_m1_sent_at")) {
    return { ok: false, channel: "sms", skipped: true, error: "m1 already sent" }
  }

  await prepareContact(phone, input.name)
  const result = await sendSms(phone, REPORT_SMS.m1(firstOf(input.name)))
  if (result.ok) await markSmsSent(input.email, "report_sms_m1_sent_at")
  return result
}

/** Message 2 after PDF delivery. No-op without phone. Never throws. */
export async function sendReportDeliveredSms(input: {
  email: string
  name: string
  phone?: string | null
}): Promise<SendResult> {
  const phone = normalizePhone(input.phone)
  if (!phone) {
    return { ok: false, channel: "sms", skipped: true, error: "no phone on this form" }
  }
  if (await alreadySent(input.email, "report_sms_m2_sent_at")) {
    return { ok: false, channel: "sms", skipped: true, error: "m2 already sent" }
  }

  await prepareContact(phone, input.name)
  const result = await sendSms(phone, REPORT_SMS.m2(firstOf(input.name)))
  if (result.ok) await markSmsSent(input.email, "report_sms_m2_sent_at")
  return result
}
