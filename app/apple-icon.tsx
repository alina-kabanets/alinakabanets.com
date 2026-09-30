import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          color: "#f1f0ec",
          fontSize: 88,
          letterSpacing: "-0.04em",
        }}
      >
        AK
      </div>
    ),
    size,
  );
}
