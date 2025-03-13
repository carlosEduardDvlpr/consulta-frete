import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.melhorenvio.com.br',
      },
    ],
  },
};

export default nextConfig;
