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
    <section className="bg-cream py-16 md:py-24">
      <div className="page-shell">
        <div className="mx-auto max-w-[560px] text-center">
          <h2 className="text-[1.85rem] font-bold tracking-[-0.04em] text-ink md:text-[2.5rem]">
            {title} <span className="text-gold">{accent}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/70">{subtitle}</p>
        </div>

        <div className="mt-7 grid lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(420px,49%)] lg:gap-12 xl:gap-16">
          <ol>
            {items.map((item, index) => {
              const Visual = item.visual
              return (
                <li
                  key={item.title}
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  className={`flex flex-col justify-center py-12 transition-opacity duration-300 lg:min-h-[70vh] lg:py-16 ${
                    active === index ? "opacity-100" : "opacity-35"
                  }`}
                >
                  <p className="text-[13px] font-medium text-gold-to">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 whitespace-nowrap text-[1.2rem] font-semibold tracking-tight text-ink sm:text-[1.35rem] md:text-[1.75rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[26rem] text-[15px] leading-relaxed text-ink/70">{item.copy}</p>
                  <div className="mt-6 max-w-md overflow-hidden rounded-[24px] border border-black/[0.06] bg-white lg:hidden">
                    <div className="relative aspect-[5/4]">{active === index ? <Visual /> : null}</div>
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
