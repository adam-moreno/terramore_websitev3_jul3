/**
 * Pre-call reminder emails, scheduled at booking time via Resend `scheduled_at` /
 * SendGrid `send_at` (same path as the ~5 min prep email).
 *
 * Offsets before start: 24h, 10h, 2h, 30m, 2m.
 * Only schedule if send time is still > now + 2 minutes (skip past / imminent sends).
 */

import { emailButton, emailLinkedImage, emailP, emailShell, emailSignoff } from "@/lib/email-template"
import { type BookingNotice, type SendResult, sendEmail } from "@/lib/notify"

const SITE = "https://terramore.io"
const REPORT_URL = `${SITE}/report`
/** Do not schedule if the intended send time is at or before now + this buffer. */
const SCHEDULE_BUFFER_MS = 2 * 60 * 1000

export type ReminderKind = "24h" | "10h" | "2h" | "30m" | "2m"

export type ReminderSpec = {
  kind: ReminderKind
  offsetMs: number
  label: string
}

export const BOOKING_REMINDER_SPECS: ReminderSpec[] = [
  { kind: "24h", offsetMs: 24 * 60 * 60 * 1000, label: "24 hours before" },
  { kind: "10h", offsetMs: 10 * 60 * 60 * 1000, label: "10 hours before" },
  { kind: "2h", offsetMs: 2 * 60 * 60 * 1000, label: "2 hours before" },
  { kind: "30m", offsetMs: 30 * 60 * 1000, label: "30 minutes before" },
  { kind: "2m", offsetMs: 2 * 60 * 1000, label: "2 minutes before" },
]

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there"
}

function when(iso: string, tz: string): string {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date(iso))
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso))
  return `${day} at ${time}`
}

function joinLine(b: BookingNotice): string {
  return b.meetUrl
    ? `Join on Google Meet: ${b.meetUrl}`
    : "Open the calendar invite from adam.moreno@terramore.io for the join link."
}

function phoneFallback(b: BookingNotice): string {
  if (b.phone?.trim()) {
    return "If video is awkward, reply to this email or we will text you on the number you shared."
  }
  return "If you cannot get on video, reply to this email and we will find another way."
}

/** ISO send time, or null if that reminder should be skipped. */
export function reminderSendAt(
  startIso: string,
  offsetMs: number,
  nowMs: number = Date.now(),
): string | null {
  const startMs = new Date(startIso).getTime()
  if (!Number.isFinite(startMs)) return null
  const sendMs = startMs - offsetMs
  if (sendMs <= nowMs + SCHEDULE_BUFFER_MS) return null
  return new Date(sendMs).toISOString()
}

function loomUrl(): string | null {
  return process.env.BOOKING_PREP_LOOM_URL?.trim() || null
}

function loomThumbUrl(): string | null {
  return process.env.BOOKING_PREP_LOOM_THUMB_URL?.trim() || null
}

function softReportCta(hasReport: boolean | null): { text: string; buttonHtml: string } {
  if (hasReport === true) {
    return {
      text: "If you already have your Digital Footprint report, a quick skim before we talk helps.",
      buttonHtml: "",
    }
  }
  return {
    text: `If you have not run a free Digital Footprint report yet, it is a useful first step: ${REPORT_URL}`,
    buttonHtml: emailButton("Get a free Digital Footprint report", REPORT_URL),
  }
}

function manageQuiet(b: BookingNotice): { text: string; buttonHtml: string } {
  return {
    text: `Need to move or cancel? ${b.manageUrl}`,
    buttonHtml: `${emailP("Need to move or cancel?")}${emailButton("Reschedule or cancel", b.manageUrl)}`,
  }
}

type BuiltEmail = { subject: string; text: string; html: string }

