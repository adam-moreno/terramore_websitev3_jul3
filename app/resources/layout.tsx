import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Start here | Terramore',
  description: 'Every Terramore page in the order owners ask: what we do, what it costs, how the work happens, and how to start.',
  openGraph: {
    title: 'Start here | Terramore',
    description: 'Every Terramore page in the order owners ask: what we do, what it costs, how the work happens, and how to start.',
    url: 'https://www.terramore.io/resources',
  },
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
