import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Terramore | Partner With Us | Get in Touch Today',
  description: 'Reach out to Terramore. Partner with us or get in touch for marketing and consulting. Contact us today for a free consultation.',
  openGraph: {
    title: 'Contact Terramore | Partner With Us | Get in Touch Today',
    description: 'Reach out to Terramore. Partner with us or get in touch for marketing and consulting. Contact us today for a free consultation.',
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
