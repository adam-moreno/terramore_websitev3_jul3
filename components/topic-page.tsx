import Link from "next/link"
import { LindyCard, LindyPage } from "@/components/lindy-page"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/* A search landing page for one owner question ("help with my Google listing", "redo my website").
   Built on LindyPage so the hero, the free check, and the call look like every other info page.
   Copy rule: only what Terramore does today. No ratings, client counts, or guarantees. */

export type TopicSection = { title: string; body: string }
export type TopicFaq = { q: string; a: string }

export function TopicPage({
  title,
  accent,
  subtitle,
  intro,
  checks,
  steps,
  faqs,
  related,
}: {
  title: string
  accent?: string
  subtitle: string
  /** One or two short paragraphs under the hero: the owner's problem in plain words. */
  intro: string[]
  /** What the free check looks at for this topic. */
  checks: TopicSection[]
  /** How the work goes, in order. */
  steps: TopicSection[]
  faqs: TopicFaq[]
  related: { href: string; label: string }[]
}) {
  return (
    <LindyPage title={title} accent={accent} subtitle={subtitle}>
      <section className="pb-12">
        <div className="page-shell mx-auto max-w-2xl space-y-4 text-[17px] leading-relaxed text-ink/80">
          {intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="pb-12" aria-labelledby="topic-checks">
        <div className="page-shell">
          <h2 id="topic-checks" className="text-center text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            What the free check looks at
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {checks.map((item) => (
              <LindyCard key={item.title} title={item.title} body={item.body} />
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12" aria-labelledby="topic-steps">
        <div className="page-shell mx-auto max-w-2xl">
          <h2 id="topic-steps" className="text-center text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            How it works
          </h2>
          <ol className="mt-8 space-y-5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-[14px] font-semibold text-white"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-ink/75">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="pb-12" aria-labelledby="topic-faq">
        <div className="page-shell mx-auto max-w-2xl">
          <h2 id="topic-faq" className="text-center text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Questions owners ask
          </h2>
          <Accordion type="single" collapsible className="mt-6">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left text-[16px] font-medium text-ink">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-ink/75">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <nav aria-label="Related pages" className="pb-20">
        <ul className="page-shell flex flex-wrap justify-center gap-x-6 gap-y-3">
          {related.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-[15px] font-medium text-ink/70 underline-offset-4 hover:text-ink hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </LindyPage>
  )
}

/** Shared lines so every topic page says the same thing about price and the call. */
export const PRICE_FAQ: TopicFaq = {
  q: "What does it cost?",
  a: "The check is free, and so is the first call. If you want us to do the work, we agree the scope and price on the call before anything starts. Terramore software on its own starts at $29 a month.",
}

export const DIY_FAQ: TopicFaq = {
  q: "Can I do the fixes myself?",
  a: "Yes. The report lists your top fixes in plain words, so you can do them yourself. If you'd rather not, we can do them for you.",
}
