import type { MetadataRoute } from 'next'
import { CAPABILITIES, capabilityPath, offeringPath } from '@/lib/capabilities'
import { INTEGRATION_CATEGORIES, integrationPath, integrationToolPath } from '@/lib/integrations'

/** Canonical production host (apex 308s to www). */
const baseUrl = 'https://www.terramore.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/marketing',
    '/industries/construction',
    '/solutions',
    '/book',
    '/resources',
    '/report',
    '/google-business-profile',
    '/website-redesign',
    '/sacramento',
    '/report/example',
    '/security',
    '/integrations',
    '/pricing',
    '/enterprise',
    '/privacy',
    '/terms',
    '/disclosure',
    '/dmca',
    '/articles/three-numbers-before-raising-ad-spend',
    '/articles/why-your-best-ad-stops-working',
    '/articles/your-landing-page-is-the-problem',
  ]

  const capabilityRoutes = CAPABILITIES.flatMap((capability) => [
    capabilityPath(capability.slug),
    ...capability.offerings.map((offering) => offeringPath(capability.slug, offering.slug)),
  ])

  const integrationRoutes = INTEGRATION_CATEGORIES.flatMap((category) => [
    integrationPath(category.slug),
    ...category.tools.map((tool) => integrationToolPath(category.slug, tool.slug)),
  ])

  return [...routes, ...capabilityRoutes, ...integrationRoutes].map((path) => ({
    url: path === '' ? `${baseUrl}/` : `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))
}
