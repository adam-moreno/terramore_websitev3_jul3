import Image from "next/image"
import { Check, MapPin, Phone, Play } from "lucide-react"
import { SearchAdMock, SourceTag, TeamAlertMock, TextReplyMock } from "@/components/marketing/journey-artifacts"

/**
 * One visual per stage chapter on /marketing. All HTML, except the Measure chapter, which shows real TerraIQ Growth
 * Workspace captures (fixture data, unedited; see ASSET_MANIFEST, VD-029). Sample business only: no people, ratings,
 * reviews or results. Static: the page's one demonstration sequence is the hero (VR-50 budget).
 */

function Placement({
  channel,
  children,
  className = "",
}: {
  channel: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-ink/10 bg-white p-4 ${className}`}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/70">{channel}</p>
      <div className="mt-3">{children}</div>
      <div className="mt-3 border-t border-ink/[0.07] pt-3">
        <SourceTag>Tagged · Kitchen campaign</SourceTag>
      </div>
    </div>
  )
}

/** 01 Attract: one offer, shown natively where buyers look, every placement tagged at the door. */
export function AttractVisual() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <Placement channel="Google Search">
        <SearchAdMock />
      </Placement>
      <Placement channel="Google Maps" className="sm:translate-y-6">
        <p className="text-[15px] font-semibold text-ink">Example Remodeling Co</p>
        <p className="mt-0.5 flex items-center gap-1 text-[13px] text-slate-600">
          <MapPin aria-hidden className="h-3.5 w-3.5" /> Remodeler · Sacramento
        </p>
        <div className="mt-2.5 flex gap-1.5">
          {["Call", "Directions", "Website"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-ink/15 px-2.5 py-1 text-[12px] font-medium text-ink"
            >
              {label}
            </span>
          ))}
        </div>
      </Placement>
      <Placement channel="Instagram">
        <div className="flex aspect-[16/9] flex-col justify-end rounded-xl bg-ink p-4">
          <p className="text-[18px] font-bold leading-tight text-white">Your kitchen, finished by spring.</p>
          <span aria-hidden className="mt-2 h-1 w-10 rounded-full bg-gold-from" />
        </div>
        <p className="mt-2 text-[12px] text-slate-600">
          <span className="font-semibold text-ink">examplereno</span> · Sponsored
        </p>
      </Placement>
      <Placement channel="TikTok" className="sm:translate-y-6">
        <div className="flex aspect-[16/9] items-end justify-between gap-3 rounded-xl bg-cream p-4 ring-1 ring-inset ring-ink/10">
          <p className="text-[16px] font-bold leading-tight text-ink">3 decisions to make before a kitchen remodel</p>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white">
            <Play aria-hidden className="ml-0.5 h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-[12px] text-slate-600">Short video · 0:24</p>
      </Placement>
    </div>
  )
}

const CONVERT_NOTES = [
  { n: 1, title: "Matches the ad", body: "The page says what the search asked for, and nothing else." },
  { n: 2, title: "One clear next step", body: "Book a time from real open slots, not “we'll get back to you.”" },
  { n: 3, title: "Tracked calls", body: "Calls from the page are tied to the campaign that sent them." },
  { n: 4, title: "Source on every lead", body: "The form passes the ad, campaign and page into your CRM." },
] as const

function Pin({ n }: { n: number }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-from text-[12px] font-bold text-ink">
      {n}
    </span>
  )
}

/** 02 Convert: a phone landing page with its working parts called out. */
export function ConvertVisual() {
  return (
    <div className="grid items-center gap-8 sm:grid-cols-[minmax(0,17.25rem)_1fr] sm:gap-10">
      <div className="mx-auto w-full max-w-[15rem] rounded-[2.25rem] sm:ml-9 border-[6px] border-ink bg-white p-4 pt-6">
        <p className="text-[12px] font-semibold text-ink/70">Example Remodeling Co</p>
        <div className="relative mt-3">
          <span className="absolute -left-9 top-0">
            <Pin n={1} />
          </span>
          <p className="text-[19px] font-bold leading-tight text-ink">Kitchen remodels in Sacramento, done right.</p>
          <p className="mt-1.5 text-[13px] leading-snug text-slate-600">Free in-home estimate this week.</p>
        </div>
        <div className="relative mt-4">
          <span className="absolute -left-9 top-1.5">
            <Pin n={2} />
          </span>
          <span className="flex h-10 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white">
            Book a free estimate
          </span>
        </div>
        <div className="relative mt-2">
          <span className="absolute -left-9 top-1.5">
            <Pin n={3} />
          </span>
          <span className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-ink/20 text-[13px] font-semibold text-ink">
            <Phone aria-hidden className="h-3.5 w-3.5" /> Call (916) 555-0142
          </span>
        </div>
        <div className="relative mt-4 space-y-1.5 rounded-xl bg-cream p-3">
          <span className="absolute -left-9 top-3">
            <Pin n={4} />
          </span>
          {["Name", "ZIP code", "Project"].map((field) => (
            <span
              key={field}
              className="block rounded-lg border border-ink/10 bg-white px-2.5 py-1.5 text-[12px] text-slate-600"
            >
              {field}
            </span>
          ))}
        </div>
      </div>
      <ol className="space-y-5">
        {CONVERT_NOTES.map((note) => (
          <li key={note.n} className="flex gap-3">
            <Pin n={note.n} />
            <p className="text-[15px] leading-relaxed text-slate-700">
              <span className="block font-semibold text-ink">{note.title}</span>
              {note.body}
            </p>
          </li>
        ))}
      </ol>
    </div>
  )
}

const FOLLOW_UP = [
  {
    time: "7:41 PM",
    title: "Inquiry arrives",
    body: (
      <p className="text-[14px] leading-snug text-slate-700">
        Estimate request from the kitchen page, with its source.
      </p>
    ),
  },
  { time: "7:41 PM", title: "They hear back", body: <TextReplyMock /> },
  { time: "7:41 PM", title: "Your team knows", body: <TeamAlertMock /> },
  {
    time: "Before the visit",
    title: "Reminders go out",
    body: (
      <p className="text-[14px] leading-snug text-slate-700">
        Texts a day before and two hours before, with a link to reschedule.
      </p>
    ),
  },
] as const

/** 03 Follow up: the minutes after an inquiry, as a timeline. md+: across; phones: down. */
export function FollowUpVisual() {
  return (
    <ol className="relative grid gap-4 md:grid-cols-4 md:gap-4">
      <span
        aria-hidden
        className="absolute left-[11px] top-3 bottom-3 w-px bg-ink/15 md:left-0 md:right-0 md:top-[11px] md:bottom-auto md:h-px md:w-auto"
      />
      {FOLLOW_UP.map((item) => (
        <li key={item.title} className="relative pl-9 md:pl-0 md:pt-9">
          <span
            aria-hidden
            className="absolute left-0 top-0 flex h-[23px] w-[23px] items-center justify-center rounded-full bg-brand text-white"
          >
            <Check className="h-3.5 w-3.5" />
          </span>
          <p className="text-[13px] font-semibold tabular-nums text-slate-600">{item.time}</p>
          <p className="mt-0.5 text-[16px] font-semibold text-ink">{item.title}</p>
          <div className="mt-3 rounded-2xl border border-ink/10 bg-white p-4">{item.body}</div>
        </li>
      ))}
    </ol>
  )
}

const SOURCE_CHAIN = [
  "Google Ads › Kitchen campaign",
  "Kitchen landing page",
  "Estimate request",
  "Estimate booked",
  "Customer",
] as const

/** 04 Measure: the source chain beside a real TerraIQ Revenue Path capture. */
export function MeasureVisual() {
  return (
    <div className="grid items-start gap-4 sm:grid-cols-[1fr_minmax(0,22rem)]">
      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink/70">One customer&apos;s path</p>
        <ol className="mt-4 space-y-0">
          {SOURCE_CHAIN.map((step, i) => {
            const last = i === SOURCE_CHAIN.length - 1
            return (
              <li key={step} className="relative flex gap-3 pb-4 last:pb-0">
                {!last ? <span aria-hidden className="absolute bottom-0 left-[9px] top-5 w-px bg-ink/15" /> : null}
                <span
                  aria-hidden
                  className={`mt-0.5 h-[19px] w-[19px] shrink-0 rounded-full border-[3px] ${last ? "border-gold-from bg-white" : "border-white bg-brand ring-1 ring-brand/35"}`}
                />
                <span className={`text-[15px] leading-snug ${last ? "font-semibold text-ink" : "text-slate-700"}`}>
                  {step}
                </span>
              </li>
            )
          })}
        </ol>
        <div className="mt-5 border-t border-ink/[0.07] pt-4">
          <SourceTag tone="gold">Revenue credited to Google Ads</SourceTag>
        </div>
      </div>
      <figure className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <Image
          src="/marketing/next-move/revenue-path.webp"
          alt="TerraIQ Revenue Path with sample data: 47 inquiries, 32 qualified conversations and 6 customers, with the biggest drop marked between conversations and customers."
          width={500}
          height={587}
          sizes="(max-width: 640px) 100vw, 352px"
          className="h-auto w-full"
        />
        <figcaption className="border-t border-ink/[0.07] px-4 py-2.5 text-[12px] text-slate-600">
          TerraIQ Revenue Path · sample business data
        </figcaption>
      </figure>
    </div>
  )
}
