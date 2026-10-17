/**
 * What TerraAI knows about the owner texting in (2026-10-16): who they are, their report and top fixes, their
 * upcoming call, the links it may send, and the conversation so far. Server side; the rendering is pure for tests.
 */

import { bookingRefUrl } from "@/lib/booking/prefill-token"
import { manageUrl } from "@/lib/booking-api"
import { plainFinding, plainStep } from "@/lib/report/email-summary"
import { getServerSupabase } from "@/lib/supabase-server"
import { recentMessages, type StoredMessage } from "@/lib/sms/terraai/store"

export type TextContext = {
  firstText: boolean
  owner: { firstName: string | null; business: string | null; website: string | null }
  report: { status: string | null; score: number | null; fixes: Array<{ finding: string; step: string }>; email?: ReportEmail; requestedAt?: string | null } | null
  booking: { when: string; manageUrl: string } | null
  links: { freeCheck: string; book: string; workspace: string; contactCard: string }
  history: Array<Pick<StoredMessage, "direction" | "source" | "body" | "at">>
}

const SITE = "https://www.terramore.io"

/** What we know about their report email from Resend's events (public.email_events): the furthest it got. */
export type ReportEmail = "clicked" | "opened" | "delivered" | "bounced" | "unknown"

/** Pure: the furthest event for a recipient. A bounce wins only if nothing was delivered after it. */
export function reportEmailState(events: Array<{ event_type: string; occurred_at: string }>): ReportEmail {
  const sorted = [...events].sort((a, b) => Date.parse(a.occurred_at) - Date.parse(b.occurred_at))
  const has = (t: string) => sorted.some((e) => e.event_type.includes(t))
  if (has("click")) return "clicked"
  if (has("open")) return "opened"
  const last = sorted.filter((e) => /deliver|bounce/.test(e.event_type)).at(-1)
  if (last?.event_type.includes("bounce")) return "bounced"
  if (has("deliver")) return "delivered"
  return "unknown"
}

function when(startIso: string, tz: string): string {
  const d = new Date(startIso)
  const day = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long", month: "short", day: "numeric" }).format(d)
  const time = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(d)
  return `${day} at ${time}`
}

type LeadRow = { id: string; signup_date?: string | null; email: string | null; first_name: string | null; business_name: string | null; website: string | null; phone: string | null; report_status: string | null; report_json: { overallScore?: number; recommendations?: Array<{ id: string; rank: number; finding: string; action: string }> } | null }

/** Everything TerraAI may use for this number. Never throws. */
export async function buildTextContext(phone: string, now = Date.now()): Promise<TextContext> {
  const history = await recentMessages(phone, 20).catch(() => [])
  const ctx: TextContext = {
    firstText: !history.some((m) => m.direction === "outbound" && m.source === "terraai"),
    owner: { firstName: null, business: null, website: null },
    report: null,
    booking: null,
    links: { freeCheck: `${SITE}/report`, book: `${SITE}/book`, workspace: "https://dashboard.terramore.io/workspace", contactCard: `${SITE}/terramore.vcf` },
    history: history.map(({ direction, source, body, at }) => ({ direction, source, body, at })),
  }
  const supabase = getServerSupabase()
  if (!supabase) return ctx
  const web = supabase.schema("website")
  try {
    // The lead: by the number they texted from, or through a "Tap to text us" ref they used.
    const digits = phone.replace(/\D/g, "").slice(-10)
    const { data: refs } = await web.from("text_refs").select("kind, ref_id").eq("phone", phone).order("used_at", { ascending: false }).limit(5)
    const reportRef = (refs ?? []).find((r) => r.kind === "report")?.ref_id
    const bookingRef = (refs ?? []).find((r) => r.kind === "booking")?.ref_id
    let lead: LeadRow | null = null
    const cols = "id, email, first_name, business_name, website, phone, report_status, report_json, signup_date"
    if (reportRef) lead = ((await web.from("free_courses_signups").select(cols).eq("id", reportRef).maybeSingle()).data as LeadRow | null) ?? null
    if (!lead) {
      const { data } = await web.from("free_courses_signups").select(cols).ilike("phone", `%${digits.slice(-4)}%`).order("signup_date", { ascending: false }).limit(25)
      lead = ((data ?? []) as LeadRow[]).find((r) => String(r.phone ?? "").replace(/\D/g, "").endsWith(digits)) ?? null
    }
    if (lead) {
      ctx.owner = { firstName: lead.first_name && lead.first_name !== "-" ? lead.first_name : null, business: lead.business_name, website: lead.website }
      const recs = [...(lead.report_json?.recommendations ?? [])].sort((a, b) => a.rank - b.rank).slice(0, 3)
      ctx.report = {
        status: lead.report_status,
        score: typeof lead.report_json?.overallScore === "number" ? Math.round(lead.report_json.overallScore) : null,
        fixes: recs.map((r) => ({ finding: plainFinding(r), step: plainStep(r) })),
        requestedAt: lead.signup_date ?? null,
      }
      if (lead.email) {
        const { data: events } = await supabase.schema("public").from("email_events").select("event_type, occurred_at").ilike("recipient", lead.email).gte("occurred_at", lead.signup_date ?? new Date(now - 30 * 864e5).toISOString()).limit(50)
        ctx.report.email = reportEmailState((events ?? []) as Array<{ event_type: string; occurred_at: string }>)
      }
      if (lead.website) ctx.links.freeCheck = `${SITE}/report?site=${encodeURIComponent(lead.website.replace(/^https?:\/\//, "").replace(/\/$/, ""))}`
      if (lead.email) ctx.links.book = bookingRefUrl(lead.email, { source: "sms", medium: "sms" })
    }
    if (bookingRef) {
      const { data } = await web.from("booking_scheduled_emails").select("start_iso, visitor_tz, manage_token, status").eq("booking_id", bookingRef).not("start_iso", "is", null).limit(3)
      const row = (data ?? []).find((r) => r.manage_token && r.status !== "canceled") as { start_iso: string; visitor_tz: string | null; manage_token: string } | undefined
      if (row && Date.parse(row.start_iso) > now) ctx.booking = { when: when(row.start_iso, row.visitor_tz || "America/Los_Angeles"), manageUrl: manageUrl(row.manage_token) }
    }
  } catch (error) {
    console.error(`[terraai] context lookup failed: ${error instanceof Error ? error.message : String(error)}`)
  }
  return ctx
}

