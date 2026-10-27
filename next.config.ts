import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Dish photos are resized in the browser before upload, this leaves headroom
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
