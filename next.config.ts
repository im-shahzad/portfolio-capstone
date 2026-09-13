import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Strip console.log/warn/debug/info from production builds; keep
    // console.error so server-side diagnostics (e.g. app/api/chat/route.ts's
    // stream-error logging) still reach Vercel's function logs.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    // Explicit per-icon module resolution for lucide-react, on top of
    // webpack's default tree-shaking, so barrel-file imports can't
    // regress into pulling in the whole icon set.
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
