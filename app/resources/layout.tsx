import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies & Resources | Terramore | Results & Learning',
  description: 'See the results Terramore delivers. Case studies, resources, and insights for marketing and consulting. Learn what we can do for your business.',
  openGraph: {
    title: 'Case Studies & Resources | Terramore | Results & Learning',
    description: 'See the results Terramore delivers. Case studies, resources, and insights for marketing and consulting. Learn what we can do for your business.',
    url: 'https://terramore.io/resources',
  },
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
