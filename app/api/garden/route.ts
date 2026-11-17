import { after } from "next/server";
import { profile } from "@/content/profile";
import { parseSubmission } from "@/lib/garden";
import { addPlant, approvedPlants, overRateLimit, statuses, storeAvailable, wateredTimes } from "@/lib/garden-store";

// The visitors' garden. GET lists the approved plants and when each plant was
// last watered (and, with ?mine=, the status of the caller's own plants).
// POST plants a new one, which waits for review before anyone else sees it.

const MAX_BODY = 300_000; // bytes; a big drawing is well under this

const unavailable = () => Response.json({ error: "The garden is resting" }, { status: 503 });

export async function GET(request: Request) {
  if (!storeAvailable) return unavailable();
  const mine = (new URL(request.url).searchParams.get("mine") ?? "")
    .split(",")
    .filter((id) => /^[a-f0-9]{12}$/.test(id))
    .slice(0, 20);

  if (mine.length > 0) {
    return Response.json({ mine: await statuses(mine) }, { headers: { "Cache-Control": "no-store" } });
  }
  const [plants, watered] = await Promise.all([approvedPlants(), wateredTimes()]);
  return Response.json(
    { plants, watered },
    // Shared by everyone: a short CDN cache keeps the database calls down.
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300" } },
  );
}

export async function POST(request: Request) {
  if (!storeAvailable) return unavailable();

  const text = await request.text();
  if (text.length > MAX_BODY) return Response.json({ error: "The drawing is too big" }, { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: a field people never see. Bots fill it; pretend it worked.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return Response.json({ id: "000000000000" });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (await overRateLimit(ip)) {
    return Response.json({ error: "That’s a lot of planting. Try again in an hour." }, { status: 429 });
  }

  const parsed = parseSubmission(body);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const plant = await addPlant({ name: parsed.name, note: parsed.note, strokes: parsed.strokes });

  // Let Alina know there's a plant to review, once the visitor has their answer.
  const origin = new URL(request.url).origin;
  after(() => notify(plant.name, plant.note, `${origin}/garden/review`));

  return Response.json({ id: plant.id, createdAt: plant.createdAt }, { status: 201 });
}

// An email through Resend, the same way the /paper notepad sends notes.
// Without RESEND_API_KEY (or if it fails), the plant still waits in the queue.
async function notify(name: string, note: string, reviewUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Garden <onboarding@resend.dev>",
      to: [profile.email],
      subject: `🌱 ${name} planted something in your garden`,
      text: `${name} planted something${note ? `, with a note: “${note}”` : "."}\n\nIt’s waiting for you here:\n${reviewUrl}`,
    }),
  }).catch(() => {});
}
