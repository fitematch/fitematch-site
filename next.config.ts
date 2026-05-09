import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fitematch-development.s3.sa-east-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
