import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Commented out static export to allow SSR/ISR for dynamic routes like blog
  // output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
