import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CapabilityPage } from "@/components/capability-page"
import { CAPABILITIES, getCapability } from "@/lib/capabilities"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return CAPABILITIES.map((capability) => ({ slug: capability.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const capability = getCapability(slug)
  if (!capability) return {}

  return {
    title: `${capability.title} | Terramore`,
    description: capability.story[0],
    openGraph: {
      title: `${capability.title} | Terramore`,
      description: capability.story[0],
      url: `https://www.terramore.io/solutions/${capability.slug}`,
    },
  }
}

export default async function CapabilityRoute({ params }: PageProps) {
  const { slug } = await params
  const capability = getCapability(slug)
  if (!capability) notFound()

  return <CapabilityPage capability={capability} />
}
