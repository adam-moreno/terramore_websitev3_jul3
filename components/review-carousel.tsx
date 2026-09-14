const JOBS = [
  {
    industry: "Pilates studio",
    place: "Austin",
    line: "Checkout leaking on the way to pay.",
  },
  {
    industry: "Plumbing company",
    place: "Phoenix",
    line: "Missed calls after 6 that never book.",
  },
  {
    industry: "Apparel brand",
    place: "Los Angeles",
    line: "First-time buyer notes that ignore what they viewed.",
  },
  {
    industry: "Home goods store",
    place: "Denver",
    line: "Shopify, Mailchimp, and Meta telling different stories.",
  },
  {
    industry: "Dental clinic",
    place: "Tampa",
    line: "The book link lives on the site, but not in the ad or the text.",
  },
  {
    industry: "Skincare brand",
    place: "Portland",
    line: "Paid traffic hitting a page that cannot finish.",
  },
  {
    industry: "Supplement brand",
    place: "Chicago",
    line: "Spend talking to people who already looked, then stopping.",
  },
  {
    industry: "Landscaping company",
    place: "Nashville",
    line: "No written plan the team can run on Monday.",
  },
]

function JobCard({ job }: { job: (typeof JOBS)[number] }) {
  return (
    <article className="w-[22rem] shrink-0 rounded-2xl border border-black/[0.05] bg-white px-5 py-4 shadow-[0_10px_32px_-18px_rgba(15,30,46,0.28)]">
      <p className="text-[15px] font-semibold leading-tight text-ink">{job.industry}</p>
      <p className="mt-0.5 text-[13px] leading-tight text-slate-500">{job.place}</p>
      <p className="mt-3 text-[15px] leading-snug text-ink/85">{job.line}</p>
    </article>
  )
}

export function ReviewCarousel() {
  return (
    <section className="overflow-hidden py-20 md:py-24">
      <div className="page-shell text-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-ink/40">Jobs we already know</p>
        <h2 className="mt-3 text-[2.15rem] font-semibold tracking-[-0.03em] text-ink md:text-[3rem]">
          The kinds of businesses we help.
        </h2>
      </div>
      <div className="mt-10 overflow-hidden">
        <div className="review-marquee flex w-max gap-4">
          {JOBS.map((job) => (
            <JobCard key={job.industry} job={job} />
          ))}
          {JOBS.map((job) => (
            <div key={`dup-${job.industry}`} aria-hidden>
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
