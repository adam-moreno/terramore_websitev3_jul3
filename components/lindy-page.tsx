import Link from "next/link"
import { BookingLink } from "@/components/booking-popup"
import { ReportPopupLink } from "@/components/report-popup"
import { SiteFooter } from "@/components/site-footer"

interface LindyPageProps {
  title: string
  accent?: string
  subtitle: string
  children: React.ReactNode
  ctaLabel?: string
}

export function LindyPage({
  title,
  accent,
  subtitle,
  children,
  ctaLabel = "Let's talk",
}: LindyPageProps) {
  return (
    <div className="min-h-screen bg-cream">
      <section className="pb-8 pt-8 md:pb-12 md:pt-12">
        <div className="page-shell text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-[2.35rem] font-bold leading-[1.1] tracking-[-0.04em] text-ink sm:text-5xl md:text-[3.4rem]">
            {title}{" "}
            {accent ? <span className="text-gold">{accent}</span> : null}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-ink/80 sm:text-lg">
            {subtitle}
          </p>
          <BookingLink
            label={ctaLabel}
            className="mt-8 inline-flex h-10 items-center rounded-full bg-brand px-4 text-[16px] font-medium text-white hover:bg-brand-hover"
          />
          <div className="mt-6">
            <ReportPopupLink />
          </div>
        </div>
        </div>
      </section>
      {children}
      <SiteFooter />
    </div>
  )
}

export function LindyCard({
  title,
  body,
  href,
}: {
  title: string
  body: string
  href?: string
}) {
  const inner = (
    <>
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </>
  )

  const className =
    "rounded-3xl border border-black/[0.06] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"

  if (href) {
    return (
      <Link href={href} className={`${className} block transition hover:-translate-y-0.5 hover:shadow-md`}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}
