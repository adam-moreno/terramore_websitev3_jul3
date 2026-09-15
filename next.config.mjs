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
    ]
  },
}

export default nextConfig
