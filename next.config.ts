import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  swcMinify: false, // Add this line
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
