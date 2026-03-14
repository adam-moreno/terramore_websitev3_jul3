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
      { source: '/courses/scaling', destination: '/courses/foundation', permanent: true },
      { source: '/courses/offers', destination: '/courses/make-it-real', permanent: true },
      { source: '/courses/leads', destination: '/courses/build-to-grow', permanent: true },
    ]
  },
}

export default nextConfig
