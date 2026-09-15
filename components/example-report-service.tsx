import type { ReactNode } from "react"
import Link from "next/link"

const FOOTPRINT = [
  { label: "Website", value: "ridgeviewhomeservices.com", note: "Clear services. Quote form is buried." },
  { label: "Google Business", value: "4.7 · 86 reviews", note: "Strong rating. Reply lag on new reviews." },
  { label: "Search", value: "Maps + local pack", note: "Shows for brand. Weak for ‘AC repair near me’." },
  { label: "Facebook", value: "Active", note: "Posts. No lead form tied to follow-up." },
  { label: "Phone / SMS", value: "Main line only", note: "Missed calls after 5 get no text." },
  { label: "CRM", value: "Shared inbox", note: "Quotes live in email threads." },
]

const AUDIENCE = [
  { label: "Who calls", value: "Homeowners 38–62" },
  { label: "Where", value: "North suburbs" },
  { label: "Top job", value: "AC repair / install" },
  { label: "Quote to book", value: "~28%" },
  { label: "Same-day book", value: "Low after 5pm" },
  { label: "Repeat / referral", value: "Strong when asked" },
]

const WINS = [
  {
    title: "Reviews do real work",
    body: "4.7 from 86 reviews. Buyers trust the listing before they call.",
  },
  {
    title: "Service pages are clear",
    body: "AC, furnace, and plumbing each have a page with a price range and a next step.",
  },
  {
    title: "Technicians show up on time",
    body: "Ops reputation is strong. Marketing is not capturing all of that trust online.",
  },
]

const OPENINGS = [
  {
    title: "Missed calls after 5 go cold",
    body: "No auto-text with a book link. The lead often calls the next company.",
  },
  {
    title: "Quote follow-up is manual",
    body: "Estimates sit in a shared inbox. No day-2 or day-5 chase.",
  },
  {
    title: "Local search is under-aimed",
    body: "Brand shows. High-intent repair terms do not.",
  },
  {
    title: "Reviews without reply",
    body: "New 5-stars sit unanswered for a week. Soft signal, easy fix.",
  },
]

function Slide({
  id,
  kicker,
  title,
  children,
}: {
  id?: string
  kicker: string
  title: string
  children: ReactNode
}) {
  return (
    <article
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-[1.75rem] bg-white shadow-[0_8px_30px_rgba(15,30,46,0.06)]"
    >
      <div className="flex items-center gap-2 border-b border-black/[0.05] px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <p className="ml-2 truncate text-[12px] text-slate-400">Terramore · Digital footprint report</p>
      </div>
      <div className="p-7 md:p-10">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/40">{kicker}</p>
        <h2 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.03em] text-ink md:text-[2rem]">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </article>
  )
}

export function ExampleReportService({ hideDisclosure = false }: { hideDisclosure?: boolean }) {
  return (
    <div>
      <section className="page-shell">
        {hideDisclosure ? null : (
          <p className="mb-6 text-[14px] text-ink/50">
            Fictional demo business for illustration. Not a real Terramore client.
          </p>
        )}

        <div className="overflow-hidden rounded-[1.75rem] bg-ink text-cream shadow-[0_8px_30px_rgba(15,30,46,0.12)]">
          <div className="p-8 md:p-12">
            <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-cream/45">
              Sample report · service business
            </p>
            <h1 className="mt-3 text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[3rem]">
              Ridgeview Home Services
            </h1>
            <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-cream/70">
              HVAC and plumbing. Website, Google presence, reviews, lead capture, and follow-up — what a homeowner
              sees before they call, and what we’d fix first.
            </p>
            <dl className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <dt className="text-[12px] uppercase tracking-[0.14em] text-cream/40">Trade</dt>
                <dd className="mt-1 text-[16px]">HVAC · plumbing</dd>
              </div>
              <div>
                <dt className="text-[12px] uppercase tracking-[0.14em] text-cream/40">Area</dt>
                <dd className="mt-1 text-[16px]">North suburbs</dd>
              </div>
              <div>
                <dt className="text-[12px] uppercase tracking-[0.14em] text-cream/40">Read date</dt>
                <dd className="mt-1 text-[16px]">September 2026</dd>
              </div>
              <div>
                <dt className="text-[12px] uppercase tracking-[0.14em] text-cream/40">Mix</dt>
                <dd className="mt-1 text-[16px]">Site · Maps · Reviews · Phone</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="page-shell mt-8 space-y-8">
        <Slide id="service-chapter-01" kicker="01 · Digital footprint" title="Where they already show up.">
          <div className="grid gap-4 md:grid-cols-2">
            {FOOTPRINT.map((item) => (
              <div key={item.label} className="rounded-2xl bg-cream px-5 py-4">
                <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">{item.label}</p>
                <p className="mt-1 text-[17px] font-semibold text-ink">{item.value}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>
        </Slide>

        <Slide id="service-chapter-02" kicker="02 · Current demand" title="Who already looks, and who already books.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCE.map((item) => (
              <div key={item.label} className="rounded-2xl border border-black/[0.05] px-5 py-4">
                <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">{item.label}</p>
                <p className="mt-2 text-[1.35rem] font-semibold tracking-tight text-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </Slide>

        <Slide id="service-chapter-03" kicker="03 · Current wins" title="What is already working.">
          <div className="grid gap-4 md:grid-cols-3">
            {WINS.map((item) => (
              <div key={item.title} className="rounded-2xl bg-cream px-5 py-5">
                <h3 className="text-[17px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Slide>

        <Slide id="service-chapter-04" kicker="04 · Current openings" title="Quick Revenue Opportunities">
          <div className="grid gap-4 md:grid-cols-2">
            {OPENINGS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/[0.05] px-5 py-5">
                <h3 className="text-[17px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Slide>

        <Slide kicker="05 · Next 90 days" title="Three moves, in order.">
          <ol className="space-y-4">
            <li className="rounded-2xl bg-cream px-5 py-5">
              <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">Week 1–3</p>
              <p className="mt-1 text-[17px] font-semibold text-ink">Catch missed calls after 5.</p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                Auto-text with a book link. Same-day holds for repair jobs.
              </p>
            </li>
            <li className="rounded-2xl bg-cream px-5 py-5">
              <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">Week 4–7</p>
              <p className="mt-1 text-[17px] font-semibold text-ink">Chase every open estimate.</p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                Day-2 and day-5 follow-up from one record — not a shared inbox thread.
              </p>
            </li>
            <li className="rounded-2xl bg-cream px-5 py-5">
              <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">Week 8–12</p>
              <p className="mt-1 text-[17px] font-semibold text-ink">Aim local search at high-intent jobs.</p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                Repair and install terms first. Reply to every new review within 48 hours.
              </p>
            </li>
          </ol>
        </Slide>
      </section>

      <section className="page-shell mt-12">
        <div className="max-w-2xl border-t border-black/[0.06] pt-10">
          <h2 className="text-[2rem] font-semibold tracking-[-0.02em] text-ink">Want this for your business?</h2>
          <p className="mt-3 text-[1.05rem] leading-relaxed text-ink/70">
            Give us the site and an email. In your inbox in minutes. Or talk and we map the work in a meeting.
          </p>
          <p className="mt-7">
            <Link
              href="/report"
              className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
            >
              Get my free Digital Footprint report
            </Link>
          </p>
          <p className="mt-5 text-[14px] text-slate-500">
            Prefer to talk first?{" "}
            <Link href="/book" className="font-medium text-brand hover:text-brand-hover">
              Book a call
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
