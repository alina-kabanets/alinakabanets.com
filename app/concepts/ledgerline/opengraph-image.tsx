import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getConcept } from "@/content/concepts";
import { profile } from "@/content/profile";
import { ogSize } from "@/lib/og";

export const alt = "Ledgerline: an accounts payable queue for invoices and receipts, by Alina Kabanets";
export const size = ogSize;
export const contentType = "image/png";

// The shared card's style (white, one typeface, a thin rule), with the
// product beside the title: in a feed, the screen is what says "fintech".
// Built once at build time, so reading a local file is fine.
export default async function Image() {
  const concept = getConcept("ledgerline")!;
  const shot = await readFile(join(process.cwd(), "assets/og/ledgerline.jpg"), "base64");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 64, background: "#ffffff", color: "#111111" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
          <span>{profile.name}</span>
          <span style={{ color: "#6b6a66" }}>Concept · B2B fintech</span>
        </div>
        <div style={{ display: "flex", flex: 1, marginTop: 28, borderTop: "1px solid #11111140", paddingTop: 28, gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 440 }}>
            <span style={{ fontSize: 24, color: "#6b6a66" }}>Accounts payable · design and code</span>
            <span style={{ marginTop: 16, fontSize: 58, lineHeight: 1.02, letterSpacing: "-0.035em" }}>{concept.title}</span>
          </div>
          <div style={{ display: "flex", width: 602, height: 356, borderRadius: 10, border: "1px solid #11111226", overflow: "hidden" }}>
            <img src={`data:image/jpeg;base64,${shot}`} alt="" width={1280} height={756} style={{ width: 600, height: 354, objectFit: "cover", objectPosition: "left top" }} />
          </div>
        </div>
      </div>
    ),
    ogSize,
  );
}
