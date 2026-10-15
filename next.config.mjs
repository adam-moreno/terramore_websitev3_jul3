/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/courses', destination: '/', permanent: true },
      { source: '/courses/:path*', destination: '/', permanent: true },
      { source: '/workshops', destination: '/book', permanent: true },
      { source: '/partner', destination: '/book', permanent: true },
      { source: '/careers', destination: '/about', permanent: true },
      // Gmail had a duplicate tool page under Calls, texts, and chat. One canonical page lives under Email Marketing.
      { source: '/integrations/communications/gmail', destination: '/integrations/email-marketing/gmail', permanent: true },
      // Old Google Ads landing pages (2026-10-15): the construction service pages and the marketing service pages are gone.
      // Anyone with an old ad or link lands on the free check (or the marketing page) instead of "not found".
      { source: '/services', destination: '/report', permanent: false },
      { source: '/services/:path*', destination: '/report', permanent: false },
      { source: '/marketing/services', destination: '/marketing', permanent: false },
      { source: '/small-business', destination: '/', permanent: false },
      { source: '/small-business/:path*', destination: '/', permanent: false },
    ]
  },
}

export default nextConfig
