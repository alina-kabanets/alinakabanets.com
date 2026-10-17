import { profile } from "@/content/profile";

// Receives a note from the /paper notepad and emails it to Alina via Resend.
// Nothing is stored. Needs RESEND_API_KEY; without it, answers 503.

const MAX_MESSAGE = 3000;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

// Best effort only: each server instance keeps its own count.
const recent = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

const clean = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: a field people never see. Bots fill it; pretend it worked.
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const message = clean(body.message, MAX_MESSAGE);
  const name = clean(body.name, 80);
  const email = clean(body.email, 120);

  if (message.length < 2) return Response.json({ error: "The note is empty" }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "That email address doesn’t look right" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return Response.json({ error: "Too many notes at once. Try again in a minute" }, { status: 429 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return Response.json({ error: "Notes aren’t switched on yet" }, { status: 503 });

  const from = name || "Someone";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Notes on Paper <onboarding@resend.dev>",
      to: [profile.email],
      ...(email ? { reply_to: email } : {}),
      subject: `A note from /paper${name ? `, from ${name}` : ""}`,
      text: `${message}\n\n— ${from}${email ? ` (${email})` : ""}\n\nSent from alinakabanets.com/paper`,
    }),
  });

  if (!response.ok) return Response.json({ error: "Couldn’t send" }, { status: 502 });
  return Response.json({ ok: true });
}
