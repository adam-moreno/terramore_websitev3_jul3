import { LEAKS } from "@/lib/marketing-system"

/**
 * The problem, drawn: the same path as the hero, but as separate tools with broken handoffs. Static on purpose
 * (no motion): it is the "before" to the hero's moving "after". Gold markers mean attention, never error (VR-03).
 * lg+: one row of five tools with the four leaks under their gaps. Below lg: a column, each leak inside its gap.
 */

const TOOLS: readonly { name: string; owner: string }[] = [
  { name: "Ads", owner: "Run by an agency" },
  { name: "Website", owner: "Built by a designer" },
  { name: "Inbox and phone", owner: "Checked when someone can" },
  { name: "CRM", owner: "Updated by hand, sometimes" },
  { name: "Reports", owner: "A monthly PDF of clicks" },
]

function Tool({ name, owner }: { name: string; owner: string }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white px-4 py-3.5">
      <p className="text-[15px] font-semibold text-ink">{name}</p>
      <p className="mt-0.5 text-[13px] leading-snug text-slate-600">{owner}</p>
    </div>
  )
}

function LeakMarker({ n }: { n: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-from text-[13px] font-bold text-ink">
      {n}
    </span>
  )
}

export function SystemLeaks() {
  return (
    <div>
      {/* lg+: the broken row. */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-[1fr_3rem_1fr_3rem_1fr_3rem_1fr_3rem_1fr] items-center">
          {TOOLS.map((tool, i) => (
            <div key={tool.name} className="contents">
              <Tool {...tool} />
              {i < TOOLS.length - 1 ? (
                <div aria-hidden className="relative flex h-full items-center justify-center">
                  <span className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between">
                    <span className="h-px w-3 bg-ink/25" />
                    <span className="h-px w-3 bg-ink/25" />
                  </span>
                  <LeakMarker n={i + 1} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <ol className="mt-8 grid grid-cols-4 gap-6 border-t border-ink/10 pt-6">
          {LEAKS.map((leak, i) => (
            <li key={leak.between} className="flex gap-3">
              <LeakMarker n={i + 1} />
              <p className="text-[15px] leading-relaxed text-slate-700">
                <span className="block text-[13px] font-semibold uppercase tracking-[0.12em] text-ink/70">
                  {leak.between}
                </span>
                {leak.leak}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Below lg: a column with each leak in its gap. */}
      <ol className="lg:hidden">
        {TOOLS.map((tool, i) => (
          <li key={tool.name}>
            <Tool {...tool} />
            {i < LEAKS.length ? (
              <div className="flex gap-3 py-3 pl-5">
                <span aria-hidden className="flex flex-col items-center">
                  <span className="h-2 w-px bg-ink/25" />
                  <span className="my-1">
                    <LeakMarker n={i + 1} />
                  </span>
                  <span className="h-2 w-px flex-1 bg-ink/25" />
                </span>
                <p className="py-1 text-[15px] leading-relaxed text-slate-700">
                  <span className="sr-only">
                    Leak {i + 1}, {LEAKS[i].between}:{" "}
                  </span>
                  {LEAKS[i].leak}
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
