import Image from "next/image"
import { ArrowDown, RotateCcw } from "lucide-react"

/**
 * /marketing "After launch": the Next Move story (VD-029), moved out of the hero and shown as a static
 * intelligence → action sequence for the same sample business as the hero journey (Example Remodeling Co, LA).
 *
 *   TerraIQ decides:  1 What Terramore knows → 2 What matters most → 3 Next move
 *   Terramore does:   4 Terramore executes   → 5 Result returns (and feeds step 1)
 *
 * Steps 2 and 3 are real TerraIQ Growth Workspace captures (fixture data, unedited; ASSET_MANIFEST, VD-029/030).
 * Steps 1, 4 and 5 are HTML restating that same fixture: source-labelled facts, the booking page Terramore built (the
 * one the hero journey books through), and what is measured next. Static: the hero is the page's one demonstration.
 * lg+: two labelled rows (three decide steps, two do steps). Below lg: one column in order.
 */

function Step({
  n,
  title,
  accent = false,
  children,
}: {
  n: number
  title: string
  accent?: boolean
  children: React.ReactNode
}) {
  return (
    <li
      className={`flex flex-col rounded-2xl border bg-white p-5 ${accent ? "border-gold-from ring-1 ring-gold-from" : "border-ink/10"}`}
    >
      <p className="flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/70">
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] tracking-normal ${accent ? "bg-gold-from text-ink" : "bg-ink text-white"}`}
        >
          {n}
        </span>
        {title}
      </p>
      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </li>
  )
}

function Fact({ source, children }: { source: string; children: React.ReactNode }) {
  return (
    <li className="border-t border-ink/[0.07] pt-2.5 first:border-t-0 first:pt-0">
      <p className="text-[15px] leading-snug text-ink">{children}</p>
      <p className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-600">{source}</p>
    </li>
  )
}

function RowLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-gold-ink">{children}</p>
}

export function NextMoveLoop() {
  return (
    <div>
      <RowLabel>TerraIQ decides</RowLabel>
      <ol className="mt-4 grid gap-4 lg:grid-cols-3">
        <Step n={1} title="What Terramore knows">
          <ul className="space-y-2.5">
            <Fact source="Public data">Homepage shows a phone number and a form. No way to book online.</Fact>
            <Fact source="Provided by you">47 inquiries, 32 qualified conversations, 6 customers a month.</Fact>
            <Fact source="Terramore analysis">
              The biggest drop is after the conversation: 26 of 32 don&apos;t become customers.
            </Fact>
          </ul>
        </Step>
        <Step n={2} title="What matters most">
          <div className="overflow-hidden rounded-xl border border-ink/10">
            <Image
              src="/marketing/next-move/gap-up-next-conversion-2x.webp"
              alt="TerraIQ Growth Gap, sample data: Up next, Conversion, needs attention. The homepage shows a phone number and a form, no booking link was found, and 32 qualified conversations became 6 customers."
              width={880}
              height={689}
              sizes="(max-width: 1024px) 100vw, 360px"
              className="h-auto w-full"
            />
          </div>
        </Step>
        <Step n={3} title="Next move" accent>
          <div className="overflow-hidden rounded-xl border border-ink/10">
            <Image
              src="/marketing/next-move/smallest-useful-next-step-2x.webp"
              alt="TerraIQ recommendation, sample data: Smallest useful next step. Add one clear way to request a quote or book a time on your website."
              width={960}
              height={192}
              sizes="(max-width: 1024px) 100vw, 360px"
              className="h-auto w-full"
            />
          </div>
          <p className="mt-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-ink">
            Why this move first
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-snug text-slate-700">
            <li>There&apos;s no way to book or request a quote online.</li>
            <li>Only 6 of 32 qualified conversations become customers.</li>
            <li>It&apos;s the smallest change on the biggest drop.</li>
          </ul>
        </Step>
      </ol>

      <div aria-hidden className="flex justify-center py-3 text-ink/40 lg:justify-end lg:pr-[16%]">
        <ArrowDown className="h-5 w-5" />
      </div>

      <RowLabel>Terramore does</RowLabel>
      <ol className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]" start={4}>
        <Step n={4} title="Terramore executes">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] sm:items-start">
            <div className="overflow-hidden rounded-xl border border-ink/10">
              <div className="flex h-7 items-center gap-1.5 border-b border-ink/10 px-3 text-[12px] text-slate-600">
                <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-ink/15" />
                <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-ink/15" />
                <span aria-hidden className="h-[7px] w-[7px] rounded-full bg-ink/15" />
                <span className="ml-1 truncate">examplereno.com/estimate</span>
              </div>
              <div className="px-4 pb-4 pt-4">
                <p className="text-[18px] font-bold leading-tight tracking-[-0.01em] text-ink">
                  Book a free in-home estimate.
                </p>
                <p className="mt-1.5 text-[13px] leading-snug text-slate-600">
                  Pick a time. We&apos;ll bring ideas and a rough budget.
                </p>
                <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-[12px]">
                  <span className="rounded-lg border border-ink/10 py-1.5 text-ink">Tue 2:30</span>
                  <span className="rounded-lg border border-ink/10 py-1.5 text-ink">Wed 9:00</span>
                  <span className="rounded-lg border-2 border-ink py-1.5 font-semibold text-ink">Thu 10:00</span>
                </div>
                <span className="mt-2.5 flex h-9 items-center justify-center rounded-lg bg-ink text-[13px] font-semibold text-white">
                  Book this time
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-ink/10 px-3 py-2 text-[12px]">
                <span className="text-slate-600">Landing page</span>
                <span className="font-semibold text-green-700">Live · Terramore</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-[15px] leading-snug text-slate-700">
              <li>
                <span className="font-semibold text-ink">Built:</span> the booking page, linked from the site and the
                ads.
              </li>
              <li>
                <span className="font-semibold text-ink">Connected:</span> bookings land on the calendar and in the CRM
                with their source.
              </li>
              <li>
                <span className="font-semibold text-ink">Followed up:</span> confirmation and reminder texts go out
                automatically.
              </li>
            </ul>
          </div>
        </Step>
        <Step n={5} title="Result returns">
          <p className="text-[15px] leading-snug text-slate-700">
            <span className="font-semibold text-green-700">Measuring:</span> booked estimates from the new page, against
            the step from conversation to customer.
          </p>
          <div className="mt-4 rounded-xl border border-ink/10 bg-cream p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-600">Next read</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] font-semibold text-ink">
              Follow-up
              <span className="rounded-full border border-gold-from bg-gold-from/15 px-2.5 py-0.5 text-[12px] font-medium text-ink">
                Needs attention
              </span>
            </p>
            <p className="mt-1 text-[14px] leading-snug text-slate-600">
              15 of 47 monthly inquiries don&apos;t become qualified conversations.
            </p>
          </div>
          <p className="mt-auto flex items-center gap-2 pt-4 text-[14px] font-medium text-ink">
            <RotateCcw aria-hidden className="h-4 w-4 text-gold-to" />
            Back to step 1, with one more thing known.
          </p>
        </Step>
      </ol>
      <p className="mt-6 text-[13px] text-slate-600">TerraIQ Growth Workspace · sample business data</p>
    </div>
  )
}
