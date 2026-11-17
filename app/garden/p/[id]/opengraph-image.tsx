import { ImageResponse } from "next/og";
import { gardenShare } from "@/content/garden";
import { profile } from "@/content/profile";
import { plantSvg } from "@/lib/garden";
import { getPlant } from "@/lib/garden-store";
import { ogSize, renderOgImage } from "@/lib/og";

// The preview card for one plant: the drawing on the right, who planted it on
// the left, in the same style as the site's other cards.
export const alt = "A crayon plant in Alina’s garden";
export const size = ogSize;
export const contentType = "image/png";
export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plant = /^[a-f0-9]{12}$/.test(id) ? await getPlant(id).catch(() => null) : null;
  if (!plant || plant.status !== "approved") {
    return renderOgImage({ eyebrow: "Garden", title: "Plant something." });
  }
  const svg = plantSvg(plant.strokes, { width: 460, height: 430 });
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px",
          background: "#ffffff",
          color: "#111111",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
          <span>{profile.name}</span>
          <span style={{ color: "#6b6a66" }}>Garden</span>
        </div>
        <div style={{ display: "flex", flex: 1, borderTop: "1px solid #11111140", marginTop: 28, paddingTop: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
            <span style={{ fontSize: 26, color: "#6b6a66" }}>{plant.note || gardenShare.eyebrow}</span>
            <span style={{ marginTop: 16, fontSize: 72, lineHeight: 1.02, letterSpacing: "-0.04em" }}>
              {gardenShare.title(plant.name)}
            </span>
          </div>
          <img src={src} width={460} height={430} alt="" style={{ marginLeft: "auto" }} />
        </div>
      </div>
    ),
    ogSize,
  );
}
