/**
 * Outbound messages for the two lead forms. Every function here is best effort:
 * it logs and returns a result, it never throws, and a missing key is a logged no-op.
 *
 * Channels
 * - Slack (to Adam):   posts as the "Hearth" Slack app, in one of two modes (bot preferred, webhook fallback)
 *                      bot:     SLACK_BOT_TOKEN + SLACK_LEADS_CHANNEL   chat.postMessage, needs the chat:write scope
 *                      webhook: SLACK_WEBHOOK_URL                       Incoming Webhook URL (the scope Hearth has today)
 * - Email:             RESEND_API_KEY | SENDGRID_API_KEY | POSTMARK_SERVER_TOKEN   first one found wins
 *                      RESEND_FROM_EMAIL (the dashboard's name) then EMAIL_FROM   e.g. "Terramore <reports@terramore.io>"
 *                      NOTIFY_EMAIL_TO   admin copy, default adam.moreno@terramore.io
 *                      EMAIL_REPLY_TO    reply-to on every outbound email, default adam.moreno@terramore.io
 * - SMS (to the user): Sendblue preferred when SENDBLUE_API_KEY + SENDBLUE_API_SECRET +
 *                      SENDBLUE_FROM_NUMBER are set; else Twilio (TWILIO_ACCOUNT_SID,
 *                      TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER). Failures never throw.
 */

import { emailShell, emailButton, emailP, emailDetail, emailSignoff } from "./email-template"
import {
  ensureContact,
  sendTypingIndicator,
  sendblueConfigured,
  sendblueSendMessage,
} from "./sendblue"

export type Attachment = { filename: string; content: Buffer; contentType: string }

export type EmailInput = {
  to: string
  subject: string
  text: string
  html?: string
  bcc?: string
  /** Overrides EMAIL_REPLY_TO for one message. */
  replyTo?: string
  attachments?: Attachment[]
  /**
   * Schedule delivery (ISO 8601). Resend: `scheduled_at`. SendGrid: `send_at` unix.
   * Postmark has no schedule here — sends immediately and logs a warning.
   */
  scheduledAt?: string
}

export type SendResult = { ok: boolean; channel: string; skipped?: boolean; error?: string }

export const ADMIN_EMAIL = process.env.NOTIFY_EMAIL_TO?.trim() || "adam.moreno@terramore.io"
/** Same value the Terra IQ dashboard uses (RESEND_FROM_EMAIL) so one address is set once; EMAIL_FROM is the local name. */
export const FROM = process.env.RESEND_FROM_EMAIL?.trim() || process.env.EMAIL_FROM?.trim() || "Terramore <no-reply@terramore.io>"
/** Replies to a no-reply sender land with Adam. */
export const REPLY_TO = process.env.EMAIL_REPLY_TO?.trim() || "adam.moreno@terramore.io"
/** Slack member ID to @-mention on admin alerts so they push to Adam's phone even in mentions-only channels. Env can override; "" disables. */
const SLACK_MENTION = (process.env.SLACK_MENTION_USER_ID?.trim() || "U0BMKSTCBFD")
const SITE = "https://terramore.io"
const BOOK_URL = `${SITE}/book`

function skip(channel: string, why: string): SendResult {
  console.info(`[notify] ${channel} skipped: ${why}`)
  return { ok: false, channel, skipped: true, error: why }
}

function fail(channel: string, error: unknown): SendResult {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`[notify] ${channel} failed: ${message}`)
  return { ok: false, channel, error: message }
}

async function readError(response: Response): Promise<string> {
  const body = await response.text().catch(() => "")
  return `${response.status} ${body.slice(0, 300)}`
}

export function emailProvider(): "resend" | "sendgrid" | "postmark" | null {
  if (process.env.RESEND_API_KEY) return "resend"
  if (process.env.SENDGRID_API_KEY) return "sendgrid"
  if (process.env.POSTMARK_SERVER_TOKEN) return "postmark"
  return null
}

function twilioConfigured(): boolean {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER)
}

/** Prefer Sendblue when fully configured; otherwise Twilio. */
export function smsProvider(): "sendblue" | "twilio" | null {
  if (sendblueConfigured()) return "sendblue"
  if (twilioConfigured()) return "twilio"
  return null
}

