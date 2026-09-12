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
    <section id="security" className="section-y md:pb-24 md:pt-0">
      <div className="page-shell">
        <h2 className="section-title max-w-3xl text-ink md:text-[3rem] md:font-semibold md:leading-normal md:tracking-[-0.03em]">
          Compliant, private, and in your control.
        </h2>
        <p className="section-lede mt-4 max-w-2xl text-ink/70 md:text-[1.05rem] md:leading-relaxed">
          Three separate promises, and we keep all of them.
        </p>
        <div className="stack-gap mt-12 grid md:mt-10 md:gap-5 md:grid-cols-3">
          {PROMISES.map((item) => (
            <div key={item.title} className="card-radius card-pad bg-white shadow-[0_10px_36px_-20px_rgba(15,30,46,0.28)] md:rounded-[1.75rem] md:p-9">
              <h3 className="text-[1.5rem] font-semibold leading-[1.15] tracking-tight text-ink md:text-[1.65rem] md:leading-normal">{item.title}</h3>
              <p className="mt-3 text-[16px] leading-[1.5] text-slate-600 md:mt-4 md:leading-relaxed">{item.body}</p>
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
