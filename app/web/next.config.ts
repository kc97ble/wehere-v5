import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["bot"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wehere-v5.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
