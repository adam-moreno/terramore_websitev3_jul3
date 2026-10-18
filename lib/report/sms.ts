/**
 * Digital Footprint report SMS (Sendblue primary via sendSms).
 *
 * Message 1 — after accepted submission (phone present): Adam's opener, two texts (2026-10-17). Its one job is a reply;
 *   the reply goes straight to Adam (app/api/sms/sendblue/route.ts), and he takes the conversation from there.
 * Message 2 — after report PDF delivered, only if they haven't texted us back yet.
 * Message 3 — optional later (stub only; not activated).
 *
 * Fail soft. Idempotent via report_sms_m1_sent_at / report_sms_m2_sent_at.
 * Already-requested path must not call these.
 */

import { getServerSupabase, isMissingColumnError } from "@/lib/supabase-server"
import { normalizePhone, sendSms, type SendResult } from "@/lib/notify"
import { ensureContactAndVerify, sendblueConfigured, sendTypingIndicator } from "@/lib/sendblue"
import { typingDelayMs } from "@/lib/sms/terraai/bubbles"
import { recentMessages } from "@/lib/sms/terraai/store"

export const REPORT_SMS = {
  /**
   * Adam's opener, from the texts that get him replies: who, why, the inbox, then one easy question about their
   * business in plain words. Two texts, each within Sendblue's first-message rules (no links, 300 characters).
   * "We went through your site" is true: the report reads it.
   */
  m1: (firstName: string, hasWebsite = true): [string, string] => [
    `Hey ${firstName}! This is Adam from Terramore, we're putting your Digital Footprint report together now. It'll be in your inbox in a few minutes, let me know if you don't see it.`,
    `${hasWebsite ? "We went through your site for it." : "Quick question while it builds."} Who are your typical customers?\n\nReply STOP to opt out`,
  ],
  m2: (firstName: string) => `It's in your inbox now, ${firstName}.`,
  /** Optional later — not wired. Timing TBD (e.g. +24h soft book CTA). */
  m3: (firstName: string) =>
    `Hi ${firstName}, Adam here. If you want to walk through your Digital Footprint report together, book a free call: https://www.terramore.io/book Reply STOP to opt out.`,
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

/** Message 1 after report accept: the opener, as two texts with a typing bubble between. No-op without phone. Never throws. */
export async function sendReportAcceptSms(input: {
  email: string
  name: string
  phone?: string | null
  website?: string | null
}): Promise<SendResult> {
  const phone = normalizePhone(input.phone)
  if (!phone) {
    return { ok: false, channel: "sms", skipped: true, error: "no phone on this form" }
  }
  if (await alreadySent(input.email, "report_sms_m1_sent_at")) {
    return { ok: false, channel: "sms", skipped: true, error: "m1 already sent" }
  }

  await prepareContact(phone, input.name)
  const [hello, question] = REPORT_SMS.m1(firstOf(input.name), Boolean(input.website?.trim()))
  const result = await sendSms(phone, hello)
  if (!result.ok) return result
  await markSmsSent(input.email, "report_sms_m1_sent_at")
  await sendTypingIndicator(phone, { state: "start", maxDurationMs: 10_000 }).catch(() => undefined)
  await new Promise((resolve) => setTimeout(resolve, typingDelayMs(question)))
  await sendSms(phone, question, { typing: false })
  return result
}

/** True once they've texted us back (then the "it's in your inbox" nudge would only talk over the conversation). */
async function hasReplied(phone: string): Promise<boolean> {
  return (await recentMessages(phone, 20).catch(() => [])).some((m) => m.direction === "inbound")
}

/** Message 2 after PDF delivery, unless they've already replied. No-op without phone. Never throws. */
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

  if (await hasReplied(phone)) {
    return { ok: false, channel: "sms", skipped: true, error: "they already replied" }
  }

  await prepareContact(phone, input.name)
  const result = await sendSms(phone, REPORT_SMS.m2(firstOf(input.name)))
  if (result.ok) await markSmsSent(input.email, "report_sms_m2_sent_at")
  return result
}
