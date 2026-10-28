import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Dish photos are resized in the browser before upload
    serverActions: { bodySizeLimit: "4mb" },
  },
  images: {
    // Local / static + same-origin /api/photos are fine by default.
    // Unoptimized path is used for data: URLs via the <Photo> component.
    remotePatterns: [],
  },
};

export default nextConfig;
