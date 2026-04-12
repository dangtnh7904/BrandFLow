import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Proxy mọi request bắt đầu bằng /api/v1/ xuống BE Python (cổng 8000) */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://127.0.0.1:8000/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
