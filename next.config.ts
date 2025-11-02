import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.firebaseapp.com",
      },
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.firebasestorage.googleapis.com",
      },
      // Allow local API routes for MongoDB file serving
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
