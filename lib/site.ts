// On Vercel this is the production domain: the vercel.app URL today, and
// alinakabanets.com automatically once the domain is added to the project.
export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://alinakabanets.com";
