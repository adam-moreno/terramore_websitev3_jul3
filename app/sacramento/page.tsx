import type { Metadata } from "next"
import { DIY_FAQ, PRICE_FAQ, TopicPage } from "@/components/topic-page"

export const metadata: Metadata = {
  title: "Marketing Help for Sacramento Small Businesses | Terramore.io",
  description:
    "Terramore is a Sacramento company. Free website check for Sacramento small businesses: your site, Google listing, and social profiles, with fixes in plain words.",
  alternates: { canonical: "/sacramento" },
}

export default function SacramentoPage() {
  return (
    <TopicPage
      title="Marketing help for"
      accent="Sacramento businesses."
      subtitle="Terramore is based in Sacramento. Check how your business shows up online, free, then decide what to fix."
      intro={[
        "When people in Sacramento, Midtown, Elk Grove, Roseville, or Folsom search for what you do, they compare you in seconds: your Google listing, your reviews, and your website.",
        "The free check shows you what they see, and what to fix first. We work online, by video call, text, and email, so you don't need to take time out to meet in person.",
      ]}
      checks={[
        { title: "Local search", body: "Whether your site says what you do and that you serve the Sacramento area." },
        { title: "Your Google listing", body: "Whether you show up on Google Maps, your rating and review count, and whether the listing links to your site." },
        { title: "Website and social", body: "Search basics on your site, and whether your social profiles are real and linked." },
      ]}
      steps={[
        { title: "Enter your website", body: "First results in about a minute. No login needed." },
        { title: "Get the report by email", body: "Your top fixes in plain words." },
        { title: "Talk it through", body: "Book a free call, or text us at (612) 356-8558." },
      ]}
      faqs={[
        {
          q: "Where is Terramore?",
          a: "Our business address is 2108 N St, Sacramento, CA 95816. We work online with owners across Sacramento and the rest of the US.",
        },
        {
          q: "Do you only work with Sacramento businesses?",
          a: "No. We work with small businesses across the US, plus Canada and Mexico. Sacramento is home.",
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
