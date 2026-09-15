import type { Metadata } from "next"
import { LindyCard, LindyPage } from "@/components/lindy-page"
import { DASHBOARD_LOGIN_URL } from "@/lib/dashboard"

export const metadata: Metadata = {
  title: "Start here | Terramore",
  description:
    "Every Terramore page in the order owners ask about them: what we do, what it costs, how the work happens, and how to start.",
}

export default function ResourcesPage() {
  return (
    <LindyPage
      title="Start here."
      accent="Every page, in order."
      subtitle="The questions owners ask first, and the page that answers each one."
      ctaHref="/partner"
      ctaLabel="Let's talk"
    >
      <section className="pb-20">
        <div className="page-shell grid gap-5 md:grid-cols-2">
          <LindyCard
            title="What do you actually do?"
            body="We work inside the store, ads, and email you already pay for. We find the step where you lose sales, fix it, and leave a 90-day plan."
            href="/#how-we-work"
          />
          <LindyCard
            title="What does it cost?"
            body="The call is free. Scope and payment are set after we agree on the work. Monthly is optional. You own the data and assets."
            href="/pricing"
          />
          <LindyCard
            title="Have you done my kind of job before?"
            body="Checkout, the appointment book, missed calls, a launch, repeat orders, getting found on Maps, and reaching people ready to buy."
            href="/#use-cases"
          />
          <LindyCard
            title="What is the free report?"
            body="We read your site, ads, Maps, and listings and write what is working, what is leaking, and what we would fix first. In your inbox in minutes."
            href="/report"
          />
          <LindyCard
            title="What does a report look like?"
            body="Sample reports for ecommerce and a service business. Illustrative demos — not live client files."
            href="/report/example"
          />
          <LindyCard
            title="Do I have to switch tools?"
            body="No. Shopify, Mailchimp, Google, Meta, Stripe, Calendly. See how we connect each one."
            href="/integrations"
          />
          <LindyCard
            title="Who is behind it?"
            body="Adam Moreno. A decade reading what people watch and buy for large advertisers, now pointed at owners."
            href="/about"
          />
          <LindyCard
            title="Is my customer data safe?"
            body="CCPA and HIPAA standards. Your lists and ads stay in your accounts. We do not sell or train on your data."
            href="/security"
          />
          <LindyCard
            title="Other questions"
            body="Do you run ads? Can I use the dashboard? What if I do not have a site yet?"
            href="/#faq"
          />
          <LindyCard
            title="Ready to talk?"
            body="Tell us where the business is stuck. We map the work and tell you if we are the right team."
            href="/partner"
          />
        </div>
        <p className="page-shell mt-10 text-center text-[15px] text-ink/70">
          Already a client?{" "}
          <a href={DASHBOARD_LOGIN_URL} className="font-medium text-brand hover:text-brand-hover">
            Log in
          </a>
          . Invite only. New work starts with a talk.
        </p>
      </section>
    </LindyPage>
  )
}
