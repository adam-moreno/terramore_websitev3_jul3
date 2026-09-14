import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Terramore | Founder-led growth consultancy',
  description: 'Adam Moreno leads Terramore, a growth consultancy for owners with a shop, a service, or a list. Specialists join when the job needs them.',
  openGraph: {
    title: 'About Terramore | Founder-led growth consultancy',
    description: 'Adam Moreno leads Terramore, a growth consultancy for owners with a shop, a service, or a list. Specialists join when the job needs them.',
    url: 'https://terramore.io/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
