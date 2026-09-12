import { INTEGRATION_HEROES } from "@/lib/integration-heroes"
import {
  integrationToolPath,
  type IntegrationCategory,
  type IntegrationTool,
} from "@/lib/integrations"
import { StoryCta, StoryHero, StoryLinkTiles, StorySection, StoryTiles } from "@/components/story-page"

export function IntegrationCategoryPage({ category }: { category: IntegrationCategory }) {
  return (
    <div className="min-h-screen bg-cream">
      <StoryHero
        title={category.title}
        lede={category.story[0]}
        follow={category.story[1]}
        image={INTEGRATION_HEROES[category.slug]}
        imageAlt={category.title}
        parent={{ href: "/integrations", label: "Integrations" }}
      />
      <StorySection title={category.toolsTitle}>
        <StoryLinkTiles
          items={category.tools.map((tool) => ({
            href: integrationToolPath(category.slug, tool.slug),
            title: tool.title,
            deck: tool.deck,
            icon: tool.icon,
          }))}
        />
      </StorySection>
      <StorySection title={category.connectTitle}>
        <StoryTiles items={category.connect} />
      </StorySection>
      <StorySection title={category.revenueTitle}>
        <StoryTiles items={category.revenue} />
      </StorySection>
      <StoryCta />
    </div>
  )
}

export function IntegrationToolPage({
  category,
  tool,
}: {
  category: IntegrationCategory
  tool: IntegrationTool
}) {
  return (
    <div className="min-h-screen bg-cream">
      <StoryHero
        title={tool.title}
        lede={tool.story[0]}
        follow={tool.story[1]}
        image={INTEGRATION_HEROES[category.slug]}
        imageAlt={tool.title}
        parent={{ href: `/integrations/${category.slug}`, label: `${category.title} integrations` }}
      />
      <StorySection title={`How We Work with ${tool.title}`}>
        <StoryTiles items={tool.help} />
      </StorySection>
      <StoryCta />
    </div>
  )
}
