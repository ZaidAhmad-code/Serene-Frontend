import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
      {
        // Non-streaming fallback endpoint (not prefixed with /api/)
        source: "/ask",
        destination: "http://localhost:5000/ask",
      },
    ];
  },
};

export default nextConfig;
