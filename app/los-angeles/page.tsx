import type { Metadata } from "next"
import { DIY_FAQ, PRICE_FAQ, TopicPage } from "@/components/topic-page"
import { PHONE_DISPLAY } from "@/lib/contact"

export const metadata: Metadata = {
  title: "Marketing Help for Los Angeles Small Businesses | Terramore.io",
  description:
    "Terramore is based in Los Angeles. Free website check for LA small businesses: your site, Google listing, and social profiles, with fixes in plain words.",
  alternates: { canonical: "/los-angeles" },
}

export default function LosAngelesPage() {
  return (
    <TopicPage
      title="Marketing help for"
      accent="Los Angeles businesses."
      subtitle="Terramore is based in Los Angeles. Check how your business shows up online, free, then decide what to fix."
      intro={[
        "When people in Los Angeles, the Valley, Pasadena, Glendale, Burbank, Santa Monica, or Long Beach search for what you do, they compare you in seconds: your Google listing, your reviews, and your website.",
        "The free check shows you what they see, and what to fix first. We work online, by video call, text, and email, so you don't need to sit in traffic to meet.",
      ]}
      checks={[
        { title: "Local search", body: "Whether your site says what you do and that you serve the Los Angeles area." },
        { title: "Your Google listing", body: "Whether you show up on Google Maps, your rating and review count, and whether the listing links to your site." },
        { title: "Website and social", body: "Search basics on your site, and whether your social profiles are real and linked." },
      ]}
      steps={[
        { title: "Enter your website", body: "First results in about a minute. No login needed." },
        { title: "Get the report by email", body: "Your top fixes in plain words." },
        { title: "Talk it through", body: `Book a free call, or call us at ${PHONE_DISPLAY}.` },
      ]}
      faqs={[
        {
          q: "Where is Terramore?",
          a: "We're based in Los Angeles and work online, by video call, text, and email. We don't have an office open to visitors.",
        },
        {
          q: "Do you only work with Los Angeles businesses?",
          a: "No. We work with small businesses across the US, plus Canada and Mexico.",
        },
        DIY_FAQ,
        PRICE_FAQ,
      ]}
      related={[
        { href: "/report", label: "Free website check" },
        { href: "/google-business-profile", label: "Google Business Profile help" },
        { href: "/website-redesign", label: "Website redesign" },
        { href: "/about", label: "About Terramore" },
      ]}
    />
  )
}
