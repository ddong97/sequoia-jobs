import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["logo.clearbit.com"],   // <── allow external logo source
  },
  /* you can add other options below as needed
     e.g. reactStrictMode: true, experimental: { appDir: true } */
};

export default nextConfig;
