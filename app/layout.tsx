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
  creator: 'Terramore.io',
  publisher: 'Terramore.io',
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
    siteName: 'Terramore.io',
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
        {/* Google tag (gtag.js) — current GA4 + legacy GA4 + Ads config.
            Ads conversion event fires only after report success (see lib/analytics.ts).
            meeting_booked is GA4-only — no second Ads conversion. */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_MEASUREMENT_ID}');
              gtag('config', '${GA4_MEASUREMENT_ID_LEGACY}');
              gtag('config', '${googleAdsId}');
            `,
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
              '@type': 'WebSite',
              name: 'Terramore.io',
              url: 'https://www.terramore.io',
              description:
                'Terramore finds where your store, ads, and email lose sales, then fixes that step. For owners with a shop, a service, or a list. Book a free call or request a Digital Footprint report.',
              publisher: {
                '@type': 'Organization',
                name: 'Terramore.io',
                url: 'https://www.terramore.io',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: { '@type': 'EntryPoint', urlTemplate: 'https://www.terramore.io/solutions?q={search_term_string}' },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
