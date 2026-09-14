/** Compact G2-style rating row for the hero trust line. */
export function G2Rating({ rating = "4.5" }: { rating?: string }) {
  return (
    <div className="flex items-center justify-center gap-2" aria-label={`G2 rating ${rating} out of 5`}>
      <G2Mark className="h-[18px] w-[18px] shrink-0" />
      <div className="flex items-center gap-px" aria-hidden>
        <Star fill={1} />
        <Star fill={1} />
        <Star fill={1} />
        <Star fill={1} />
        <Star fill={0.5} />
      </div>
      <span className="text-[13px] font-semibold tabular-nums tracking-tight text-ink/65">{rating}</span>
    </div>
  )
}

function Star({ fill }: { fill: number }) {
  if (fill >= 1) {
    return (
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-[#ff492c]" fill="currentColor" aria-hidden>
        <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.52L10 14.27l-4.94 2.46.94-5.52-4-3.9 5.53-.8L10 1.5z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden>
      <defs>
        <linearGradient id="hero-g2-half-star">
          <stop offset="50%" stopColor="#ff492c" />
          <stop offset="50%" stopColor="#d4d4d4" />
        </linearGradient>
      </defs>
      <path
        fill="url(#hero-g2-half-star)"
        d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.52L10 14.27l-4.94 2.46.94-5.52-4-3.9 5.53-.8L10 1.5z"
      />
    </svg>
  )
}

/** Red circular G2 mark approximating the public G2 badge shape used on SaaS hero trust rows. */
function G2Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="20" fill="#ff492c" />
      <path
        fill="#fff"
        d="M12.2 20c0-4.3 3.4-7.8 7.8-7.8 2.6 0 4.9 1.3 6.3 3.3l-3.1 2.1c-.8-1.1-2-1.8-3.2-1.8-2.3 0-4.1 1.9-4.1 4.2s1.8 4.2 4.1 4.2c1.3 0 2.5-.6 3.3-1.6v-.9h-3.3v-3.1H29v1.6c0 4.1-3.2 7.2-8.9 7.2-4.5 0-7.9-3.5-7.9-7.8z"
      />
      <text
        x="29.2"
        y="14.2"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="9.5"
        fontWeight="800"
      >
        2
      </text>
    </svg>
  )
}
