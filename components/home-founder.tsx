import Image from "next/image"
import Link from "next/link"
import { DualCtas } from "@/components/dual-ctas"

export function HomeFounder() {
  return (
    <section id="about" className="section-y md:py-24">
      <div className="page-shell grid items-start gap-8 md:grid-cols-[auto_1fr] md:gap-16">
        <Image
          src="/founder/adam-moreno-headshot.png"
          alt="Adam Moreno, founder of Terramore"
          width={864}
          height={1152}
          sizes="(min-width: 768px) 192px, 144px"
          className="h-44 w-36 rounded-[1.5rem] object-cover object-top shadow-[0_8px_30px_rgba(15,30,46,0.08)] md:h-56 md:w-48"
        />
        <div className="max-w-2xl">
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink/40">Founder</p>
          <h2 className="section-title mt-3 text-ink md:text-[2.75rem] md:font-semibold md:leading-normal md:tracking-[-0.03em]">
            Adam Moreno
          </h2>
          <p className="section-lede mt-4 text-ink/75 md:mt-5 md:text-[1.05rem] md:leading-relaxed">
            A decade measuring what ads actually do for large advertisers — TV and streaming analytics at Samba TV,
            brand reports across every social channel at Kantar — then solutions and sales engineering for Fortune 500
            teams. Terramore points that same craft at owners: what is working, what is leaking, and what to fix first.
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
