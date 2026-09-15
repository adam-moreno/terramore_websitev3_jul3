import { createHmac, timingSafeEqual } from "crypto"
import { emailButton, emailP, emailShell, emailSignoff, esc } from "@/lib/email-template"
import { pickNurtureLinks } from "./map-links"
import type { LeadNurtureRow, NurtureEmail, NurtureStep } from "./types"

const SITE = "https://www.terramore.io"
const BOOK_URL = `${SITE}/book`

function firstName(name: string | null | undefined): string {
  const part = (name || "").trim().split(/\s+/)[0]
  return part || "there"
}

function nurtureSecret(): string | null {
  return (
    process.env.NURTURE_SECRET?.trim() ||
    process.env.BOOKING_API_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    null
  )
}

/** HMAC token for unsubscribe links. Empty string when no secret is configured. */
export function unsubscribeToken(email: string): string {
  const secret = nurtureSecret()
  if (!secret) return ""
  return createHmac("sha256", secret).update(email.trim().toLowerCase()).digest("hex")
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email)
  if (!expected || !token) return false
  try {
    const a = Buffer.from(expected)
    const b = Buffer.from(token)
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export function unsubscribeUrl(email: string): string {
  const token = unsubscribeToken(email)
  const params = new URLSearchParams({ email: email.trim().toLowerCase() })
  if (token) params.set("token", token)
  return `${SITE}/api/nurture/unsubscribe?${params.toString()}`
}

function typeLabel(row: LeadNurtureRow): string | null {
  const t = (row.business_type || "").trim()
  if (!t || /^not\s+shared$/i.test(t) || /^other$/i.test(t)) return null
  return t
}

function personalParagraph(row: LeadNurtureRow): string {
  const type = typeLabel(row)
  const job = (row.job || "").trim()
  const business = (row.business_name || "").trim()

  if (job && type) {
    return `You told us the loud job is "${job}", and that you run a ${type.toLowerCase()}${business ? ` (${business})` : ""}. That is the lens we use when we read the site and pick what to fix first.`
  }
  if (job) {
    return `You told us the loud job is "${job}"${business ? ` at ${business}` : ""}. That is the lens we use when we read the site and pick what to fix first.`
  }
  if (type) {
    return `For a ${type.toLowerCase()} like yours${business ? ` (${business})` : ""}, we start with the path a customer already takes: find you, ask a question, book or buy, and hear back. We name the step that leaks, then fix that step inside the tools you already pay for.`
  }
  if (business) {
    return `We treat ${business} the same way we treat every owner-led business: one clear job, the tools you already pay for, and a plan your team can run after we leave.`
  }
  return "We start with one clear job, the tools you already pay for, and a plan your team can run after we leave. No new dashboard for its own sake."
}

function aiLandings(row: LeadNurtureRow): string {
  const type = typeLabel(row)
  const job = (row.job || "").trim().toLowerCase()
  const t = (type || "").toLowerCase()

  if (/cart|checkout|finish/.test(job) || /online store/.test(t)) {
    return "For an online store like yours, that usually means cart recovery notes, a first-time buyer path, and a content calendar that matches what already sells, not a new tool stack."
  }
  if (/appointment|gaps|clinic|practice|service/.test(job + " " + t)) {
    return "For a service business or clinic like yours, that usually means missed-call text-back, appointment reminders, and follow-up after a visit so the book fills without you living in the inbox."
  }
  if (/unanswered|calls|messages/.test(job)) {
    return "When calls and messages go unanswered, AI earns its keep on the first reply, the hold on the calendar, and a short handoff note a person can approve before anything goes out."
  }
  if (/ads|wrong people/.test(job)) {
    return "When ads reach the wrong people, AI helps tighten the audience from real visits and intent, pause spend that only buys views, and send the next note based on what someone already looked at."
  }
  if (/find|online|discover/.test(job)) {
    return "When people cannot find you online, AI helps keep Maps, search pages, and listing details consistent, then routes the inquiry into a reply path your team already owns."
  }
  if (/launch|new/.test(job)) {
    return "When you want to launch something new, AI helps shape the offer page, the first outreach list, and a simple weekly review so the launch does not become another abandoned project."
  }
  return "In practice that lands on missed calls, slow follow-up, cart recovery, booking gaps, and a content calendar tuned to what already works for your kind of business."
}

function unsubFooter(email: string): { html: string; text: string } {
  const url = unsubscribeUrl(email)
  return {
    html: `<p style="margin:24px 0 0 0;font-size:12px;line-height:1.5;color:#6b7280;"><a href="${esc(url)}" style="color:#6b7280;text-decoration:underline;">Unsubscribe from these follow-up notes</a></p>`,
    text: `Unsubscribe: ${url}`,
  }
}

function buildStep1(row: LeadNurtureRow): NurtureEmail {
  const first = firstName(row.name)
  const personal = personalParagraph(row)
  const subject = "What to expect from Terramore"
  const paras = [
    `Hi ${first},`,
    "",
    "Terramore is a growth team for owners. We work inside the tools you already pay for: the store, the inbox, ads, the calendar, the CRM. We do not ask you to rip out what works just to install a new stack.",
    "",
    "What we do for the business is simple to say and careful to run. We find the step where you lose a sale, a booking, or a reply. We fix that step. We leave a 90-day plan your team can keep running after we step back.",
    "",
    personal,
    "",
    "In the next few notes I will share how we put AI into that path, and where it usually helps first. No hard sell. If a call would help sooner, pick a time.",
    "",
    `Book a time: ${BOOK_URL}`,
    "",
    "Adam Moreno",
    "Terramore",
  ]
  const unsub = unsubFooter(row.email)
  const html = emailShell({
    heading: "What to expect from us",
    previewText: "A growth team for owners, inside the tools you already pay for.",
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailP(
        "Terramore is a growth team for owners. We work inside the tools you already pay for: the store, the inbox, ads, the calendar, the CRM. We do not ask you to rip out what works just to install a new stack.",
      ),
      emailP(
        "What we do for the business is simple to say and careful to run. We find the step where you lose a sale, a booking, or a reply. We fix that step. We leave a 90-day plan your team can keep running after we step back.",
      ),
      emailP(personal),
      emailP(
        "In the next few notes I will share how we put AI into that path, and where it usually helps first. No hard sell. If a call would help sooner, pick a time.",
      ),
      emailButton("Book a time", BOOK_URL),
      emailSignoff("Adam Moreno", "Terramore"),
      unsub.html,
    ].join(""),
  })
  return { subject, text: [...paras, "", unsub.text].join("\n"), html }
}

