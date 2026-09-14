import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Talk with Terramore | Free 30-minute call',
  description: 'Tell us where the business is stuck. The call is free. Scope and payment come after we agree on the work.',
  openGraph: {
    title: 'Talk with Terramore | Free 30-minute call',
    description: 'Tell us where the business is stuck. The call is free. Scope and payment come after we agree on the work.',
    url: 'https://terramore.io/partner',
  },
}

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
