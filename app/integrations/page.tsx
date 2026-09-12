import { INTEGRATION_HEROES } from "@/lib/integration-heroes"
import { INTEGRATION_CATEGORIES, integrationPath } from "@/lib/integrations"
import { StoryCta, StoryHero, StoryLinkTiles, StorySection } from "@/components/story-page"

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <StoryHero
        title="Integrations"
        lede="We sit in the tools you already pay for. Email, ads, the store, payments, and the calendar. You do not start over."
        follow="Pick a channel. Each page names the software and how it ties back to revenue."
        image={INTEGRATION_HEROES["email-marketing"]}
        imageAlt="Integrations"
      />
      <StorySection title="The tools we sit in">
        <StoryLinkTiles
          items={INTEGRATION_CATEGORIES.map((item) => ({
            href: integrationPath(item.slug),
            title: item.navTitle,
            deck: item.story[0],
          }))}
        />
      </StorySection>
      <StoryCta />
    </div>
  )
}
