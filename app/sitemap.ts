import type { MetadataRoute } from 'next'

const baseUrl = 'https://terramore.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/solutions',
    '/partner',
    '/resources',
    '/workshops',
    '/courses/leads',
    '/courses/offers',
    '/courses/scaling',
    '/privacy',
    '/terms',
    '/careers',
    '/disclosure',
    '/dmca',
  ]

  return routes.map((path) => ({
    url: path === '' ? `${baseUrl}/` : `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'weekly' as const : 'monthly' as const,
    priority: path === '' ? 1 : path.startsWith('/courses') || path === '/workshops' ? 0.9 : 0.8,
  }))
}
