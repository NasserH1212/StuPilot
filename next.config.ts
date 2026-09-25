import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; " +
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}; connect-src 'self'`,
  },
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
