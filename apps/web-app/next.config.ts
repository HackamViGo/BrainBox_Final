import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@brainbox/ui', '@brainbox/utils', '@brainbox/types'],
  reactCompiler: true,
  experimental: {      
    turbopackFileSystemCacheForDev: true, 
  },
};

export default nextConfig;