export function smsConfigured(): boolean {
  return smsProvider() !== null
}

export type SlackMode = "bot" | "webhook" | "none"

/** Bot token wins when both the token and a channel are set; otherwise the webhook; otherwise nothing. */
export function slackMode(): SlackMode {
  if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_LEADS_CHANNEL) return "bot"
  if (process.env.SLACK_WEBHOOK_URL) return "webhook"
  return "none"
}

export function slackConfigured(): boolean {
  return slackMode() !== "none"
}

export function emailFromConfigured(): "RESEND_FROM_EMAIL" | "EMAIL_FROM" | null {
  if (process.env.RESEND_FROM_EMAIL?.trim()) return "RESEND_FROM_EMAIL"
  if (process.env.EMAIL_FROM?.trim()) return "EMAIL_FROM"
  return null
}

/* ------------------------------------------------------------------ email */

export async function sendEmail(input: EmailInput): Promise<SendResult> {
  const provider = emailProvider()
  if (!provider) return skip("email", "no RESEND_API_KEY, SENDGRID_API_KEY, or POSTMARK_SERVER_TOKEN")

  const replyTo = input.replyTo?.trim() || REPLY_TO

  try {
    let response: Response
    const scheduledAt = input.scheduledAt?.trim() || undefined
    if (scheduledAt && provider === "postmark") {
      console.warn(`[notify] email:postmark cannot schedule; sending immediately (wanted ${scheduledAt})`)
    }
    if (provider === "resend") {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [input.to],
          bcc: input.bcc ? [input.bcc] : undefined,
          reply_to: replyTo,
          subject: input.subject,
          text: input.text,
          html: input.html,
          scheduled_at: scheduledAt,
          attachments: input.attachments?.map((a) => ({
            filename: a.filename,
            content: a.content.toString("base64"),
            content_type: a.contentType,
          })),
        }),
      })
    } else if (provider === "sendgrid") {
      const fromMatch = FROM.match(/^(.*?)\s*<(.+)>$/)
      const from = fromMatch ? { name: fromMatch[1].trim(), email: fromMatch[2].trim() } : { email: FROM }
      const sendAt = scheduledAt ? Math.floor(new Date(scheduledAt).getTime() / 1000) : undefined
      response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          reply_to: { email: replyTo },
          personalizations: [{ to: [{ email: input.to }], bcc: input.bcc ? [{ email: input.bcc }] : undefined }],
          subject: input.subject,
          content: [
            { type: "text/plain", value: input.text },
            ...(input.html ? [{ type: "text/html", value: input.html }] : []),
          ],
          send_at: sendAt && Number.isFinite(sendAt) ? sendAt : undefined,
          attachments: input.attachments?.map((a) => ({
            filename: a.filename,
            content: a.content.toString("base64"),
            type: a.contentType,
            disposition: "attachment",
          })),
        }),
      })
    } else {
      response = await fetch("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: {
          "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN as string,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          From: FROM,
          To: input.to,
          Bcc: input.bcc,
          ReplyTo: replyTo,
          Subject: input.subject,
          TextBody: input.text,
          HtmlBody: input.html,
          MessageStream: "outbound",
          Attachments: input.attachments?.map((a) => ({
            Name: a.filename,
            Content: a.content.toString("base64"),
            ContentType: a.contentType,
          })),
        }),
      })
    }

    if (!response.ok) return fail(`email:${provider}`, await readError(response))
    return { ok: true, channel: `email:${provider}` }
  } catch (error) {
    return fail(`email:${provider}`, error)
  }
}

/* -------------------------------------------------------------------- sms */

