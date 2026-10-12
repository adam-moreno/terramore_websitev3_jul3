import type { Metadata } from 'next'
import './globals.css'
import { AdPixels } from '@/components/ad-pixels'
import { GoogleAnalytics } from '@/components/google-analytics'
import { SiteChrome } from '@/components/site-header'
import {
  GA4_MEASUREMENT_ID,
  GA4_MEASUREMENT_ID_LEGACY,
  GOOGLE_ADS_ID_DEFAULT,
  GOOGLE_TAG_ID,
} from '@/lib/analytics'
import { googleTagBootstrap } from '@/lib/google-tag'

// Vercel has the token under the misspelled name GOOGLE_SITE_VERIFICAITON; accept both so either works.
const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION?.trim() || process.env.GOOGLE_SITE_VERIFICAITON?.trim() || undefined

const googleAdsId = (
  process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ||
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID ||
  GOOGLE_ADS_ID_DEFAULT
).trim()

export const metadata: Metadata = {
  ...(googleSiteVerification ? { verification: { google: googleSiteVerification } } : {}),
  title: 'Terramore | Growth Marketing for Business Owners',
  description:
    'Terramore finds where your store, ads, and email lose sales, then fixes that step. For owners with a shop, a service, or a list. Book a free call or request a Digital Footprint report.',
  keywords: 'growth team, small business marketing, ecommerce, email marketing, advertising, digital footprint report',
  authors: [{ name: 'Adam Moreno' }],
  creator: 'Terramore',
  publisher: 'Terramore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.terramore.io'),
  icons: {
    icon: 'https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png',
    shortcut: 'https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png',
    apple: 'https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png',
  },
  openGraph: {
    title: 'Terramore | Growth Marketing for Business Owners',
    description:
      'Terramore finds where your store, ads, and email lose sales, then fixes that step. For owners with a shop, a service, or a list. Book a free call or request a Digital Footprint report.',
    url: 'https://www.terramore.io',
    siteName: 'Terramore',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/share/terramore-share-v2-og.png',
        width: 1200,
        height: 630,
        alt: 'Terramore | Unlock more from the business you already built',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terramore | Growth Marketing for Business Owners',
    description:
      'Terramore finds where your store, ads, and email lose sales, then fixes that step. For owners with a shop, a service, or a list. Book a free call or request a Digital Footprint report.',
    images: ['/share/terramore-share-v2-og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google tag (gtag.js) — current GA4 + legacy GA4 + Ads config, loaded on the production hostnames only
            (lib/google-tag.ts). Ads conversion event fires only after report success (see lib/analytics.ts).
            meeting_booked is GA4-only — no second Ads conversion. */}
        <script
          dangerouslySetInnerHTML={{
            __html: googleTagBootstrap(GOOGLE_TAG_ID, [GA4_MEASUREMENT_ID, GA4_MEASUREMENT_ID_LEGACY, googleAdsId]),
          }}
        />
        <link rel="icon" type="image/png" href="https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="preconnect" href="https://www.loom.com" />
        <link rel="dns-prefetch" href="https://www.loom.com" />
      </head>
      <body className="antialiased bg-cream text-ink">
        <GoogleAnalytics />
        <AdPixels />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.terramore.io/#website',
                  name: 'Terramore',
                  alternateName: 'Terramore.io',
                  url: 'https://www.terramore.io',
                  publisher: { '@id': 'https://www.terramore.io/#organization' },
                },
                {
                  '@type': 'ProfessionalService',
                  '@id': 'https://www.terramore.io/#organization',
                  name: 'Terramore',
                  alternateName: 'Terramore.io',
                  url: 'https://www.terramore.io',
                  description:
                    'Terramore is a growth partner for small businesses: it finds where a business loses customers, fixes it, and runs the marketing (ads, content, web, automation), measured in its TerraIQ software. Free Digital Footprint report and a free Growth Workspace.',
                  founder: { '@id': 'https://www.terramore.io/#founder' },
                  address: { '@type': 'PostalAddress', addressLocality: 'Los Angeles', addressRegion: 'CA', addressCountry: 'US' },
                  areaServed: 'US',
                  makesOffer: [
                    { '@type': 'Offer', name: 'Free 30-minute call', price: '0', priceCurrency: 'USD', url: 'https://www.terramore.io/book' },
                    { '@type': 'Offer', name: 'Free Digital Footprint report', price: '0', priceCurrency: 'USD', url: 'https://www.terramore.io/report' },
                  ],
                },
                {
                  '@type': 'Person',
                  '@id': 'https://www.terramore.io/#founder',
                  name: 'Adam Moreno',
                  jobTitle: 'Founder',
                  worksFor: { '@id': 'https://www.terramore.io/#organization' },
                  url: 'https://www.terramore.io/about',
                },
              ],
            }),
          }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
