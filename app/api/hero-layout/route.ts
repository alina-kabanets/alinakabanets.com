import fs from "node:fs";
import path from "node:path";

// Saves the hero's arrangement from the dev-only layout editor to
// content/hero-layout.json. Development only; in production it doesn't exist.

const file = path.join(process.cwd(), "content/hero-layout.json");

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new Response("Not found", { status: 404 });
  const layout = await request.json();
  fs.writeFileSync(file, JSON.stringify(layout, null, 2) + "\n");
  return Response.json({ ok: true });
}
