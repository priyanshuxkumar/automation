import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "workflows-dev-p.s3.ap-south-1.amazonaws.com"
    ],
  },
};

export default nextConfig;
