import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Property data is read from /properties at build time.
  outputFileTracingIncludes: {
    "/**": ["./properties/**/*.json"],
  },
};

export default nextConfig;
