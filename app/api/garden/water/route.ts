import { starterPlants } from "@/content/garden";
import { getPlant, overWaterLimit, storeAvailable, water } from "@/lib/garden-store";

// The shared watering can: any visitor can water any plant in the garden,
// and everyone sees it perk up. Plants wilt slowly when nobody waters them.

const starterIds = new Set(starterPlants.map((p) => p.id));

export async function POST(request: Request) {
  if (!storeAvailable) return Response.json({ error: "The garden is resting" }, { status: 503 });
  let id = "";
  try {
    const body = await request.json();
    id = typeof body?.id === "string" ? body.id : "";
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const known =
    starterIds.has(id) || (/^[a-f0-9]{12}$/.test(id) && (await getPlant(id))?.status === "approved");
  if (!known) return Response.json({ error: "No such plant" }, { status: 404 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (await overWaterLimit(ip)) {
    return Response.json({ error: "The watering can is empty. It refills in an hour." }, { status: 429 });
  }

  return Response.json({ id, wateredAt: await water(id) }, { headers: { "Cache-Control": "no-store" } });
}
