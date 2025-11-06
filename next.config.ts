import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost", // ✅ السماح بالصور من localhost
        port: "3000",
        pathname: "/uploads/**", // ✅ السماح بمسار /uploads/
      },
    ],
    unoptimized: true, // ✅ تعطيل ضغط الصور مؤقتًا لتفادي المشاكل
  },
};

export default nextConfig;
