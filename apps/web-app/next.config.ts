import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@brainbox/ui', '@brainbox/utils', '@brainbox/types'],
};

export default nextConfig;
