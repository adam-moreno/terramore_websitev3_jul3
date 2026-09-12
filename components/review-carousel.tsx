const REVIEWS = [
  {
    name: "Maya Chen",
    handle: "@mayachen",
    role: "Pilates studio owner, Austin",
    source: "google" as const,
    photo: "/reviews/review-maya.png",
    quote: "They sat in our tools the first week. Checkout stopped leaking.",
  },
  {
    name: "Eli Navarro",
    handle: "@elinavarro",
    role: "Plumbing company, Phoenix",
    source: "yelp" as const,
    photo: "/reviews/review-eli.png",
    quote: "Missed calls used to die at 6. Now the morning is booked.",
  },
  {
    name: "Priya Shah",
    handle: "@priyashah",
    role: "Apparel brand founder, Los Angeles",
    source: "google" as const,
    photo: "/reviews/review-priya.png",
    quote: "The first-time buyer note used the product they already looked at.",
  },
  {
    name: "Jonah Reed",
    handle: "@jonahreed",
    role: "Home goods store founder, Denver",
    source: "linkedin" as const,
    photo: "/reviews/review-jonah.png",
    quote: "Shopify, Mailchimp, and Meta finally told the same story.",
  },
  {
    name: "Lena Ortiz",
    handle: "@lenaortiz",
    role: "Dental clinic manager, Tampa",
    source: "google" as const,
    photo: "/reviews/review-lena.png",
    quote: "The book link is on the site, in the ad, and in the text.",
  },
  {
    name: "Chris Hale",
    handle: "@chrishale",
    role: "Skincare brand owner, Portland",
    source: "g2" as const,
    photo: "/reviews/review-chris.png",
    quote: "They showed the leak before they charged us to fix it.",
  },
  {
    name: "Amina Cole",
    handle: "@aminacole",
    role: "Supplement brand, marketing lead, Chicago",
    source: "linkedin" as const,
    photo: "/reviews/review-amina.png",
    quote: "Spend moved to people who already looked. Paid felt useful again.",
  },
  {
    name: "Diego Alvarez",
    handle: "@diegoalvarez",
    role: "Landscaping company owner, Nashville",
    source: "yelp" as const,
    photo: "/reviews/review-diego.png",
    quote: "The 90-day chart is still on our wall. We run Monday from it.",
  },
]

function SourceMark({ source }: { source: (typeof REVIEWS)[number]["source"] }) {
  if (source === "google") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-label="Google">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
        <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z" />
        <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4V6.5H1.4C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.5l4-3.1z" />
        <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.8 8.9 4.8 12 4.8z" />
      </svg>
    )
  }

  if (source === "yelp") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-label="Yelp">
        <path
          fill="#FF1A1A"
          d="M12.1 2.1c.6-.2 1.2.2 1.3.8l1.2 6.4c.1.6-.3 1.2-.9 1.3l-2.1.3c-.6.1-1.1-.4-1.1-1L9.3 3.4c0-.7.5-1.2 1.2-1.3h1.6zm7.6 5.2c.6.3.8 1 .5 1.6l-3.2 5.7c-.3.5-1 .7-1.6.4l-1.8-1c-.5-.3-.7-1-.4-1.6l3.2-5.6c.3-.6 1.1-.8 1.7-.5l1.6 1zm-13.4.3 1.6-1c.6-.3 1.4 0 1.6.6l2.4 6c.2.6 0 1.3-.6 1.5l-1.9.7c-.6.2-1.3 0-1.5-.6L5.6 8.7c-.3-.6 0-1.3.7-1.6zm1.2 11.1c-.3-.6 0-1.3.6-1.5l6.2-2.2c.6-.2 1.2.1 1.4.7l.7 2c.2.6-.1 1.3-.7 1.5l-6.5 2.3c-.6.2-1.3-.1-1.5-.7l-.2-2.1z"
        />
      </svg>
    )
  }

  if (source === "g2") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-label="G2">
        <circle cx="12" cy="12" r="11" fill="#FF492C" />
        <path fill="#fff" d="M8.2 8.1h5.1c2.4 0 3.9 1.5 3.9 3.6 0 1.6-.9 2.8-2.3 3.3l2.5 3.4h-2.6l-2.2-3.1H10v3.1H8.2V8.1zm5 5.2c1.2 0 2-.7 2-1.7s-.8-1.6-2-1.6H10v3.3h3.2z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-label="LinkedIn">
      <path
        fill="#0A66C2"
        d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.3A1.8 1.8 0 116.5 4.7a1.8 1.8 0 010 3.6zM19 19h-3v-4.8c0-1.4-.5-2.1-1.5-2.1-1.1 0-1.6.8-1.6 2.1V19h-3v-9h3v1.2c.5-.8 1.5-1.5 2.8-1.5 2.1 0 3.3 1.3 3.3 4.1z"
      />
    </svg>
  )
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[number] }) {
  return (
    <article className="card-radius card-pad w-[22rem] shrink-0 border border-black/[0.05] bg-white shadow-[0_10px_32px_-18px_rgba(15,30,46,0.28)] md:rounded-2xl md:px-5 md:py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={review.photo}
            alt=""
            className="h-11 w-11 shrink-0 rounded-full object-cover object-top"
          />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold leading-tight text-ink">{review.name}</p>
            <p className="truncate text-[13px] leading-tight text-slate-500">{review.role}</p>
          </div>
        </div>
        <SourceMark source={review.source} />
      </div>
      {/* Phones show the whole quote; desktop keeps one line so the row stays even. */}
      <p className="mt-3 text-[16px] leading-[1.5] text-ink/85 md:truncate md:text-[15px] md:leading-snug">{review.quote}</p>
    </article>
  )
}

export function ReviewCarousel() {
  const track = [...REVIEWS, ...REVIEWS]

  return (
    <section className="section-y overflow-hidden md:py-24">
      <div className="page-shell text-center">
        <p className="section-eyebrow">Letters to Terramore</p>
        <h2 className="section-title mt-3 text-ink md:text-[3rem] md:font-semibold md:leading-normal md:tracking-[-0.03em]">
          Owners on what changed.
        </h2>
      </div>
      <div className="mt-12 overflow-hidden md:mt-10">
        <div className="review-marquee flex w-max gap-4">
          {track.map((review, index) => (
            <ReviewCard key={`${review.name}-${index}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}