/** The context as the user turn of the draft request. Pure. */
export function renderContext(ctx: TextContext, latest: string): string {
  const lines: string[] = []
  lines.push(ctx.firstText ? "This is your first text to them (include the disclosure)." : "You've texted them before (no disclosure needed).")
  const o = ctx.owner
  lines.push(`Owner: ${o.firstName ?? "unknown name"}${o.business ? `, ${o.business}` : ""}${o.website ? `, website ${o.website}` : ""}`)
  if (ctx.report) {
    lines.push(`Report: ${ctx.report.status === "sent" ? "sent to their email" : ctx.report.status === "generating" ? "being written now" : ctx.report.status ?? "unknown"}${ctx.report.score !== null ? `, score ${ctx.report.score} out of 100` : ""}`)
    if (ctx.report.requestedAt) lines.push(`Report requested: ${Math.max(0, Math.round((Date.now() - Date.parse(ctx.report.requestedAt)) / 60000)) < 120 ? "in the last two hours" : "earlier"}`)
    if (ctx.report.email) lines.push(`Report email: ${{ clicked: "opened, and they clicked a link", opened: "opened", delivered: "delivered to their inbox (not opened yet)", bounced: "bounced; we don't have a working email", unknown: "no delivery confirmation yet" }[ctx.report.email]}`)
    ctx.report.fixes.forEach((f, i) => lines.push(`  Fix ${i + 1}: ${f.finding} Step: ${f.step}`))
  } else {
    lines.push("Report: none on file for this number.")
  }
  lines.push(ctx.booking ? `Upcoming call with Adam: ${ctx.booking.when}. Move or cancel link: ${ctx.booking.manageUrl}` : "Upcoming call: none on file.")
  lines.push(`Links you may send: free check ${ctx.links.freeCheck} | book a call ${ctx.links.book} | Growth Workspace ${ctx.links.workspace} | contact card ${ctx.links.contactCard}`)
  lines.push("")
  lines.push("Conversation so far (oldest first):")
  const hist = ctx.history.length ? ctx.history : []
  for (const m of hist) lines.push(`${m.direction === "inbound" ? "Owner" : m.source === "terraai" ? "TerraAI" : m.source === "adam" ? "Customer Success (a person)" : "Terramore (automatic)"}: ${m.body}`)
  if (!hist.length || hist[hist.length - 1].body !== latest) lines.push(`Owner: ${latest}`)
  lines.push("")
  lines.push("Write the next text to the owner.")
  return lines.join("\n")
}
