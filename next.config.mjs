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
    ]
  },
}

export default nextConfig
