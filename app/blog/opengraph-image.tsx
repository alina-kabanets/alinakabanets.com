import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "Blog";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ eyebrow: "Blog", title: "Notes on designing and building AI products" });
}
