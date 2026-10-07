import {
  CalendarCheck,
  ClipboardList,
  Hash,
  LayoutTemplate,
  MessageSquareText,
  Search,
  type LucideIcon,
} from "lucide-react"
import type { JourneyKind } from "@/lib/marketing-system"

/**
 * Small native mocks of the moments Terramore builds for a client: the search ad, the landing page, the estimate
 * form, the automatic text reply, the Slack alert and the booking that keeps its source. HTML, not screenshots, so
 * they stay sharp and readable. Sample business only ("Example Remodeling Co"); no people, ratings or results.
 */

export const JOURNEY_ICONS: Record<JourneyKind, LucideIcon> = {
  search: Search,
  page: LayoutTemplate,
  inquiry: ClipboardList,
  reply: MessageSquareText,
  alert: Hash,
  booked: CalendarCheck,
}

/** Source tag: the thread that ties every artifact back to the ad that started it. */
export function SourceTag({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "gold" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none ${
        tone === "gold" ? "bg-gold-from/20 text-ink" : "bg-ink/[0.05] text-ink/80"
      }`}
    >
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${tone === "gold" ? "bg-gold-to" : "bg-brand"}`} />
      {children}
    </span>
  )
}

export function SearchAdMock() {
  return (
    <div>
      <p className="text-[12px] text-slate-600">
        <span className="font-semibold text-ink">Sponsored</span> · examplereno.com
      </p>
      <p className="mt-1 text-[15px] font-semibold leading-snug text-ink">Kitchen remodels in Los Angeles</p>
      <p className="mt-0.5 text-[13px] leading-snug text-slate-600">Free in-home estimate. Book online.</p>
    </div>
  )
}

export function LandingPageMock() {
  return (
    <div className="rounded-xl border border-ink/10 bg-cream px-3 py-2.5">
      <p className="text-[13px] font-semibold leading-snug text-ink">Kitchen remodels, done right.</p>
      <div className="mt-2 flex gap-1.5">
        <span className="rounded-full bg-ink px-2.5 py-1 text-[12px] font-medium text-white">Book a free estimate</span>
        <span className="rounded-full border border-ink/20 px-2.5 py-1 text-[12px] font-medium text-ink">Call</span>
      </div>
    </div>
  )
}

export function InquiryMock() {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13px] leading-snug">
      <dt className="text-slate-600">Project</dt>
      <dd className="font-medium text-ink">Kitchen remodel</dd>
      <dt className="text-slate-600">Source</dt>
      <dd className="font-medium text-ink">Google Ads · Kitchen campaign</dd>
    </dl>
  )
}

export function TextReplyMock() {
  return (
    <div>
      <p className="max-w-[17rem] rounded-2xl rounded-bl-md bg-ink/[0.06] px-3 py-2 text-[13px] leading-snug text-ink">
        Thanks for reaching out! Want to pick a time for your free estimate?
      </p>
      <p className="mt-1.5 text-[12px] text-slate-600">Sent automatically</p>
    </div>
  )
}

export function TeamAlertMock() {
  return (
    <div className="border-l-2 border-ink/15 pl-3">
      <p className="text-[12px] font-semibold text-slate-600"># new-inquiries</p>
      <p className="mt-0.5 text-[13px] leading-snug text-ink">
        <span className="font-semibold">Estimate request:</span> kitchen remodel. Source: Google Ads. Text reply sent.
      </p>
    </div>
  )
}

export function BookedMock() {
  return (
    <div>
      <p className="text-[15px] font-semibold leading-snug text-ink">Free estimate · Thu 10:00 AM</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <SourceTag tone="gold">Google Ads › Kitchen campaign</SourceTag>
      </div>
    </div>
  )
}

export const JOURNEY_MOCKS: Record<JourneyKind, () => React.ReactElement> = {
  search: SearchAdMock,
  page: LandingPageMock,
  inquiry: InquiryMock,
  reply: TextReplyMock,
  alert: TeamAlertMock,
  booked: BookedMock,
}