function buildStep2(row: LeadNurtureRow): NurtureEmail {
  const first = firstName(row.name)
  const landings = aiLandings(row)
  const subject = "Where AI fits in the tools you already pay for"
  const paras = [
    `Hi ${first},`,
    "",
    "Most owners do not need another AI product. They need the work that already eats the week to move faster inside Shopify, the inbox, the phone, the calendar, and the ad account they already open.",
    "",
    "That is how we inject AI. We pick one workflow, wire it to the tools you already pay for, and keep a person in the loop on anything a customer will read or anything that changes a price.",
    "",
    landings,
    "",
    "How to maintain it after it is live: one owner on your side, a short weekly review, and human approval on outbound messages and price changes. You can turn a path off. We design for that.",
    "",
    `Want to walk a specific workflow? ${BOOK_URL}`,
    "",
    "Adam Moreno",
    "Terramore",
  ]
  const unsub = unsubFooter(row.email)
  const html = emailShell({
    heading: "AI inside the week you already run",
    previewText: "One workflow, your existing tools, a person still approves.",
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailP(
        "Most owners do not need another AI product. They need the work that already eats the week to move faster inside Shopify, the inbox, the phone, the calendar, and the ad account they already open.",
      ),
      emailP(
        "That is how we inject AI. We pick one workflow, wire it to the tools you already pay for, and keep a person in the loop on anything a customer will read or anything that changes a price.",
      ),
      emailP(landings),
      emailP(
        "How to maintain it after it is live: one owner on your side, a short weekly review, and human approval on outbound messages and price changes. You can turn a path off. We design for that.",
      ),
      emailButton("Book a time", BOOK_URL),
      emailSignoff("Adam Moreno", "Terramore"),
      unsub.html,
    ].join(""),
  })
  return { subject, text: [...paras, "", unsub.text].join("\n"), html }
}

function buildStep3(row: LeadNurtureRow): NurtureEmail {
  const first = firstName(row.name)
  const links = pickNurtureLinks(row.job, row.business_type)
  const subject = "Which job is loudest right now?"
  const linkLines = links.map((link) => `- ${link.label}: ${link.href}`)
  const paras = [
    `Hi ${first},`,
    "",
    "Quick check from me. Which job is loudest this week: finishing more carts, filling the appointment book, answering missed calls, getting found online, tightening ads, or launching something new?",
    "",
    "Here are three pages that match what you shared. Skim the one that feels closest.",
    "",
    ...linkLines,
    "",
    `If a short call would help, book here: ${BOOK_URL}`,
    "",
    "Adam Moreno",
    "Terramore",
  ]
  const unsub = unsubFooter(row.email)
  const html = emailShell({
    heading: "Which job is loudest?",
    previewText: "Three pages that match what you shared, plus an easy next step.",
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailP(
        "Quick check from me. Which job is loudest this week: finishing more carts, filling the appointment book, answering missed calls, getting found online, tightening ads, or launching something new?",
      ),
      emailP("Here are three pages that match what you shared. Skim the one that feels closest."),
      ...links.map((link) => emailButton(link.label, link.href)),
      emailP("If a short call would help:"),
      emailButton("Book a time", BOOK_URL),
      emailSignoff("Adam Moreno", "Terramore"),
      unsub.html,
    ].join(""),
  })
  return { subject, text: [...paras, "", unsub.text].join("\n"), html }
}

export function buildNurtureEmail(row: LeadNurtureRow, step: NurtureStep): NurtureEmail {
  if (step === 1) return buildStep1(row)
  if (step === 2) return buildStep2(row)
  return buildStep3(row)
}
