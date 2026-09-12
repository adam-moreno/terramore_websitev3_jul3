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
      { source: '/workshops', destination: '/partner', permanent: true },
      { source: '/careers', destination: '/about', permanent: true },
    ]
  },
}

export default nextConfig
