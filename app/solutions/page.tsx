import type { Metadata } from "next"
import { CAPABILITY_HEROES } from "@/lib/capability-heroes"
import { CAPABILITIES, OWNER_JOBS, capabilityPath } from "@/lib/capabilities"
import { StoryCta, StoryHero, StoryLinkTiles, StorySection } from "@/components/story-page"

export const metadata: Metadata = {
  title: "Solutions | Terramore",
  description:
    "Pick the job: sell more from the store, fill the appointment book, bring customers back, get found, reach people ready to buy, spend less. Then see the capability behind it.",
}

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <StoryHero
        title="Solutions"
        lede="Start with the job, not the department. Pick what is stuck and we take you to the page that fixes it."
        follow="Every page below works inside the tools you already pay for, and every one ends with a 90-day plan your team can run."
        image={CAPABILITY_HEROES["marketing-and-sales"]}
        imageAlt="Solutions"
      />
      <StorySection title="Pick the job">
        <StoryLinkTiles
          items={OWNER_JOBS.map((job) => ({
            href: job.href,
            title: job.label,
            deck: job.deck,
          }))}
        />
      </StorySection>
      <StorySection title="Every capability">
        <StoryLinkTiles
          items={CAPABILITIES.map((item) => ({
            href: capabilityPath(item.slug),
            title: item.title,
            deck: item.story[0],
          }))}
        />
      </StorySection>
      <StoryCta />
    </div>
  )
}
