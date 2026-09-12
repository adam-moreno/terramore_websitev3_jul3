"use client"

const LOGOS = [
  { name: "Google", slug: "google" },
  { name: "Amazon", slug: "amazon" },
  { name: "TikTok", slug: "tiktok" },
  { name: "Meta", slug: "meta" },
  { name: "Shopify", slug: "shopify" },
  { name: "YouTube", slug: "youtube" },
  { name: "Instagram", slug: "instagram" },
  { name: "LinkedIn", slug: "linkedin" },
  { name: "Facebook", slug: "facebook" },
  { name: "X", slug: "x" },
  { name: "Pinterest", slug: "pinterest" },
  { name: "Reddit", slug: "reddit" },
  { name: "Snapchat", slug: "snapchat" },
  { name: "WhatsApp", slug: "whatsapp" },
  { name: "Spotify", slug: "spotify" },
]

function LogoRow() {
  return (
    <div className="flex items-center gap-12 px-8">
      {LOGOS.map((logo) => (
        <img
          key={logo.slug}
          src={`https://cdn.simpleicons.org/${logo.slug}/64748b`}
          alt=""
          title={logo.name}
          className="h-7 w-auto shrink-0 opacity-70 grayscale"
        />
      ))}
    </div>
  )
}

export function HeroLogoMarquee() {
  return (
    <div className="relative mt-2 mb-10 w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f4f7f7] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f4f7f7] to-transparent" />
      <div className="flex w-max animate-hero-marquee">
        <LogoRow />
        <LogoRow />
      </div>
    </div>
  )
}