/** Accepts "(555) 123-4567", "555.123.4567", "+44 20 ..." and returns E.164 or null. US numbers get +1. */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  const digits = trimmed.replace(/[^\d]/g, "")
  if (trimmed.startsWith("+")) return digits.length >= 8 ? `+${digits}` : null
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`
  return null
}

export type SendSmsOptions = {
  /**
   * Public CDN URL with a file extension (Sendblue media_url). Only pass a real asset —
   * do not invent thumbnails. Ignored on Twilio path today.
   */
  mediaUrl?: string
  /** Show iMessage typing briefly before send (Sendblue only). Default true; never blocks send. */
  typing?: boolean
}

export async function sendSms(
  to: string | null | undefined,
  body: string,
  opts: SendSmsOptions = {},
): Promise<SendResult> {
  const phone = normalizePhone(to)
  if (!phone) return skip("sms", "no usable phone number")

  const provider = smsProvider()
  if (!provider) {
    return skip(
      "sms",
      "SENDBLUE_API_KEY+SECRET+FROM_NUMBER or TWILIO_ACCOUNT_SID+AUTH_TOKEN+FROM_NUMBER missing",
    )
  }

  if (provider === "sendblue") {
    if (opts.typing !== false) {
      // Best-effort … bubble. Often fails on first contact (no route yet); ignore.
      await sendTypingIndicator(phone, { state: "start", maxDurationMs: 4000 }).catch(() => undefined)
    }
    const mediaUrl = opts.mediaUrl?.trim() || undefined
    const result = await sendblueSendMessage({
      to: phone,
      content: body,
      ...(mediaUrl ? { mediaUrl } : {}),
    })
    if (!result.ok) return fail("sms:sendblue", result.error || "send failed")
    return { ok: true, channel: "sms:sendblue" }
  }

  const sid = process.env.TWILIO_ACCOUNT_SID as string
  const token = process.env.TWILIO_AUTH_TOKEN as string
  const from = process.env.TWILIO_FROM_NUMBER as string

  try {
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: phone, From: from, Body: body }),
    })
    if (!response.ok) return fail("sms:twilio", await readError(response))
    return { ok: true, channel: "sms:twilio" }
  } catch (error) {
    return fail("sms:twilio", error)
  }
}

/* ------------------------------------------------------------------ slack */

export async function postSlack(text: string, blocks?: unknown[]): Promise<SendResult> {
  const mode = slackMode()
  if (mode === "none") {
    const partial = process.env.SLACK_BOT_TOKEN ? "SLACK_BOT_TOKEN set but SLACK_LEADS_CHANNEL missing; " : ""
    return skip("slack", `${partial}SLACK_BOT_TOKEN + SLACK_LEADS_CHANNEL or SLACK_WEBHOOK_URL missing`)
  }

  try {
    if (mode === "bot") {
      // chat.postMessage answers 200 even on failure; the truth is in the JSON `ok` / `error` fields.
      const response = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`, "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          channel: process.env.SLACK_LEADS_CHANNEL,
          text,
          blocks,
          unfurl_links: false,
          unfurl_media: false,
        }),
      })
      if (!response.ok) return fail("slack:bot", await readError(response))
      const json = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!json.ok) return fail("slack:bot", json.error || "unknown error")
      return { ok: true, channel: "slack:bot" }
    }

    const response = await fetch(process.env.SLACK_WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blocks ? { text, blocks } : { text }),
    })
    if (!response.ok) return fail("slack:webhook", await readError(response))
    return { ok: true, channel: "slack:webhook" }
  } catch (error) {
    return fail(`slack:${mode}`, error)
  }
}

/* ------------------------------------------------------- lead notifications */

export type LeadKind = "talk" | "report"

export type Lead = {
  kind: LeadKind
  name: string
  email: string
  phone?: string | null
  business?: string | null
  website?: string | null
  /** Job picked on the Talk form, or the three popup answers on the report form. */
  details?: Record<string, string | null | undefined>
  rowId?: string | null
  tableUrl?: string
}

const KIND_LABEL: Record<LeadKind, string> = {
  talk: "New Talk request",
  report: "New Digital Footprint report request",
}

function detailLines(lead: Lead): string[] {
  const lines = [
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : "",
    lead.business ? `Business: ${lead.business}` : "",
    lead.website ? `Site: ${lead.website}` : "",
  ]
  for (const [key, value] of Object.entries(lead.details || {})) {
    if (value) lines.push(`${key}: ${value}`)
  }
  return lines.filter(Boolean)
}