function build24h(b: BookingNotice, hasReport: boolean | null): BuiltEmail {
  const first = firstName(b.name)
  const timeLine = when(b.startIso, b.tz)
  const report = softReportCta(hasReport)
  const manage = manageQuiet(b)
  const loom = loomUrl()
  const thumb = loomThumbUrl()

  const loomHtml = loom
    ? thumb
      ? emailLinkedImage(loom, thumb, "Watch a short prep video", 480) +
        emailP("Optional: a short prep video (opens Loom).")
      : emailButton("Watch a short prep video", loom)
    : ""

  const subject = "Tomorrow: your Terramore call"
  const textLines = [
    `Hi ${first},`,
    "",
    `Tomorrow: ${timeLine} (${b.tz}).`,
    "",
    "Light agenda: where growth is stuck, what you already pay for, and whether Terramore is a fit. No pitch deck.",
    "",
    "One question to think about: what would make the next 90 days a clear win?",
    "",
    joinLine(b),
  ]
  if (loom) {
    textLines.push("", `Optional short prep video: ${loom}`)
  }
  textLines.push("", report.text, "", manage.text, "", "Adam Moreno", "Terramore")
  const text = textLines.join("\n")

  const html = emailShell({
    heading: "Tomorrow: your call",
    previewText: `${timeLine} · light prep`,
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailP(`Tomorrow: ${timeLine} (${b.tz}).`),
      emailP(
        "Light agenda: where growth is stuck, what you already pay for, and whether Terramore is a fit. No pitch deck.",
      ),
      emailP("One question to think about: what would make the next 90 days a clear win?"),
      b.meetUrl ? emailButton("Join on Google Meet", b.meetUrl) : emailP(joinLine(b)),
      loomHtml,
      emailP(report.text),
      report.buttonHtml,
      manage.buttonHtml,
      emailSignoff("Adam Moreno", "Terramore"),
    ].join(""),
  })

  return { subject, text, html }
}

function build10h(b: BookingNotice, hasReport: boolean | null): BuiltEmail {
  const first = firstName(b.name)
  const timeLine = when(b.startIso, b.tz)
  const report = softReportCta(hasReport)
  const manage = manageQuiet(b)
  const siteHint = b.website?.trim()
    ? `Have ${b.website.trim()} open and one main goal for the next 90 days.`
    : "Have your site open and one main goal for the next 90 days."

  const subject = "Today: your call with Adam"
  const text = [
    `Hi ${first},`,
    "",
    `Today: ${timeLine} (${b.tz}).`,
    "",
    `One prep item: ${siteHint}`,
    "Find a quiet spot with a stable connection.",
    "",
    joinLine(b),
    "",
    report.text,
    "",
    manage.text,
    "",
    "Adam Moreno",
    "Terramore",
  ].join("\n")

  const html = emailShell({
    heading: "Today: your call",
    previewText: timeLine,
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailP(`Today: ${timeLine} (${b.tz}).`),
      emailP(`One prep item: ${siteHint}`),
      emailP("Find a quiet spot with a stable connection."),
      b.meetUrl ? emailButton("Join on Google Meet", b.meetUrl) : emailP(joinLine(b)),
      emailP(report.text),
      report.buttonHtml,
      manage.buttonHtml,
      emailSignoff("Adam Moreno", "Terramore"),
    ].join(""),
  })

  return { subject, text, html }
}

function build2h(b: BookingNotice): BuiltEmail {
  const first = firstName(b.name)
  const timeLine = when(b.startIso, b.tz)
  const manage = manageQuiet(b)

  const subject = "In 2 hours — join details"
  const text = [
    `Hi ${first},`,
    "",
    `In about 2 hours: ${timeLine} (${b.tz}).`,
    "",
    joinLine(b),
    phoneFallback(b),
    "We will text if we need to reach you another way.",
    "",
    "We will cover where growth is stuck and whether Terramore is a fit.",
    "",
    manage.text,
    "",
    "Adam Moreno",
    "Terramore",
  ].join("\n")

  const html = emailShell({
    heading: "In 2 hours",
    previewText: "Join details for your call",
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailP(`In about 2 hours: ${timeLine} (${b.tz}).`),
      b.meetUrl ? emailButton("Join on Google Meet", b.meetUrl) : emailP(joinLine(b)),
      emailP(phoneFallback(b)),
      emailP("We will text if we need to reach you another way."),
      emailP("We will cover where growth is stuck and whether Terramore is a fit."),
      manage.buttonHtml,
      emailSignoff("Adam Moreno", "Terramore"),
    ].join(""),
  })

  return { subject, text, html }
}

