import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// No nonces: every page is static, so the policy is set here instead of in a proxy.
// Third-party origins: Umami Cloud (the script loads from cloud.umami.is and
// sends events to gateway.umami.is) and tldraw, whose licensed watermark on
// /garden pings cdn.tldraw.com once per page load (page URL, licence ID,
// version) as its licence asks. The KPI tree case study embeds the dashboard
// demo, a separate app, in a frame.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://cloud.umami.is${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self' https://cloud.umami.is https://gateway.umami.is https://cdn.tldraw.com",
  `frame-src https://growth-dashboard-demo-two.vercel.app${isDev ? " http://localhost:4311" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // 90 is for dense UI screenshots, where 75 smudges small text.
  images: { qualities: [75, 90] },
  // Pages from my old portfolio (/portfolio/<project>, /react-carousel) are still linked and
  // indexed. Send them to the current work instead of a 404; the permanent
  // redirect also tells search engines to drop the old addresses.
  async redirects() {
    return [
      { source: "/portfolio", destination: "/#work", permanent: true },
      { source: "/portfolio/:path*", destination: "/#work", permanent: true },
      { source: "/react-carousel", destination: "/#work", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Strict-Transport-Security", value: "max-age=63072000" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
