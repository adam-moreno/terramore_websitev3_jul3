import { INTEGRATION_HEROES } from "@/lib/integration-heroes"
import {
  integrationToolPath,
  workspaceConnectName,
  type IntegrationCategory,
  type IntegrationTool,
} from "@/lib/integrations"
import { BookingLink } from "@/components/booking-popup"
import { CheckMyBusinessLink } from "@/components/business-lookup"
import { SiteFooter } from "@/components/site-footer"
import {
  StoryCta,
  StoryHero,
  StoryLinkTiles,
  StoryNextStep,
  StorySection,
  StoryTiles,
} from "@/components/story-page"

export function IntegrationNextStep() {
  return <StoryNextStep surface="integration" />
}

/**
 * Tools the free Growth Workspace can connect. The workspace opens from the business check today, so the
 * connect line routes through "Check my business" rather than a direct connect link.
 */
function WorkspaceConnectNote({ name }: { name: string }) {
  return (
    <div className="max-w-3xl rounded-[1.5rem] bg-white p-5 shadow-[0_8px_30px_rgba(15,30,46,0.04)] md:p-6">
      <p className="text-[15px] leading-relaxed text-ink/80 md:text-[16px]">
        <strong className="font-semibold text-ink">Connect your {name} free.</strong> Check your business, then
        connect {name} in your free Growth Workspace and get a plan from your own numbers.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <CheckMyBusinessLink
          ctaId="integration_workspace_report"
          className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-5 text-[15px] font-medium text-white hover:bg-brand-hover"
        />
        <BookingLink
          label="Or book a free call"
          source="integrations"
          ctaId="integration_hero_book"
          className="inline-flex min-h-11 items-center text-[15px] font-medium text-ink/70 underline-offset-4 hover:text-ink hover:underline"
        />
      </div>
    </div>
  )
}

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
        next={<IntegrationNextStep />}
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
      <SiteFooter showDualCtas={false} />
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
  const workspaceName = workspaceConnectName(category.slug, tool.slug)

  return (
    <div className="min-h-screen bg-cream">
      <StoryHero
        title={tool.title}
        lede={tool.story[0]}
        follow={tool.story[1]}
        image={INTEGRATION_HEROES[category.slug]}
        imageAlt={tool.title}
        parent={{ href: `/integrations/${category.slug}`, label: `${category.title} integrations` }}
        next={workspaceName ? <WorkspaceConnectNote name={workspaceName} /> : <IntegrationNextStep />}
      />
      <StorySection title={`How We Work with ${tool.title}`}>
        <StoryTiles items={tool.help} />
      </StorySection>
      <StoryCta />
      <SiteFooter showDualCtas={false} />
    </div>
  )
}
