import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import knitSet from "@/assets/report/northline-knit-set.png"
import footprintDesk from "@/assets/report/northline-footprint-desk.png"
import { DualCtas } from "@/components/dual-ctas"

const FOOTPRINT = [
  { label: "Site", value: "northlineatelier.com", note: "Shopify. Hero is the Soft Knit Set." },
  { label: "Instagram", value: "18.2k", note: "Most reach. Ads still talk to the whole city." },
  { label: "Email list", value: "3,840", note: "Mailchimp. First-time buyer note is live." },
  { label: "Google Business", value: "2.9 · 11 reviews", note: "Hours are a season behind." },
  { label: "Paid", value: "Meta + TikTok", note: "Tracking is on. Few purchases are recorded." },
  { label: "Maps + search", value: "Partial", note: "Name shows. The knit set does not." },
]

const AUDIENCE = [
  { label: "Who buys", value: "Women 32–46" },
  { label: "Where", value: "Coastal US + UK" },
  { label: "First order", value: "Soft Knit Set, $84" },
  { label: "Average order", value: "$91" },
  { label: "Repeat in 90 days", value: "9%" },
  { label: "Cart leave rate", value: "61%" },
]

const WINS = [
  { title: "Checkout finishes on the phone", body: "Google Pay is on. The last step no longer asks for a full card on mobile." },
  { title: "First-time buyer email", body: "The note uses the Soft Knit Set they already opened. Open rate last 30 days: 41%." },
  { title: "Hero is clear", body: "The home page leads with one product and one price. People know what to tap." },
]

const OPENINGS = [
  { title: "Paid still talks to the city", body: "Spend is not limited to people who opened the knit set or sat in checkout." },
  { title: "No second note", body: "The list gets a welcome. It does not get a 21-day refill or a Merino Cardigan follow-up." },
  { title: "Maps hours are stale", body: "The listing still shows last winter. Reviews sit at 2.9 from eleven people." },
  { title: "Product copy is dated", body: "The Soft Knit Set page still says ships November 2025." },
]

function Slide({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children: ReactNode
}) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_8px_30px_rgba(15,30,46,0.06)]">
      <div className="flex items-center gap-2 border-b border-black/[0.05] px-5 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <p className="ml-2 truncate text-[12px] text-slate-400">Terramore · Digital footprint report</p>
      </div>
      <div className="p-7 md:p-10">
        <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-ink/40">{kicker}</p>
        <h2 className="mt-2 text-[1.65rem] font-semibold tracking-[-0.03em] text-ink md:text-[2rem]">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </article>
  )
}

