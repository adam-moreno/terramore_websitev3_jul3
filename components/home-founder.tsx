import Link from "next/link"
import { DualCtas } from "@/components/dual-ctas"

export function HomeFounder() {
  return (
    <section id="about" className="section-y md:py-24">
      <div className="page-shell grid items-start gap-8 md:grid-cols-[auto_1fr] md:gap-16">
        <div className="flex h-28 w-28 items-center justify-center rounded-[1.5rem] bg-ink text-[2rem] font-semibold tracking-tight text-cream">
          AM
        </div>
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink/40">Founder</p>
          <h2 className="section-title mt-3 text-ink md:text-[2.75rem] md:font-semibold md:leading-normal md:tracking-[-0.03em]">
            Adam Moreno
          </h2>
          <p className="section-lede mt-4 text-ink/75 md:mt-5 md:text-[1.05rem] md:leading-relaxed">
            A decade in corporate market research at Kantar and Samba TV, then solutions and sales engineering for
            Fortune 500 advertisers. Terramore is that same work, built for owners who already have a business.
          </p>
          <Link href="/about" className="mt-6 inline-block text-[15px] font-medium text-brand hover:text-brand-hover">
            Read the full story
          </Link>
          <DualCtas className="mt-5" />
        </div>
      </div>
    </section>
  )
}
