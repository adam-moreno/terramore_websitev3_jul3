import Link from "next/link"

const PROMISES = [
  {
    title: "Compliant.",
    body: "We handle your customer data to CCPA and HIPAA standards."
  },
  {
    title: "Private.",
    body: "Your lists and ads stay in your accounts. We never sell them or train AI on them."
  },
  {
    title: "In your control.",
    body: "No email, ad, or change goes out to your customers without your yes."
  },
]

export function SecurityBand() {
  return (
    <section id="security" className="pb-20 md:pb-24">
      <div className="page-shell">
        <h2 className="max-w-3xl text-[2.15rem] font-semibold tracking-[-0.03em] text-ink md:text-[3rem]">
          Compliant, private, and in your control.
        </h2>
        <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink/70">
          Three separate promises, and we keep all of them.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PROMISES.map((item) => (
            <div key={item.title} className="rounded-[1.75rem] bg-white p-8 shadow-[0_10px_36px_-20px_rgba(15,30,46,0.28)] md:p-9">
              <h3 className="text-[1.65rem] font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
        <Link
          href="/security"
          className="mt-8 inline-block text-[15px] font-medium text-brand hover:text-brand-hover"
        >
          See how we protect your data
        </Link>
      </div>
    </section>
  )
}
