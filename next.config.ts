import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com', 'warkop-nusantara.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'warkop-nusantara.vercel.app',
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
