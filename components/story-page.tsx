import type { ReactNode } from "react"
import type { StaticImageData } from "next/image"
import Image from "next/image"
import Link from "next/link"
import { Source_Serif_4 } from "next/font/google"
import { DualCtas } from "@/components/dual-ctas"

const serif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
})

export type StoryBlock = {
  title: string
  body: string
}

export type StoryLinkTile = {
  href: string
  title: string
  deck: string
  icon?: string
}

export function StoryHero({
  title,
  lede,
  follow,
  image,
  imageAlt,
  parent,
}: {
  title: string
  lede: string
  follow?: string
  image?: StaticImageData
  imageAlt: string
  parent?: { href: string; label: string }
}) {
  return (
    <section className="pb-4 pt-6 md:pt-10">
      <div className="page-shell">
        {parent ? (
          <p className="mb-4 text-[13px] font-medium text-ink/50">
            Part of{" "}
            <Link href={parent.href} className="text-brand hover:text-brand-hover">
              {parent.label}
            </Link>
          </p>
        ) : null}
        <h1
          className={`${serif.className} max-w-4xl text-[2.85rem] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-6xl md:text-[4.75rem]`}
        >
          {title}
        </h1>
        <p className="mt-6 max-w-3xl text-[1.125rem] leading-[1.7] text-ink/80 md:mt-8 md:text-[1.25rem]">
          {lede}
        </p>
        {image ? (
          <div className="relative mt-10 overflow-hidden rounded-[1.75rem] md:mt-14">
            <Image
              src={image}
              alt={imageAlt}
              className="aspect-[16/7] w-full object-cover"
              sizes="(min-width: 1184px) 1184px, 100vw"
              priority
            />
          </div>
        ) : null}
        {follow ? (
          <p className="mt-10 max-w-4xl text-[1.05rem] leading-[1.75] text-ink/75 md:text-[1.125rem]">{follow}</p>
        ) : null}
      </div>
    </section>
  )
}

export function StorySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-16 md:py-20">
      <div className="page-shell">
        <h2
          className={`${serif.className} max-w-4xl text-[2rem] font-semibold leading-[1.15] tracking-[-0.02em] text-ink md:text-[2.75rem]`}
        >
          {title}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  )
}

export function StoryLinkTiles({ items }: { items: StoryLinkTile[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col rounded-[1.5rem] bg-white p-7 shadow-[0_8px_30px_rgba(15,30,46,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_36px_rgba(15,30,46,0.08)] md:p-8"
        >
          <div className="flex items-center gap-3">
            {item.icon ? (
              <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${item.icon}.svg`} alt="" className="h-6 w-6 object-contain" />
            ) : null}
            <h3 className="text-[1.35rem] font-semibold tracking-tight text-ink">{item.title}</h3>
          </div>
          <p className="mt-3 flex-1 text-[15px] leading-relaxed text-slate-600">{item.deck}</p>
          <span className="mt-6 text-[14px] font-medium text-brand">
            Learn more <span aria-hidden="true">→</span>
          </span>
        </Link>
      ))}
    </div>
  )
}

export function StoryTiles({ items }: { items: StoryBlock[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-[1.5rem] bg-white p-7 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-8">
          <h3 className="text-[1.25rem] font-semibold tracking-tight text-ink">{item.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-600">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

export function StoryCta() {
  return (
    <section className="pb-24">
      <div className="page-shell">
        <div className="max-w-2xl border-t border-black/[0.06] pt-12">
          <h2 className={`${serif.className} text-[2rem] font-semibold tracking-[-0.02em] text-ink md:text-[2.4rem]`}>
            Tell us where the business is stuck.
          </h2>
          <p className="mt-4 max-w-xl text-[1.05rem] leading-relaxed text-ink/70">
            We map the work, the tools, and whether Terramore is the right partner. Or ask for a report in your inbox.
          </p>
          <DualCtas className="mt-7" />
        </div>
      </div>
    </section>
  )
}