function build30m(b: BookingNotice): BuiltEmail {
  const first = firstName(b.name)
  const timeLine = when(b.startIso, b.tz)

  const subject = "Starting in 30 minutes"
  const text = [
    `Hi ${first},`,
    "",
    `Starting in 30 minutes — ${timeLine} (${b.tz}).`,
    joinLine(b),
    "Quick check that the event is on your calendar.",
    "",
    "Adam Moreno",
    "Terramore",
  ].join("\n")

  const html = emailShell({
    heading: "Starting in 30 minutes",
    previewText: "Join link below",
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailP(`Starting in 30 minutes — ${timeLine} (${b.tz}).`),
      b.meetUrl ? emailButton("Join now", b.meetUrl) : emailP(joinLine(b)),
      emailP("Quick check that the event is on your calendar."),
      emailSignoff("Adam Moreno", "Terramore"),
    ].join(""),
  })

  return { subject, text, html }
}

function build2m(b: BookingNotice): BuiltEmail {
  const first = firstName(b.name)

  const subject = "Starting now"
  const text = [
    `Hi ${first},`,
    "",
    "Your Terramore call is starting now.",
    joinLine(b),
    phoneFallback(b),
    "",
    "Adam Moreno",
    "Terramore",
  ].join("\n")

  const html = emailShell({
    heading: "Starting now",
    previewText: "Join your Terramore call",
    bodyHtml: [
      emailP(`Hi ${first},`),
      emailP("Your Terramore call is starting now."),
      b.meetUrl ? emailButton("Join now", b.meetUrl) : emailP(joinLine(b)),
      emailP(phoneFallback(b)),
      emailSignoff("Adam Moreno", "Terramore"),
    ].join(""),
  })

  return { subject, text, html }
}

export function buildBookingReminder(
  kind: ReminderKind,
  b: BookingNotice,
  opts: { hasReport: boolean | null } = { hasReport: null },
): BuiltEmail {
  if (kind === "24h") return build24h(b, opts.hasReport)
  if (kind === "10h") return build10h(b, opts.hasReport)
  if (kind === "2h") return build2h(b)
  if (kind === "30m") return build30m(b)
  return build2m(b)
}

export type ScheduleRemindersResult = {
  scheduled: ReminderKind[]
  skipped: ReminderKind[]
  results: SendResult[]
}

/**
 * Schedule every reminder whose send time is still > now + 2 minutes.
 * Provider limits (Resend ~30d, SendGrid often ~72h) may still reject far-future sends — those log as failures.
 */
export async function scheduleBookingReminders(
  b: BookingNotice,
  opts: { hasReport: boolean | null } = { hasReport: null },
  nowMs: number = Date.now(),
): Promise<ScheduleRemindersResult> {
  const scheduled: ReminderKind[] = []
  const skipped: ReminderKind[] = []
  const results: SendResult[] = []

  for (const spec of BOOKING_REMINDER_SPECS) {
    const scheduledAt = reminderSendAt(b.startIso, spec.offsetMs, nowMs)
    if (!scheduledAt) {
      skipped.push(spec.kind)
      console.info(`[booking-reminders] skip ${spec.kind}: send time not after now+2m (start ${b.startIso})`)
      continue
    }
    const built = buildBookingReminder(spec.kind, b, opts)
    const result = await sendEmail({
      to: b.email,
      subject: built.subject,
      text: built.text,
      html: built.html,
      scheduledAt,
    })
    results.push(result)
    if (result.ok) scheduled.push(spec.kind)
    else {
      skipped.push(spec.kind)
      console.warn(`[booking-reminders] ${spec.kind} schedule failed: ${result.error || "unknown"}`)
    }
  }

  return { scheduled, skipped, results }
}
