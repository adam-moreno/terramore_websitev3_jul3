import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book a Free Consultation | Terramore | Data-Driven Marketing & Consulting',
  description: 'Schedule your free consultation. Custom, data-driven, performance-focused solutions. Book your call with Terramore today.',
  openGraph: {
    title: 'Book a Free Consultation | Terramore | Data-Driven Marketing & Consulting',
    description: 'Schedule your free consultation. Custom, data-driven, performance-focused solutions. Book your call with Terramore today.',
    url: 'https://terramore.io/workshops',
  },
}

export default function WorkshopsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
