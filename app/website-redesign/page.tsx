import type { Metadata } from "next"
import { DIY_FAQ, PRICE_FAQ, TopicPage } from "@/components/topic-page"

export const metadata: Metadata = {
  title: "Website Redesign for Small Businesses | Terramore.io",
  description:
    "Before you redesign, check what your current site is costing you. Free website check for small businesses, then a redesign only where it pays off.",
  alternates: { canonical: "/website-redesign" },
}

export default function WebsiteRedesignPage() {
  return (
    <TopicPage
      title="Thinking about a"
      accent="website redesign?"
      subtitle="Find out what your current site is costing you first. Sometimes it needs a rebuild. Often it needs three fixes."
      intro={[
        "A new website is a big spend. Before you start, it helps to know why the current one isn't bringing in calls or orders: people can't find it, it doesn't say what you do, it's slow on a phone, or there's no clear way to call or book.",
        "The free check reads your site the way a new customer and Google do, and tells you what to fix first.",
      ]}
      checks={[
        { title: "First impression", body: "Does the top of your homepage say what you do and where, in one line?" },
        { title: "Listing and social", body: "Whether your Google Maps listing and social profiles are real and point back to your site." },
        { title: "Search basics", body: "Page titles, a sitemap, and the details Google needs to show your pages." },
      ]}
      steps={[
        { title: "Enter your website", body: "First results in about a minute. No login needed." },
        { title: "Get the report by email", body: "What's working, what's missing, and your top fixes in plain words." },
        { title: "Fix, redesign, or both", body: "Book a free call and we'll tell you honestly whether you need a new site or a few changes to the one you have." },
      ]}
      faqs={[
        {
          q: "Do I need a whole new website?",
          a: "Not always. If the site is on a platform you're happy with, fixing the headline, the call to action, and the search basics can do more than a rebuild. The check helps you decide.",
        },
        {
          q: "Which website builders do you work with?",
          a: "We work in the platform you already have, such as WordPress, Wix, Squarespace, or Shopify, so you don't start over.",
        },
        DIY_FAQ,
        PRICE_FAQ,
      ]}
      related={[
        { href: "/report", label: "Free website check" },
        { href: "/google-business-profile", label: "Google Business Profile help" },
        { href: "/solutions/discoverability/search-and-seo", label: "Search and SEO" },
        { href: "/pricing", label: "Pricing" },
      ]}
    />
  )
}
