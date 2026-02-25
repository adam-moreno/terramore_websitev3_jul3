import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Terramore | Who We Are | Scale & Grow With Expert Support',
  description: 'Meet the Terramore team. We help new and existing businesses scale with marketing and consulting. Ready to grow with expert support.',
  openGraph: {
    title: 'About Terramore | Who We Are | Scale & Grow With Expert Support',
    description: 'Meet the Terramore team. We help new and existing businesses scale with marketing and consulting. Ready to grow with expert support.',
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
