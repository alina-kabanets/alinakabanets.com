import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

// Blog posts are Markdown files in content/blog, each with a small header:
// title, description, status (seedling, growing, evergreen), date, and an
// optional `draft: true`. Drafts show on the dev server only.

export type PostStatus = "seedling" | "growing" | "evergreen";

export type Post = {
  slug: string;
  title: string;
  description: string;
  status: PostStatus;
  date: string;
  draft: boolean;
  html: string;
  minutes: number;
};

const dir = path.join(process.cwd(), "content/blog");
const showDrafts = process.env.NODE_ENV === "development";

// The header between the two `---` lines: `key: value` per line, values
// optionally in quotes. Enough for these posts, without a YAML library.
function parse(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  const meta: Record<string, string> = {};
  for (const line of (match?.[1] ?? "").split("\n")) {
    const at = line.indexOf(":");
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: match ? source.slice(match[0].length) : source };
}

// Curly quotes and apostrophes, like the rest of the site, so posts can be
// written with plain keyboard quotes (Markdown encodes them as &quot; and
// &#39;). Only text between tags is touched.
function smartQuotes(html: string) {
  return html.replace(/>([^<]+)</g, (_, raw: string) =>
    `>${raw
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/(^|[\s(\[{—–-])"/g, "$1“")
      .replace(/"/g, "”")
      .replace(/(^|[\s(\[{—–-])'/g, "$1‘")
      .replace(/'/g, "’")}<`,
  );
}

// Images in posts: real dimensions (read from the PNG/JPEG header) so the
// page doesn't jump while they load, lazy loading, and a class for tall phone
// screenshots so they stay narrow. A paragraph of only images becomes a row.
function imageSize(src: string): [number, number] | null {
  try {
    const buffer = fs.readFileSync(path.join(process.cwd(), "public", decodeURI(src)));
    if (buffer.toString("ascii", 1, 4) === "PNG") return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
    for (let i = 2; i < buffer.length - 9; ) {
      const marker = buffer[i + 1];
      if (marker >= 0xc0 && marker <= 0xc3) return [buffer.readUInt16BE(i + 7), buffer.readUInt16BE(i + 5)];
      i += 2 + buffer.readUInt16BE(i + 2);
    }
  } catch {}
  return null;
}

marked.use({
  renderer: {
    image({ href, text }) {
      const size = imageSize(href);
      const shape = !size ? "is-wide" : size[1] > size[0] * 1.3 ? "is-phone" : size[1] > size[0] * 0.85 ? "is-square" : "is-wide";
      const dims = size ? ` width="${size[0]}" height="${size[1]}"` : "";
      const alt = text.replace(/"/g, "&quot;");
      return `<img src="${href}" alt="${alt}"${dims} loading="lazy" decoding="async" class="${shape}">`;
    },
  },
});

const imageRows = (html: string) =>
  html.replace(/<p>((?:\s*<img [^>]+>\s*)+)<\/p>/g, (_, images: string) => {
    const count = (images.match(/<img /g) ?? []).length;
    return `<div class="post-images" data-count="${count}">${images.trim()}</div>`;
  });

function read(file: string): Post {
  const { meta, body } = parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ""),
    title: meta.title ?? "Untitled",
    description: meta.description ?? "",
    status: (meta.status as PostStatus) ?? "seedling",
    date: meta.date ?? "",
    draft: meta.draft === "true",
    html: imageRows(smartQuotes(marked.parse(body, { async: false }))),
    minutes: Math.max(1, Math.round(words / 220)),
  };
}

export function getPosts(): Post[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map(read)
    .filter((post) => showDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string) {
  return getPosts().find((post) => post.slug === slug);
}

export function formatDate(date: string) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
