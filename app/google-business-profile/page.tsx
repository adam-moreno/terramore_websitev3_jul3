import type { Metadata } from "next"
import { DIY_FAQ, PRICE_FAQ, TopicPage } from "@/components/topic-page"

export const metadata: Metadata = {
  title: "Google Business Profile Help for Small Businesses | Terramore.io",
  description:
    "Free check of your Google Maps listing, reviews, and website. Your top fixes in plain words. Fix them yourself or have us fix them.",
  alternates: { canonical: "/google-business-profile" },
}

export default function GoogleBusinessProfilePage() {
  return (
    <TopicPage
      title="Get your Google listing"
      accent="working for you."
      subtitle="Most people who find you nearby see your Google Business Profile before your website. Check what they see, free."
      intro={[
        "When someone searches for what you do near them, Google shows a map with three businesses. Wrong hours, an old phone number, a vague category, or no recent reviews can keep you out of it, or send the call to someone else.",
        "The free check looks at your listing and your website together, so you can see what's missing and what to fix first.",
      ]}
      checks={[
        { title: "Your Maps listing", body: "Whether Google finds your business on Maps, and whether the listing links to your website." },
        { title: "Reviews", body: "Your star rating and how many reviews you have." },
        { title: "Your website", body: "Does it say what you do and where, so Google and customers connect it to your listing?" },
      ]}
      steps={[
        { title: "Enter your website", body: "First results in about a minute. No login needed." },
        { title: "Get the report by email", body: "Your top fixes in plain words, starting with the one that matters most." },
        { title: "Fix it, or have us fix it", body: "Do it yourself, or book a free call and we'll handle the listing and the site together." },
      ]}
      faqs={[
        {
          q: "Do I need a Google Business Profile?",
          a: "If customers come to you, or you go to them in a set area, yes. It's free from Google, and it's often the first thing people see when they search for your kind of business nearby.",
        },
        {
          q: "My listing was suspended or I can't verify it. Can you help?",
          a: "We can look at what Google is likely objecting to, usually the address, the business name, or the category, and help you prepare an appeal. Google makes the final call.",
        },
        DIY_FAQ,
        PRICE_FAQ,
      ]}
      related={[
        { href: "/report", label: "Free website check" },
        { href: "/website-redesign", label: "Website redesign" },
        { href: "/solutions/discoverability/google-maps", label: "Getting found on Google Maps" },
        { href: "/pricing", label: "Pricing" },
      ]}
    />
  )
}
