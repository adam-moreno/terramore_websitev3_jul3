import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solutions | Terramore',
  description:
    'Growth problems do not sit alone. Terramore connects strategy, marketing, automation, and data to the problem that is stuck.',
  openGraph: {
    title: 'Solutions | Terramore',
    description:
      'More leads, better conversion, less manual work, and a clear view of what is working.',
    url: 'https://www.terramore.io/solutions',
  },
}

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
