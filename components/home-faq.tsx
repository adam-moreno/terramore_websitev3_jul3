import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DualCtas } from "@/components/dual-ctas"
import { DASHBOARD_LOGIN_URL } from "@/lib/dashboard"

const FAQS = [
  {
    q: "How do we start?",
    a: "Two ways. Book a free 30-minute call and tell us where the business is stuck. Or ask for the free Digital Footprint report: leave a name, an email, and your site, and we send a written read of your business in two to three business days.",
  },
  {
    q: "What is the Digital Footprint report?",
    a: "A short file about your business, written by a person. Where you already show up online, who already looks and buys, what is already working, and where you are losing sales. It takes two to three business days and there is a full sample on this site.",
  },
  {
    q: "Do you run advertising?",
    a: "Yes. Google Ads, Meta, TikTok, and Pinterest, always pointed at a page that can finish the sale. We work in the ad accounts you already have.",
  },
  {
    q: "Do I have to switch tools?",
    a: "No. We work inside Google, Meta, Shopify, HubSpot, Mailchimp, Stripe, and Calendly. If a piece is missing, we add the smallest tool that does the job. You do not start over.",
  },
  {
    q: "How is my data handled?",
    a: "To CCPA and HIPAA standards. Your lists and ads stay in your accounts. We do not sell personal information and we do not train public models on your files.",
  },
  {
    q: "Can I use the dashboard?",
    a: "The client dashboard, Terra IQ, is for current clients. We send an invite after work starts. New here? Talk first, or ask for the free report.",
  },
  {
    q: "What does the work cost?",
    a: "The first call is free. If we go ahead, a deposit starts the first 90 days and covers finding the broken step, fixing it, and writing the plan. After that, a monthly fee keeps us working in your tools. Both numbers depend on how many channels we run, and we quote them on the call. You never pay to find out what is broken.",
  },
]

export function HomeFaq() {
  return (
    <section id="faq" className="section-y scroll-mt-28 md:py-24">
      <div className="page-shell">
        <h2 className="section-title max-w-3xl text-ink md:text-[3rem] md:font-semibold md:leading-normal md:tracking-[-0.03em]">
          Questions owners ask first.
        </h2>
        <Accordion type="single" collapsible className="stack-gap mt-12 grid md:mt-10 md:block md:space-y-3">
          {FAQS.map((item, index) => (
            <AccordionItem
              key={item.q}
              value={`faq-${index}`}
              className="card-radius border-none bg-white px-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:rounded-[1.25rem] md:px-6"
            >
              <AccordionTrigger className="text-left text-[17px] font-semibold text-ink hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-slate-600">
                {item.a}
                {item.q === "Do you run advertising?" ? (
                  <p className="mt-3">
                    <Link href="/integrations/advertising" className="font-medium text-brand hover:text-brand-hover">
                      Advertising
                    </Link>
                    {" · "}
                    <Link
                      href="/solutions/marketing-and-sales/digital-marketing"
                      className="font-medium text-brand hover:text-brand-hover"
                    >
                      Digital Marketing
                    </Link>
                  </p>
                ) : null}
                {item.q === "What does the work cost?" ? (
                  <p className="mt-3">
                    <Link href="/pricing" className="font-medium text-brand hover:text-brand-hover">
                      See the three tiers on the pricing page
                    </Link>
                  </p>
                ) : null}
                {item.q === "What is the Digital Footprint report?" ? (
                  <p className="mt-3">
                    <Link href="/report/example" className="font-medium text-brand hover:text-brand-hover">
                      Open the sample report
                    </Link>
                  </p>
                ) : null}
                {item.q === "Can I use the dashboard?" ? (
                  <p className="mt-3">
                    <a href={DASHBOARD_LOGIN_URL} className="font-medium text-brand hover:text-brand-hover">
                      Log in if we already invited you
                    </a>
                  </p>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <DualCtas className="mt-12 md:mt-10" />
      </div>
    </section>
  )
}
