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
 * - SMS (to the user): TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 */

export type Attachment = { filename: string; content: Buffer; contentType: string }

export type EmailInput = {
  to: string
  subject: string
  text: string
  html?: string
  bcc?: string
  attachments?: Attachment[]
}

export type SendResult = { ok: boolean; channel: string; skipped?: boolean; error?: string }

export const ADMIN_EMAIL = process.env.NOTIFY_EMAIL_TO?.trim() || "adam.moreno@terramore.io"
/** Same value the Terra IQ dashboard uses (RESEND_FROM_EMAIL) so one address is set once; EMAIL_FROM is the local name. */
export const FROM = process.env.RESEND_FROM_EMAIL?.trim() || process.env.EMAIL_FROM?.trim() || "Terramore <no-reply@terramore.io>"
const SITE = "https://terramore.io"

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

export function smsConfigured(): boolean {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER)
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

  try {
    let response: Response
    if (provider === "resend") {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [input.to],
          bcc: input.bcc ? [input.bcc] : undefined,
          subject: input.subject,
          text: input.text,
          html: input.html,
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
      response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          personalizations: [{ to: [{ email: input.to }], bcc: input.bcc ? [{ email: input.bcc }] : undefined }],
          subject: input.subject,
          content: [
            { type: "text/plain", value: input.text },
            ...(input.html ? [{ type: "text/html", value: input.html }] : []),
          ],
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

export async function sendSms(to: string | null | undefined, body: string): Promise<SendResult> {
  const phone = normalizePhone(to)
  if (!phone) return skip("sms", "no usable phone number")
  if (!smsConfigured()) return skip("sms", "TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_FROM_NUMBER missing")

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
    if (!response.ok) return fail("sms", await readError(response))
    return { ok: true, channel: "sms" }
  } catch (error) {
    return fail("sms", error)
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

  const results = await Promise.all([
    postSlack(`${title}: ${lead.name} <${lead.email}>`, blocks),
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `${title}: ${lead.name}`,
      text: [title, "", ...lines, "", rowNote, lead.tableUrl || ""].join("\n").trim(),
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
        "We got it. The report lands in two to three business days.",
        `Until then, the sample shows the shape: ${SITE}/report/example`,
        "",
        "Adam Moreno",
        "Terramore",
      ]
    : [
        `Hi ${first},`,
        "",
        "We got it. We read the site before we reply, usually within one business day.",
        `Want to skip the wait? Pick a time: https://calendly.com/terramore/30min`,
        "",
        "Adam Moreno",
        "Terramore",
      ]

  const sms = isReport
    ? `Terramore: we got it, ${first}. The report lands in two to three business days.`
    : `Terramore: we got it, ${first}. We read the site before we reply, usually within one business day.`

  return Promise.all([
    sendEmail({ to: lead.email, subject, text: body.join("\n") }),
    lead.phone ? sendSms(lead.phone, sms) : Promise.resolve(skip("sms", "no phone on this form")),
  ])
}