/** Tell Adam. Slack first, email copy second. Never throws. */
export async function notifyAdminOfLead(lead: Lead): Promise<SendResult[]> {
  const title = KIND_LABEL[lead.kind]
  const lines = detailLines(lead)
  const rowNote = lead.rowId ? `Supabase row ${lead.rowId}` : "Not saved to Supabase (keys missing)"
  const link = lead.tableUrl ? `<${lead.tableUrl}|Open the table in Supabase>` : rowNote

  const blocks = [
    { type: "header", text: { type: "plain_text", text: title } },
    { type: "section", text: { type: "mrkdwn", text: lines.map((line) => `• ${line}`).join("\n") } },
    { type: "context", elements: [{ type: "mrkdwn", text: `${rowNote}. ${link}` }] },
  ]

  const html = emailShell({
    heading: title,
    previewText: `${lead.name} <${lead.email}>`,
    bodyHtml: [
      ...lines.map((line) => {
        const [label, ...rest] = line.split(": ")
        return emailDetail(label, rest.join(": "))
      }),
      emailP(rowNote),
      lead.tableUrl ? emailButton("Open in Supabase", lead.tableUrl) : "",
    ].join(""),
  })

  // @-mention Adam so the alert pushes to his phone even in a mentions-only channel.
  let slackText = `${title}: ${lead.name} <${lead.email}>`
  if (SLACK_MENTION) {
    slackText = `<@${SLACK_MENTION}> ${slackText}`
    blocks.unshift({ type: "section", text: { type: "mrkdwn", text: `<@${SLACK_MENTION}>` } })
  }

  const results = await Promise.all([
    postSlack(slackText, blocks),
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `${title}: ${lead.name}`,
      text: [title, "", ...lines, "", rowNote, lead.tableUrl || ""].join("\n").trim(),
      html,
    }),
  ])
  return results
}

/** Tell the person who filled the form. Email always (when a provider exists), SMS only with a phone. Never throws. */
export async function confirmLeadToUser(lead: Lead): Promise<SendResult[]> {
  const first = lead.name.split(/\s+/)[0] || "there"
  const isReport = lead.kind === "report"

  const subject = isReport ? "We got it. Your Digital Footprint report is on the way." : "We got it. We read the site before we reply."
  const body = isReport
    ? [
        `Hi ${first},`,
        "",
        "We got it. Your Digital Footprint report usually lands in your inbox within a few minutes.",
        `While you wait, a sample shows the shape: ${SITE}/report/example`,
        `When you have it, you can talk through priorities here: ${BOOK_URL}`,
        "",
        "Adam Moreno",
        "Terramore",
      ]
    : [
        `Hi ${first},`,
        "",
        "We got it. We read the site before we reply, usually within one business day.",
        `Want to skip the wait? Pick a time: ${BOOK_URL}`,
        "",
        "Adam Moreno",
        "Terramore",
      ]

  const sms = isReport
    ? `Terramore: we got it, ${first}. Your report usually lands within a few minutes.`
    : `Terramore: we got it, ${first}. We read the site before we reply, usually within one business day.`

  const html = isReport
    ? emailShell({
        heading: "Your Digital Footprint report is on the way",
        previewText: "Usually in your inbox within a few minutes.",
        bodyHtml: [
          emailP(`Hi ${first},`),
          emailP("We got it. Your Digital Footprint report usually lands in your inbox within a few minutes."),
          emailP("While you wait, a sample shows the shape:"),
          emailButton("See a sample report", `${SITE}/report/example`),
          emailP("When you have it, you can talk through what we would prioritize:"),
          emailButton("Talk through my report", BOOK_URL),
          emailSignoff("Adam Moreno", "Terramore"),
        ].join(""),
      })
    : emailShell({
        heading: "We read the site before we reply",
        previewText: "Usually within one business day.",
        bodyHtml: [
          emailP(`Hi ${first},`),
          emailP("We got it. We read the site before we reply, usually within one business day."),
          emailP("Want to skip the wait? Pick a time:"),
          emailButton("Book a time", BOOK_URL),
          emailSignoff("Adam Moreno", "Terramore"),
        ].join(""),
      })

  return Promise.all([
    sendEmail({ to: lead.email, subject, text: body.join("\n"), html }),
    lead.phone ? sendSms(lead.phone, sms) : Promise.resolve(skip("sms", "no phone on this form")),
  ])
}

