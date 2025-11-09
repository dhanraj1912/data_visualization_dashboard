/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Enable static optimization where possible
  swcMinify: true,
}

module.exports = nextConfig

