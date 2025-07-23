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
  openGraph: {
    title: 'Terramore.io - Business Scaling Solutions',
    description: 'Transform your business with proven scaling strategies and AI-powered marketing solutions.',
    url: 'https://terramore.io',
    siteName: 'Terramore.io',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terramore.io - Business Scaling Solutions',
    description: 'Transform your business with proven scaling strategies and AI-powered marketing solutions.',
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
