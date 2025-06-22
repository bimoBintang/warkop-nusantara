import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**'
      }
    ]
  },
  eslint: {
    // Ignore ESLint errors during build for generated files
    ignoreDuringBuilds: false,
    dirs: ['src', 'pages', 'components', 'lib', 'utils'], // Only lint these directories
  },
  typescript: {
    // Ignore TypeScript errors during build (use with caution)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