/* ------------------------------------------------------------ booking */

export type BookingNotice = {
  name: string
  email: string
  phone?: string | null
  business?: string | null
  website?: string | null
  note?: string | null
  startIso: string
  endIso: string
  /** Visitor's IANA zone, used for their copy. */
  tz: string
  meetUrl: string | null
  meetProvider: "google_meet" | "teams" | null
  manageUrl: string
}

const PT = "America/Los_Angeles"

function when(iso: string, tz: string): string {
  const day = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long", month: "long", day: "numeric" }).format(new Date(iso))
  const time = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(new Date(iso))
  return `${day} at ${time}`
}

/** Slack to Adam: who, business, time in PT, the Meet link (or the Teams fallback note). Never throws. */
export async function notifyAdminOfBooking(b: BookingNotice): Promise<SendResult> {
  const title = "New call booked"
  const link = b.meetUrl ? `<${b.meetUrl}|Google Meet>` : "No Meet link. Teams link is on the Outlook invite (connect Google Meet in Terra IQ)."
  const lines = [
    `When: ${when(b.startIso, PT)}`,
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    b.phone ? `Phone: ${b.phone}` : "",
    b.business ? `Business: ${b.business}` : "",
    b.website ? `Site: ${b.website}` : "",
    b.note ? `Note: ${b.note}` : "",
    `Their zone: ${b.tz}`,
    `Join: ${link}`,
  ].filter(Boolean)
  const blocks = [
    { type: "header", text: { type: "plain_text", text: title } },
    { type: "section", text: { type: "mrkdwn", text: lines.map((line) => `• ${line}`).join("\n") } },
    { type: "context", elements: [{ type: "mrkdwn", text: "Booked on terramore.io. The event is on the Outlook calendar and in Terra IQ under Leads." }] },
  ]
  // @-mention Adam so the alert pushes to his phone even in a mentions-only channel.
  let slackText = `${title}: ${b.name}${b.business ? ` (${b.business})` : ""}, ${when(b.startIso, PT)}`
  if (SLACK_MENTION) {
    slackText = `<@${SLACK_MENTION}> ${slackText}`
    blocks.unshift({ type: "section", text: { type: "mrkdwn", text: `<@${SLACK_MENTION}>` } })
  }
  return postSlack(slackText, blocks)
}

/** Confirmation to the lead: time in their zone, the join link, the manage link. SMS only with a phone. Never throws. */
export async function confirmBookingToUser(b: BookingNotice): Promise<SendResult[]> {
  const first = b.name.split(/\s+/)[0] || "there"
  const timeLine = when(b.startIso, b.tz)
  const joinLine = b.meetUrl ? `Join on Google Meet: ${b.meetUrl}` : "The calendar invite from adam.moreno@terramore.io has the join link."
  const followUp =
    "In a few minutes I will send another short note with what to expect on the call, how to join, and a light prep list."
  const text = [
    `Hi ${first},`,
    "",
    `You are booked. ${timeLine} (${b.tz}).`,
    joinLine,
    "",
    "A calendar invite is on its way from adam.moreno@terramore.io. Accept it and the reminder is set.",
    "",
    followUp,
    "",
    `Need to move or cancel? ${b.manageUrl}`,
    "",
    "Adam Moreno",
    "Terramore",
  ].join("\n")
  const sms = `Terramore: you are booked, ${first}. ${timeLine}.${b.meetUrl ? ` Join: ${b.meetUrl}` : ""}`

  const html = emailShell({
    heading: "You are booked",
    previewText: `${timeLine} (${b.tz}) · a short prep note is next`,
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailDetail("When", `${timeLine} (${b.tz})`),
      b.meetUrl
        ? emailButton("Join on Google Meet", b.meetUrl)
        : emailP("The calendar invite from adam.moreno@terramore.io has the join link."),
      emailP("A calendar invite is on its way from adam.moreno@terramore.io. Accept it and the reminder is set."),
      emailP(followUp),
      emailP("Need to move or cancel?"),
      emailButton("Reschedule or cancel", b.manageUrl),
      emailSignoff("Adam Moreno", "Terramore"),
    ].join(""),
  })

  // Free-plan allowlist: best-effort contact create so this phone can receive SMS after
  // they text the Sendblue line once. Never blocks confirm email / booking success.
  if (b.phone && sendblueConfigured()) {
    const parts = b.name.trim().split(/\s+/)
    void ensureContact({
      phone: b.phone,
      firstName: parts[0] || first,
      lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
      tags: ["booking", "terramore.io"],
      updateIfExists: true,
    }).catch(() => undefined)
  }

  return Promise.all([
    sendEmail({ to: b.email, subject: `Booked: your call with Adam, ${timeLine}`, text, html }),
    b.phone ? sendSms(b.phone, sms) : Promise.resolve(skip("sms", "no phone on this booking")),
  ])
}

