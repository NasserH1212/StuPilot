import type { NextConfig } from "next";

// Content-Security-Policy is set per-request by proxy.ts, not here: it needs
// a fresh nonce for every response so script-src can drop 'unsafe-inline' in
// favor of 'nonce-<value>' 'strict-dynamic' (see docs/engineering, and the
// Next.js "Content Security Policy" guide under node_modules/next/dist/docs).
const securityHeaders = [
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "32kb",
    },
  },
  async headers() {
    const privateResponseHeaders = [
      {
        key: "Cache-Control",
        value: "private, no-store, no-cache, must-revalidate, max-age=0",
      },
      { key: "Vary", value: "Cookie, Authorization" },
    ];

    return [
      { source: "/(.*)", headers: securityHeaders },
      { source: "/:locale(ar|en)/auth/:path*", headers: privateResponseHeaders },
      { source: "/:locale(ar|en)/workspace/:path*", headers: privateResponseHeaders },
      { source: "/api/v1/session", headers: privateResponseHeaders },
    ];
  },
};

export default nextConfig;
