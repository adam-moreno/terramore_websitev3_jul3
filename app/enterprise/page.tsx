import type { Metadata } from "next"
import { LindyCard, LindyPage } from "@/components/lindy-page"

export const metadata: Metadata = {
  title: "Larger teams | Terramore",
  description:
    "For brands with a marketing team already in place. A named Terramore crew for ads, creative, and systems, with reporting your leadership can read.",
}

export default function EnterprisePage() {
  return (
    <LindyPage
      title="A growth team that can"
      accent="sit next to yours."
      subtitle="For brands that already have a marketing team and need more hands who know ads, operations, and automation. You get named people, not a rotating vendor."
      ctaLabel="Let's talk"
    >
      <section className="pb-20">
        <div className="page-shell grid gap-5 md:grid-cols-3">
          <LindyCard
            title="Named people"
            body="One crew for media, creative, and systems. A weekly review your leadership can sit in on and read without a translator."
          />
          <LindyCard
            title="Ways to pay"
            body="A monthly retainer for ongoing work. A commission or hybrid model when revenue is already proven and the offer is set."
          />
          <LindyCard
            title="Security review"
            body="Vendor questionnaires, access scopes, and a paper trail. Start with our Security page and we finish the rest on a call."
            href="/security"
          />
        </div>
      </section>
    </LindyPage>
  )
}
