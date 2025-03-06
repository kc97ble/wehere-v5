import type { NextConfig } from "next";
import type { Rewrite } from "next/dist/lib/load-custom-routes";

const REWRITES: Rewrite[] = [
  {
    source: "/",
    destination: "/Home",
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["bot"],
  rewrites: () => Promise.resolve(REWRITES),
};

export default nextConfig;
