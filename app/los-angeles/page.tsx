import type { Metadata } from "next"
import { LosAngelesLanding } from "@/components/los-angeles-landing"
import { LA_FAQS } from "@/lib/los-angeles"

export const metadata: Metadata = {
  title: "Marketing Help for Los Angeles Small Businesses | Terramore.io",
  description:
    "Terramore is based in Los Angeles. Free website check for LA small businesses: your site, Google Maps listing, reviews and social profiles, with fixes in plain words.",
  alternates: { canonical: "/los-angeles" },
}

export default function LosAngelesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: LA_FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <LosAngelesLanding />
    </>
  )
}
