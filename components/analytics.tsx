import Script from "next/script";

// Umami Cloud: cookieless, so no consent banner is needed. Loads only on the
// production deployment and only once UMAMI_WEBSITE_ID is set in Vercel.
// Custom events are tracked with data-umami-event attributes on links.
export function Analytics() {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  if (!websiteId || process.env.VERCEL_ENV !== "production") return null;

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={websiteId}
      strategy="afterInteractive"
    />
  );
}
