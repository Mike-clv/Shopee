import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // LAN devices (192.168.1.47) must be allowed to reach the dev server's
  // HMR/websocket resources when it binds 0.0.0.0.
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.1.47"],
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