const REPORT_URL = `${SITE}/report`
const PREP_DELAY_MS = 5 * 60 * 1000

/**
 * ~5 minutes after booking: what the call is, how to join, light prep.
 * Soft Digital Footprint CTA when we cannot confirm they already got a report.
 * Prefer Resend/SendGrid schedule so the HTTP response is never blocked on a sleep.
 */
export async function sendBookingPrepEmail(
  b: BookingNotice,
  opts: { hasReport: boolean | null } = { hasReport: null },
): Promise<SendResult> {
  const first = b.name.split(/\s+/)[0] || "there"
  const timeLine = when(b.startIso, b.tz)
  const joinLine = b.meetUrl
    ? `Join on Google Meet: ${b.meetUrl}`
    : "Open the calendar invite from adam.moreno@terramore.io for the join link."
  const hasReport = opts.hasReport === true
  const reportSoft = hasReport
    ? "If you already have your Digital Footprint report, skim it once before we talk — it gives us a shared starting point."
    : `If you have not run a free Digital Footprint report yet, it is a useful first step before the call: ${REPORT_URL}`

  const subject = "Before your call: what to expect"
  const text = [
    `Hi ${first},`,
    "",
    `Quick note ahead of ${timeLine} (${b.tz}).`,
    "",
    "What the call is: a short working conversation about your business — where growth is stuck, what you already pay for, and whether Terramore is a fit. No pitch deck. No hard sell.",
    "",
    "How to join:",
    joinLine,
    "Be somewhere quiet with a stable connection. Phone works if video is awkward.",
    "",
    "Light prep (optional):",
    "- One outcome you want from the next 90 days",
    "- The tools you already live in (store, inbox, ads, calendar, CRM)",
    "- Any link that shows how customers find you today",
    "",
    reportSoft,
    "",
    `Need to move or cancel? ${b.manageUrl}`,
    "",
    "Adam Moreno",
    "Terramore",
  ].join("\n")

  const html = emailShell({
    heading: "Before your call",
    previewText: `What to expect on ${timeLine}`,
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailP(`Quick note ahead of ${timeLine} (${b.tz}).`),
      emailP(
        "What the call is: a short working conversation about your business — where growth is stuck, what you already pay for, and whether Terramore is a fit. No pitch deck. No hard sell.",
      ),
      emailP("How to join:"),
      b.meetUrl ? emailButton("Join on Google Meet", b.meetUrl) : emailP(joinLine),
      emailP("Be somewhere quiet with a stable connection. Phone works if video is awkward."),
      emailP("Light prep (optional): one outcome for the next 90 days, the tools you already live in, and any link that shows how customers find you today."),
      emailP(reportSoft),
      !hasReport ? emailButton("Get a free Digital Footprint report", REPORT_URL) : "",
      emailP("Need to move or cancel?"),
      emailButton("Reschedule or cancel", b.manageUrl),
      emailSignoff("Adam Moreno", "Terramore"),
    ].join(""),
  })

  const scheduledAt = new Date(Date.now() + PREP_DELAY_MS).toISOString()
  return sendEmail({ to: b.email, subject, text, html, scheduledAt })
}
