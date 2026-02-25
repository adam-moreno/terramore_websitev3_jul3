import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Terramore.io - Business Scaling Solutions',
  description: 'Transform your business with proven scaling strategies and AI-powered marketing solutions. Expert consulting for sustainable growth.',
  keywords: 'business scaling, marketing automation, growth strategy, AI marketing, business consulting',
  authors: [{ name: 'Adam Moreno' }],
  creator: 'Terramore.io',
  publisher: 'Terramore.io',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://terramore.io'),
  icons: {
    icon: 'https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png',
    shortcut: 'https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png',
    apple: 'https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png',
  },
  openGraph: {
    title: 'Terramore.io - Business Scaling Solutions',
    description: 'Transform your business with proven scaling strategies and AI-powered marketing solutions.',
    url: 'https://terramore.io',
    siteName: 'Terramore.io',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Terramore.io - Business Scaling Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terramore.io - Business Scaling Solutions',
    description: 'Transform your business with proven scaling strategies and AI-powered marketing solutions.',
    images: ['/og-image.png'],
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
        <link rel="icon" type="image/png" href="https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dzzzkruux/image/upload/v1768374905/Screenshot_2026-01-13_at_11.10.56_PM_eqtvoj.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e293b" />
        <link rel="preconnect" href="https://www.loom.com" />
        <link rel="dns-prefetch" href="https://www.loom.com" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
