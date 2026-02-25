import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services | Terramore | Marketing & Consulting for Your Business',
  description: 'Find the services and expertise you need. Data-driven marketing and consulting from Terramore. Flexible solutions for new and existing businesses.',
  openGraph: {
    title: 'Services | Terramore | Marketing & Consulting for Your Business',
    description: 'Find the services and expertise you need. Data-driven marketing and consulting from Terramore. Flexible solutions for new and existing businesses.',
    url: 'https://terramore.io/solutions',
  },
}

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
