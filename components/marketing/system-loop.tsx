import Image from "next/image"
import { ArrowDown, RotateCcw } from "lucide-react"
import { LOOP } from "@/lib/marketing-system"

/**
 * After launch: the monthly loop (Watch, Decide, Fix, Measure), beside one real example of a "Decide" output from
 * the TerraIQ Growth Workspace (fixture data, unedited; the same captures as the Next Move hero, VD-029).
 * md+: the four steps on a ring. Phones: a short list that ends by pointing back to the start.
 */

/** Ring positions in % of the square: top, right, bottom, left. */
const RING = [
  "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
  "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
  "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
  "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
] as const

export function SystemLoop() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      {/* md+: the ring. */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[22rem] md:block">
        <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
          <circle
            cx="100"
            cy="100"
            r="99"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 5"
            className="text-ink/25"
          />
          {/* Direction marks, clockwise, between the four steps. */}
          {[45, 135, 225, 315].map((deg) => (
            <g key={deg} transform={`rotate(${deg} 100 100)`}>
              <path
                d="M 96 4 L 101 1 L 96 -2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-ink/45"
              />
            </g>
          ))}
        </svg>
        <div className="absolute inset-[22%] flex flex-col items-center justify-center rounded-full bg-white text-center ring-1 ring-ink/10">
          <RotateCcw aria-hidden className="h-5 w-5 text-gold-to" />
          <p className="mt-2 text-[15px] font-semibold leading-snug text-ink">Every month</p>
          <p className="mt-0.5 px-4 text-[13px] leading-snug text-slate-600">one constraint, fixed and measured</p>
        </div>
        <ol>
          {LOOP.map((step, i) => (
            <li
              key={step.name}
              className={`absolute w-40 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-center ${RING[i]}`}
            >
              <p className="text-[15px] font-semibold text-ink">
                <span className="mr-1.5 tabular-nums text-ink/60">{i + 1}</span>
                {step.name}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-slate-600">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Phones: the list. */}
      <ol className="space-y-3 md:hidden">
        {LOOP.map((step, i) => (
          <li key={step.name} className="flex gap-3 rounded-2xl border border-ink/10 bg-white p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white">
              {i + 1}
            </span>
            <p className="text-[15px] leading-snug text-slate-700">
              <span className="block font-semibold text-ink">{step.name}</span>
              {step.detail}
            </p>
          </li>
        ))}
        <li className="flex items-center gap-2 pl-1 text-[14px] font-medium text-slate-600">
          <RotateCcw aria-hidden className="h-4 w-4 text-gold-to" />
          Then back to 1, next month.
        </li>
      </ol>

      {/* One real Decide output. */}
      <figure className="mx-auto w-full max-w-md">
        <figcaption className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/70">
          What “Decide” looks like
        </figcaption>
        <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <Image
            src="/marketing/next-move/gap-up-next-conversion.webp"
            alt="TerraIQ Growth Gap card with sample data: Up next, Conversion, needs attention. The homepage shows a phone number and a form, no booking link was found, and 32 qualified conversations became 6 customers."
            width={700}
            height={548}
            sizes="(max-width: 640px) 100vw, 448px"
            className="h-auto w-full"
          />
        </div>
        <ArrowDown aria-hidden className="mx-auto my-3 h-5 w-5 text-ink/40" />
        <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <Image
            src="/marketing/next-move/smallest-useful-next-step.webp"
            alt="TerraIQ recommendation, sample data: Smallest useful next step. Add one clear way to request a quote or book a time on your website."
            width={800}
            height={160}
            sizes="(max-width: 640px) 100vw, 448px"
            className="h-auto w-full"
          />
        </div>
        <p className="mt-3 text-[13px] text-slate-600">TerraIQ Growth Workspace · sample business data</p>
      </figure>
    </div>
  )
}
