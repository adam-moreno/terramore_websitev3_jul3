import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { OfferingPage } from "@/components/capability-page"
import { CAPABILITIES, getOffering } from "@/lib/capabilities"

type PageProps = {
  params: Promise<{ slug: string; offering: string }>
}

export function generateStaticParams() {
  return CAPABILITIES.flatMap((capability) =>
    capability.offerings.map((offering) => ({
      slug: capability.slug,
      offering: offering.slug,
    }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, offering: offeringSlug } = await params
  const match = getOffering(slug, offeringSlug)
  if (!match) return {}

  return {
    title: `${match.offering.title} | ${match.capability.title} | Terramore`,
    description: match.offering.story[0],
    openGraph: {
      title: `${match.offering.title} | Terramore`,
      description: match.offering.story[0],
      url: `https://www.terramore.io/solutions/${match.capability.slug}/${match.offering.slug}`,
    },
  }
}

export default async function OfferingRoute({ params }: PageProps) {
  const { slug, offering: offeringSlug } = await params
  const match = getOffering(slug, offeringSlug)
  if (!match) notFound()

  return <OfferingPage capability={match.capability} offering={match.offering} />
}
