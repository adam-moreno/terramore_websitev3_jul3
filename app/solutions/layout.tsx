import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Solutions | Terramore',
  description: 'Pick the job that is stuck. Sell more from the store, fill the appointment book, bring customers back, get found, reach people ready to buy, or spend less.',
  openGraph: {
    title: 'Solutions | Terramore',
    description: 'Pick the job that is stuck. Sell more from the store, fill the appointment book, bring customers back, get found, reach people ready to buy, or spend less.',
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
