import { ArrowRight, RotateCcw } from "lucide-react"
import { STAGES } from "@/lib/marketing-system"

/**
 * The connected system, as one operating stack: four stages, what Terramore builds in each, what we watch, and the
 * loop back from Measure to Attract. Lives on the page's one ink band (VR-39: it is the "after" to the leaks above,
 * and the dark field makes the connections read as infrastructure). Static; each stage links to its chapter below.
 * lg+: four columns joined by arrows, the loop drawn underneath. Tablets: two by two. Phones: one column, parts
 * on one line; the loop is the last row below lg.
 */
export function SystemMap() {
  return (
    <div>
      <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {STAGES.map((stage, i) => (
          <li key={stage.id} className="relative lg:px-2 lg:first:pl-0 lg:last:pr-0">
            <a
              href={`#${stage.id}`}
              className="group flex h-full flex-col rounded-2xl border border-white/15 bg-white/[0.04] p-5 transition-colors hover:border-white/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-from focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <span className="text-[13px] font-semibold tabular-nums tracking-[0.12em] text-gold-from">
                {stage.index}
              </span>
              <span className="mt-2 text-[22px] font-bold tracking-[-0.01em] text-white">{stage.name}</span>
              <span className="mt-1 text-[15px] leading-snug text-white/80">{stage.job}</span>
              <ul className="mt-5 hidden space-y-2 border-t border-white/10 pt-4 md:block">
                {stage.parts.map((part) => (
                  <li key={part} className="flex items-start gap-2 text-[14px] leading-snug text-white/85">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/50" />
                    {part}
                  </li>
                ))}
              </ul>
              <span className="mt-3 text-[14px] leading-snug text-white/75 md:hidden">{stage.parts.join(" · ")}</span>
              <span className="mt-auto pt-5 text-[13px] leading-snug text-white/70">
                We watch: <span className="font-semibold text-white">{stage.watch}</span>
              </span>
            </a>
            {i < STAGES.length - 1 ? (
              <span
                aria-hidden
                className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink text-white lg:flex"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      {/* The loop: what Measure learns goes back into Attract. */}
      <div className="mt-3 lg:mt-0">
        <svg aria-hidden viewBox="0 0 1000 56" preserveAspectRatio="none" className="hidden h-14 w-full lg:block">
          <path
            d="M 875 0 V 28 Q 875 44 859 44 H 141 Q 125 44 125 28 V 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="5 6"
            vectorEffect="non-scaling-stroke"
            className="text-gold-from/70"
          />
          <path
            d="M 119 12 L 125 3 L 131 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
            className="text-gold-from/70"
          />
        </svg>
        <p className="flex items-start gap-2.5 rounded-2xl border border-dashed border-gold-from/50 px-5 py-4 text-[15px] leading-snug text-white/85 lg:mx-auto lg:-mt-3 lg:max-w-xl lg:justify-center lg:border-0 lg:px-0 lg:py-0 lg:text-center">
          <RotateCcw aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold-from lg:hidden" />
          <span>
            What we measure goes back into the system: budget moves, pages get fixed, follow-up gets rewritten.
          </span>
        </p>
      </div>
    </div>
  )
}
