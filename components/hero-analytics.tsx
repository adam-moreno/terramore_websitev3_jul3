"use client"

const VERTICAL_BARS = [
  { name: "E-com", height: "72%" },
  { name: "Fitness", height: "54%" },
  { name: "HVAC", height: "81%" },
  { name: "Legal", height: "46%" },
  { name: "Skin", height: "63%" },
  { name: "Apparel", height: "88%" },
  { name: "Build", height: "58%" },
]

const SPARK_POINTS = "0,38 18,32 36,34 54,22 72,26 90,14 108,18 126,8 144,12 162,4"

export function HeroAnalytics() {
  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
      {/* Taller than the clip so the bottom of the product UI is teased */}
      <div className="relative h-[420px] sm:h-[480px] md:h-[540px] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[620px] sm:h-[680px] md:h-[720px]">
          {/* Soft product glow */}
          <div className="pointer-events-none absolute left-1/2 top-16 h-[420px] w-[90%] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

          {/* Main product frame */}
          <div className="relative mx-auto h-[520px] sm:h-[580px] w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_80px_-24px_rgba(37,99,235,0.35)]">
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <div className="ml-3 flex-1 rounded-md bg-white px-3 py-1.5 text-[11px] text-slate-400 ring-1 ring-slate-200">
                app.terramore.io / growth-dashboard
              </div>
            </div>

            <div className="grid h-[calc(100%-46px)] grid-cols-12">
              <aside className="hidden sm:flex col-span-2 flex-col gap-1 border-r border-slate-100 bg-slate-50/80 p-3">
                {["Overview", "Traffic", "Campaigns", "Verticals", "Pipeline"].map((item, i) => (
                  <div
                    key={item}
                    className={`rounded-md px-2.5 py-2 text-xs font-medium ${
                      i === 0 ? "bg-blue-600 text-white" : "text-slate-500"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </aside>

              <div className="col-span-12 sm:col-span-10 p-3 sm:p-4">
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                      Live client snapshot
                    </p>
                    <p className="text-sm font-semibold text-slate-900">Growth across 10 verticals</p>
                  </div>
                  <p className="text-xs font-medium text-emerald-600">+38% pipeline this quarter</p>
                </div>

                <div className="relative h-[220px] sm:h-[260px] overflow-hidden rounded-xl bg-slate-900">
                  <video
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                    src="/hero/hero-bg-1-apparel-loop.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/60">Campaign preview</p>
                      <p className="text-sm font-semibold">Apparel · Paid + organic</p>
                    </div>
                    <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide">
                      Live
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  {[
                    { label: "Leads", value: "1,284", delta: "+12%" },
                    { label: "Close rate", value: "27%", delta: "+4.1%" },
                    { label: "ROAS", value: "4.8x", delta: "+0.6" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">{stat.label}</p>
                      <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                      <p className="text-[10px] font-medium text-emerald-600">{stat.delta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating analytics widgets */}
          <div className="absolute left-0 top-8 hidden w-[210px] animate-hero-float rounded-xl border border-slate-200 bg-white p-3 shadow-xl lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Traffic</p>
            <p className="mt-1 text-lg font-bold text-slate-900">84.2k</p>
            <svg viewBox="0 0 162 42" className="mt-2 h-10 w-full overflow-visible">
              <polyline
                points={SPARK_POINTS}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                strokeLinejoin="round"
                className="hero-sparkline"
              />
            </svg>
          </div>

          <div className="absolute right-0 top-16 hidden w-[220px] animate-hero-float-delayed rounded-xl border border-slate-200 bg-white p-3 shadow-xl lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Vertical mix</p>
            <div className="mt-3 flex h-20 items-end gap-1.5">
              {VERTICAL_BARS.map((bar) => (
                <div key={bar.name} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-16 w-full items-end rounded-sm bg-blue-50">
                    <div
                      className="hero-bar w-full rounded-sm bg-blue-600"
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className="text-[8px] font-medium text-slate-400">{bar.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-24 left-4 hidden w-[200px] animate-hero-float rounded-xl border border-slate-200 bg-white p-3 shadow-xl md:block">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Conversion</p>
              <span className="text-[10px] font-semibold text-emerald-600">▲ 6.4%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="hero-progress h-full w-[68%] rounded-full bg-blue-600" />
            </div>
            <p className="mt-2 text-sm font-bold text-slate-900">6.4% of sessions</p>
          </div>

          <div className="absolute bottom-16 right-6 hidden w-[190px] animate-hero-float-delayed rounded-xl border border-slate-200 bg-white p-3 shadow-xl md:block">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Pipeline</p>
            <p className="mt-1 text-lg font-bold text-slate-900">$248k</p>
            <p className="text-[11px] text-slate-500">Qualified opportunities this month</p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </div>
    </div>
  )
}
