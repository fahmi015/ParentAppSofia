import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler: true, // Commenting out as it might cause issues if not fully supported or needed yet
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.sofia-sahara.com',
      },
      {
        protocol: 'http',
        hostname: 'api.sofia-sahara.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://api.sofia-sahara.com/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
