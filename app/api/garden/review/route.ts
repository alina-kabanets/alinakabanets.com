import { createHash, timingSafeEqual } from "node:crypto";
import { approvedPlants, pendingPlants, remove, review, storeAvailable } from "@/lib/garden-store";

// Alina's review queue for the garden. Every request needs the password in
// GARDEN_REVIEW_PASSWORD, sent as "Authorization: Bearer <password>".
// On the dev server without it set, the password is "garden".

const password =
  process.env.GARDEN_REVIEW_PASSWORD || (process.env.NODE_ENV === "development" ? "garden" : "");

function authorised(request: Request) {
  if (!password) return false;
  const given = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  // Compare hashes so the comparison takes the same time whatever was typed.
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(password).digest();
  return timingSafeEqual(a, b);
}

const denied = () => Response.json({ error: "Wrong password" }, { status: 401 });
const noStore = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  if (!storeAvailable) return Response.json({ error: "No database" }, { status: 503 });
  if (!authorised(request)) return denied();
  const [pending, approved] = await Promise.all([pendingPlants(), approvedPlants()]);
  return Response.json({ pending, approved }, { headers: noStore });
}

export async function POST(request: Request) {
  if (!storeAvailable) return Response.json({ error: "No database" }, { status: 503 });
  if (!authorised(request)) return denied();
  let body: { id?: unknown; action?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  const action = body.action;
  if (!/^[a-f0-9]{12}$/.test(id)) return Response.json({ error: "Invalid plant" }, { status: 400 });

  let ok = false;
  if (action === "approve" || action === "reject") ok = await review(id, action);
  else if (action === "remove") ok = await remove(id);
  else return Response.json({ error: "Invalid action" }, { status: 400 });

  return ok ? Response.json({ ok: true }, { headers: noStore }) : Response.json({ error: "Not found" }, { status: 404 });
}