export function ExampleReport({ sent }: { sent?: boolean }) {
  return (
    <div className="bg-cream pb-24">
      <section className="page-shell pt-6 md:pt-10">
        {sent ? (
          <p className="mb-6 rounded-2xl bg-white px-5 py-4 text-[15px] text-ink/75 shadow-[0_8px_30px_rgba(15,30,46,0.04)]">
            We have your email. This is the sample so you know the shape. Your report goes to the inbox you gave us.
          </p>
        ) : (
          <p className="mb-6 text-[14px] text-ink/50">
            Sample only. Names, product, and numbers are changed from a live client file.
          </p>
        )}

        <div className="overflow-hidden rounded-[1.75rem] bg-ink text-cream shadow-[0_8px_30px_rgba(15,30,46,0.12)]">
          <div className="grid items-stretch md:grid-cols-[1.1fr_0.9fr]">
            <div className="p-8 md:p-12">
              <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-cream/45">Sample report</p>
              <h1 className="mt-3 text-[2.4rem] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[3.25rem]">
                Northline Atelier
              </h1>
              <p className="mt-4 text-[1.1rem] leading-relaxed text-cream/70">
                Digital footprint, current audience, current wins, and the openings we would take first.
              </p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-[12px] uppercase tracking-[0.14em] text-cream/40">Hero product</dt>
                  <dd className="mt-1 text-[16px]">Soft Knit Set · $84</dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-[0.14em] text-cream/40">Next product</dt>
                  <dd className="mt-1 text-[16px]">Merino Cardigan · $72</dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-[0.14em] text-cream/40">Read date</dt>
                  <dd className="mt-1 text-[16px]">September 2026</dd>
                </div>
                <div>
                  <dt className="text-[12px] uppercase tracking-[0.14em] text-cream/40">Channel mix</dt>
                  <dd className="mt-1 text-[16px]">Site · IG · Mailchimp · Meta</dd>
                </div>
              </dl>
            </div>
            <div className="relative min-h-[18rem]">
              <Image src={knitSet} alt="Soft Knit Set in oatmeal, folded on linen" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-8 space-y-8">
        <Slide kicker="01 · Digital footprint" title="Where they already show up.">
          <div className="overflow-hidden rounded-[1.25rem]">
            <Image src={footprintDesk} alt="Desk with a store on the laptop and a product grid on the phone" className="aspect-[16/8] w-full object-cover" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {FOOTPRINT.map((item) => (
              <div key={item.label} className="rounded-2xl bg-cream px-5 py-4">
                <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">{item.label}</p>
                <p className="mt-1 text-[17px] font-semibold text-ink">{item.value}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>
        </Slide>

        <Slide kicker="02 · Current audience" title="Who already looks, and who already buys.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AUDIENCE.map((item) => (
              <div key={item.label} className="rounded-2xl border border-black/[0.05] px-5 py-4">
                <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">{item.label}</p>
                <p className="mt-2 text-[1.35rem] font-semibold tracking-tight text-ink">{item.value}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-slate-600">
            The buyer is a first-time knit customer, not a wholesale account. She finds the brand on Instagram, opens
            the Soft Knit Set, and often leaves when shipping shows. The people who finish look a lot like the people
            who already saved the product. Paid still talks to everyone in the ZIP.
          </p>
        </Slide>

        <Slide kicker="03 · Current wins" title="What is already working.">
          <div className="grid gap-4 md:grid-cols-3">
            {WINS.map((item) => (
              <div key={item.title} className="rounded-2xl bg-cream px-5 py-5">
                <h3 className="text-[17px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Slide>

        <Slide kicker="04 · Current openings" title="Where cash is still leaking.">
          <div className="grid gap-4 md:grid-cols-2">
            {OPENINGS.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/[0.05] px-5 py-5">
                <h3 className="text-[17px] font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </Slide>

        <Slide kicker="05 · Next 90 days" title="Three moves, in order.">
          <ol className="space-y-4">
            <li className="rounded-2xl bg-cream px-5 py-5">
              <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">Week 1–3</p>
              <p className="mt-1 text-[17px] font-semibold text-ink">Fix the listing and the dated copy.</p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                Maps hours, the November 2025 ship line, and the review ask after a delivered order.
              </p>
            </li>
            <li className="rounded-2xl bg-cream px-5 py-5">
              <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">Week 4–7</p>
              <p className="mt-1 text-[17px] font-semibold text-ink">Point paid at people who already looked.</p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                Soft Knit Set viewers and checkout leavers first. Pause the city-wide ads until there is enough purchase
                data to aim them.
              </p>
            </li>
            <li className="rounded-2xl bg-cream px-5 py-5">
              <p className="text-[12px] uppercase tracking-[0.12em] text-ink/40">Week 8–12</p>
              <p className="mt-1 text-[17px] font-semibold text-ink">Add the second note.</p>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                Day 21 Merino Cardigan to first-time buyers. Same list. A reason to come back.
              </p>
            </li>
          </ol>
        </Slide>
      </section>

      <section className="page-shell mt-12">
        <div className="max-w-2xl border-t border-black/[0.06] pt-10">
          <h2 className="text-[2rem] font-semibold tracking-[-0.02em] text-ink">Want this for your shop?</h2>
          <p className="mt-3 text-[1.05rem] leading-relaxed text-ink/70">
            Give us the site and an email. We send the report. Or talk and we map the work in a meeting.
          </p>
          <DualCtas className="mt-7" />
          <p className="mt-5 text-[14px] text-slate-500">
            Want yours?{" "}
            <Link href="/#report" className="font-medium text-brand hover:text-brand-hover">
              See what is in the free report
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
