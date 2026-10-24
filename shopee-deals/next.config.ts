import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // External DB engines executed by the Node runtime, not bundled.
  serverExternalPackages: ["@electric-sql/pglite"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.accesstrade.vn" },
      { protocol: "https", hostname: "cdn.accesstrade.vn" },
      { protocol: "https", hostname: "**.shopapi.io" },
      { protocol: "https", hostname: "**.shopee.vn" },
    ],
  },
};

export default nextConfig;
