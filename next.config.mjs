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
  // The Terramore contact card (public/terramore.vcf), sent by text after an owner replies so the line shows as
  // "Terramore" and links preview (Apple hides previews from unknown senders).
  async headers() {
    return [{ source: '/terramore.vcf', headers: [{ key: 'Content-Type', value: 'text/vcard; charset=utf-8' }, { key: 'Content-Disposition', value: 'inline; filename="Terramore.vcf"' }] }]
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
      // Permanent (2026-10-16): the old pages aren't coming back, and Google only passes a page's standing on with a permanent redirect.
      { source: '/services', destination: '/report', permanent: true },
      { source: '/services/:path*', destination: '/report', permanent: true },
      { source: '/marketing/services', destination: '/marketing', permanent: true },
      { source: '/small-business', destination: '/', permanent: true },
      { source: '/small-business/:path*', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
