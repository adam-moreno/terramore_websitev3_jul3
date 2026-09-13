"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"

export type StickyItem = {
  title: string
  copy: string
  visual: ComponentType
}

export function StickyShowcase({
  title,
  accent,
  subtitle,
  items,
}: {
  title: string
  accent: string
  subtitle: string
  items: StickyItem[]
}) {
  const [active, setActive] = useState(0)
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const syncActive = () => {
      const mid = window.innerHeight * 0.45
      let best = 0
      let bestDist = Infinity

      itemRefs.current.forEach((node, index) => {
        if (!node) return
        const rect = node.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const dist = Math.abs(center - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = index
        }
      })

      setActive((current) => (current === best ? current : best))
    }

    syncActive()
    window.addEventListener("scroll", syncActive, { passive: true })
    window.addEventListener("resize", syncActive)
    return () => {
      window.removeEventListener("scroll", syncActive)
      window.removeEventListener("resize", syncActive)
    }
  }, [])

  return (
    <section className="section-y bg-cream md:py-24">
      <div className="page-shell">
        <div className="mx-auto max-w-[560px] text-center">
          <h2 className="section-title text-ink md:text-[2.5rem] md:leading-normal md:tracking-[-0.04em]">
            {title} <span className="text-gold">{accent}</span>
          </h2>
          <p className="section-lede mx-auto mt-4 max-w-md text-ink/70 md:text-[15px] md:leading-relaxed">{subtitle}</p>
        </div>

        {/* Phones: each step is one full-width card (number, title, copy, visual) in a plain 16px stack, the way lindy.ai collapses its sticky showcase. From md up the list is unchanged. */}
        <div className="mt-12 grid md:mt-7 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,49%)] lg:gap-12 xl:gap-16">
          <ol className="stack-gap flex flex-col md:block">
            {items.map((item, index) => {
              const Visual = item.visual
              return (
                <li
                  key={item.title}
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  className={`card-radius card-pad flex flex-col justify-center border border-black/[0.06] bg-white transition-opacity duration-300 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:py-10 lg:min-h-[70vh] lg:py-16 ${
                    active === index ? "opacity-100" : "lg:opacity-35"
                  }`}
                >
                  <p className="text-[13px] font-medium text-gold-to">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 whitespace-nowrap text-[1.5rem] font-semibold leading-[1.15] tracking-tight text-ink md:text-[1.75rem] md:leading-normal">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[26rem] text-[16px] leading-[1.5] text-ink/70 md:text-[15px] md:leading-relaxed">{item.copy}</p>
                  {/* Below lg the visuals stack in flow. Under md each visual sets its own height, so nothing inside can overlap or clip. */}
                  <div className="mt-5 max-w-md overflow-hidden rounded-[16px] border border-black/[0.06] bg-white md:mt-6 md:rounded-[24px] lg:hidden">
                    <div className="relative md:aspect-square">
                      <Visual />
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>

          <div className="relative hidden lg:block">
            <div className="sticky top-24 flex h-[calc(100vh-8rem)] items-center">
              <div className="aspect-[5/4] max-h-[calc(100vh-10rem)] w-full overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.28)]">
                <div className="relative h-full">
                  {items.map((item, index) => {
                    const Visual = item.visual
                    return (
                      <div
                        key={item.title}
                        className={`absolute inset-0 bg-[#eef3fb] transition-opacity duration-500 ${
                          active === index ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                        }`}
                        aria-hidden={active !== index}
                      >
                        {active === index ? <Visual /> : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
