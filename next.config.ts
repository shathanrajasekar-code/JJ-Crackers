import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'canvas-confetti'],
  },
  async rewrites() {
    return [
      {
        source: '/products/:path+',
        destination: '/product-assets/:path+',
      },
    ];
  },
};

export default nextConfig;
