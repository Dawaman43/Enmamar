import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  // Ensure Next uses this workspace as the root to avoid vendor-chunks lookup issues
  outputFileTracingRoot: process.cwd(),
}

export default nextConfig
