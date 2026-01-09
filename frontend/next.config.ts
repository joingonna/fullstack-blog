import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep SSR for admin functionality
  // Production optimizations
  reactStrictMode: true,
  poweredByHeader: false,

  // Image optimization - use unoptimized for VPS without image-processing libs
  images: {
    unoptimized: true,
    // If using Cloudflare R2, add your domain here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },

  // Standalone output for smaller deployment footprint
  output: 'standalone',
};

export default nextConfig;

