import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const ogSize = { width: 1200, height: 630 };

// Shared link-preview card in the site's style: paper background, one
// typeface, a thin rule and a small label row.
export function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#f1f0ec",
          color: "#111111",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
          <span>{profile.name}</span>
          <span style={{ color: "#6b6a66" }}>
            {profile.role} · {profile.location}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid #11111140", paddingTop: 28 }}>
          <span style={{ fontSize: 26, color: "#6b6a66" }}>{eyebrow}</span>
          <span style={{ marginTop: 16, fontSize: 84, lineHeight: 1, letterSpacing: "-0.04em" }}>{title}</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
