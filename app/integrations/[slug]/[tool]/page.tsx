import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { IntegrationToolPage } from "@/components/integration-page"
import { INTEGRATION_CATEGORIES, getIntegrationTool } from "@/lib/integrations"

type PageProps = {
  params: Promise<{ slug: string; tool: string }>
}

export function generateStaticParams() {
  return INTEGRATION_CATEGORIES.flatMap((category) =>
    category.tools.map((tool) => ({
      slug: category.slug,
      tool: tool.slug,
    }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, tool: toolSlug } = await params
  const match = getIntegrationTool(slug, toolSlug)
  if (!match) return {}

  return {
    title: `${match.tool.title} | ${match.category.title} | Terramore`,
    description: match.tool.story[0],
    openGraph: {
      title: `${match.tool.title} | Terramore`,
      description: match.tool.story[0],
      url: `https://www.terramore.io/integrations/${match.category.slug}/${match.tool.slug}`,
    },
  }
}

export default async function IntegrationToolRoute({ params }: PageProps) {
  const { slug, tool: toolSlug } = await params
  const match = getIntegrationTool(slug, toolSlug)
  if (!match) notFound()

  return <IntegrationToolPage category={match.category} tool={match.tool} />
}
