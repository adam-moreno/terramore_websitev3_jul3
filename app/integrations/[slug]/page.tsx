import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { IntegrationCategoryPage } from "@/components/integration-page"
import { INTEGRATION_CATEGORIES, getIntegrationCategory } from "@/lib/integrations"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return INTEGRATION_CATEGORIES.map((category) => ({ slug: category.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = getIntegrationCategory(slug)
  if (!category) return {}

  return {
    title: `${category.title} | Terramore`,
    description: category.story[0],
    openGraph: {
      title: `${category.title} | Terramore`,
      description: category.story[0],
      url: `https://terramore.io/integrations/${category.slug}`,
    },
  }
}

export default async function IntegrationCategoryRoute({ params }: PageProps) {
  const { slug } = await params
  const category = getIntegrationCategory(slug)
  if (!category) notFound()

  return <IntegrationCategoryPage category={category} />
}
