// X reads its own image tag; it's the same card as the link preview.
// (Route config like `revalidate` can't be re-exported, so it's repeated here.)
export { alt, size, contentType, generateStaticParams, default } from "./opengraph-image";
export const revalidate = 3600;
