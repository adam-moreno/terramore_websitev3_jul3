"use client"

const VERTICALS = [
  {
    name: "E-commerce",
    src: "/hero/verticals/vertical-ecommerce.png",
    alt: "E-commerce brand lifestyle",
  },
  {
    name: "Fitness",
    src: "/hero/verticals/vertical-fitness.png",
    alt: "Fitness and wellness brand lifestyle",
  },
  {
    name: "Home Services",
    src: "/hero/verticals/vertical-hvac.png",
    alt: "Home services brand lifestyle",
  },
  {
    name: "Professional Services",
    src: "/hero/verticals/vertical-professional.png",
    alt: "Professional services brand lifestyle",
  },
  {
    name: "Tech & Startups",
    src: "/hero/verticals/vertical-tech.png",
    alt: "Tech startup brand lifestyle",
  },
  {
    name: "Creators",
    src: "/hero/verticals/vertical-creators.png",
    alt: "Content creators brand lifestyle",
  },
  {
    name: "Skincare",
    src: "/hero/verticals/vertical-skincare.png",
    alt: "Skincare brand lifestyle",
  },
  {
    name: "Apparel",
    src: "/hero/verticals/vertical-apparel.png",
    alt: "Apparel brand lifestyle",
  },
  {
    name: "Loungewear",
    src: "/hero/verticals/vertical-loungewear.png",
    alt: "Loungewear brand lifestyle",
  },
  {
    name: "Construction",
    src: "/hero/verticals/vertical-construction.png",
    alt: "Construction brand lifestyle",
  },
]

export function HeroVerticals() {
  return (
    <div className="mt-10 md:mt-14 w-full">
      <p className="text-white/55 text-[11px] sm:text-xs tracking-[0.28em] uppercase mb-5">
        Verticals we grow
      </p>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 px-1 -mx-1 scrollbar-hide justify-start md:justify-center snap-x snap-mandatory">
        {VERTICALS.map((vertical, index) => (
          <div
            key={vertical.name}
            className="group flex-shrink-0 w-[112px] sm:w-[128px] snap-center animate-fade-in"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm ring-1 ring-white/20 bg-white/5 transition-all duration-300 group-hover:ring-white/50 group-hover:scale-[1.03]">
              <img
                src={vertical.src}
                alt={vertical.alt}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading={index < 3 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
            <p className="mt-2.5 text-center text-[11px] sm:text-xs font-semibold tracking-[0.12em] uppercase text-white/90">
              {vertical.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
