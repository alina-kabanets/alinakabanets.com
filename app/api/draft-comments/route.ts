import fs from "node:fs";
import path from "node:path";

// Notes left on a blog draft while reading it on the dev server: highlighted
// text plus a comment, saved next to the post as <slug>.comments.json for
// Claude to apply later. Development only; in production it doesn't exist.

type Comment = { id: string; quote: string; text: string; at: string };

const dev = process.env.NODE_ENV === "development";
const dir = path.join(process.cwd(), "content/blog");
const fileFor = (slug: string) => path.join(dir, `${slug.replace(/[^a-z0-9-]/gi, "")}.comments.json`);
const load = (slug: string): Comment[] => {
  try {
    return JSON.parse(fs.readFileSync(fileFor(slug), "utf8"));
  } catch {
    return [];
  }
};
const save = (slug: string, comments: Comment[]) =>
  fs.writeFileSync(fileFor(slug), JSON.stringify(comments, null, 2) + "\n");
const notFound = () => new Response("Not found", { status: 404 });

export async function GET(request: Request) {
  if (!dev) return notFound();
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  return Response.json(load(slug));
}

export async function POST(request: Request) {
  if (!dev) return notFound();
  const { slug, quote, text } = await request.json();
  if (!slug || !quote || !text) return Response.json({ error: "Missing fields" }, { status: 400 });
  const comments = load(slug);
  comments.push({ id: crypto.randomUUID(), quote, text, at: new Date().toISOString() });
  save(slug, comments);
  return Response.json(comments);
}

export async function DELETE(request: Request) {
  if (!dev) return notFound();
  const { slug, id } = await request.json();
  const comments = load(slug).filter((comment) => comment.id !== id);
  save(slug, comments);
  return Response.json(comments);
}
