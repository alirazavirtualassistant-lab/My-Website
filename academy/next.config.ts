import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components / PPR are intentionally off: this app is mostly per-user,
  // dynamic content (sessions, enrollments, progress). Public pages opt into
  // static rendering explicitly where it is safe.
  cacheComponents: false,
  partialPrefetching: false,
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.mux.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  serverExternalPackages: ["@react-pdf/renderer", "exceljs", "jszip"],
  // Demo mode reads the bundled course package and legal placeholders from disk at
  // runtime; include them in serverless bundles explicitly (fs access is otherwise untraced).
  outputFileTracingIncludes: {
    "/**": ["./content/courses/**", "./content/storage/**", "./src/content/**"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
