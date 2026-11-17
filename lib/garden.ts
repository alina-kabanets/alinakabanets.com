// Shared by the garden page, its API and the review page: the shape of a
// visitor's plant, how it's checked, and how strokes turn into SVG paths.

import { crayons, gardenerNames } from "@/content/garden";

/** A gardener name for someone who didn't give one, like "Sleepy Fern". */
export function gardenerName() {
  const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];
  return `${pick(gardenerNames.adjectives)} ${pick(gardenerNames.plants)}`;
}

/** One crayon stroke: points relative to the plant's base, soil along y = 0. */
export type VisitorStroke = { color: string; width: number; points: [number, number][] };

export type PlantStatus = "pending" | "approved" | "rejected";

export type VisitorPlant = {
  id: string;
  name: string;
  note: string;
  strokes: VisitorStroke[];
  createdAt: string;
  status: PlantStatus;
};

/** What the public API returns: approved plants only, oldest first. */
export type PublicPlant = Omit<VisitorPlant, "status">;

export const LIMITS = {
  name: 24,
  note: 32,
  strokes: 80,
  pointsPerStroke: 800,
  points: 10_000,
  // The drawing is centred on its base. The plot is 320 × 380, but people
  // can draw past its edges, so allow a whole wide screen's worth.
  minX: -1200,
  maxX: 1200,
  minY: -900,
  maxY: 20,
};

const palette = new Set<string>(crayons.map((c) => c.color));

const cleanText = (value: unknown, max: number) =>
  typeof value === "string"
    ? value
        .replace(/[\u0000-\u001f\u007f]/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, max)
    : "";

/** Checks a submitted plant. Returns the cleaned plant, or an error message. */
export function parseSubmission(
  body: unknown,
): { ok: true; name: string; note: string; strokes: VisitorStroke[] } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request" };
  const { name, note, strokes } = body as Record<string, unknown>;
  if (!Array.isArray(strokes) || strokes.length === 0) return { ok: false, error: "The drawing is empty" };
  if (strokes.length > LIMITS.strokes) return { ok: false, error: "Too many strokes" };

  let total = 0;
  const clean: VisitorStroke[] = [];
  for (const stroke of strokes) {
    if (!stroke || typeof stroke !== "object") return { ok: false, error: "Invalid stroke" };
    const { color, width, points } = stroke as Record<string, unknown>;
    if (typeof color !== "string" || !palette.has(color)) return { ok: false, error: "Unknown crayon" };
    if (typeof width !== "number" || width < 2 || width > 12) return { ok: false, error: "Invalid width" };
    if (!Array.isArray(points) || points.length === 0 || points.length > LIMITS.pointsPerStroke) {
      return { ok: false, error: "Invalid stroke" };
    }
    total += points.length;
    if (total > LIMITS.points) return { ok: false, error: "The drawing is too big" };
    const cleanPoints: [number, number][] = [];
    for (const p of points) {
      if (!Array.isArray(p) || p.length !== 2) return { ok: false, error: "Invalid point" };
      const [x, y] = p;
      if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        !Number.isFinite(x) ||
        !Number.isFinite(y) ||
        x < LIMITS.minX ||
        x > LIMITS.maxX ||
        y < LIMITS.minY ||
        y > LIMITS.maxY
      ) {
        return { ok: false, error: "The drawing is out of bounds" };
      }
      cleanPoints.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
    }
    clean.push({ color, width, points: cleanPoints });
  }

  return {
    ok: true,
    name: cleanText(name, LIMITS.name) || gardenerName(),
    note: cleanText(note, LIMITS.note),
    strokes: clean,
  };
}

/** A smooth path through the points: quadratic curves between midpoints. */
export function pathFromPoints(points: readonly (readonly [number, number])[]) {
  if (points.length === 0) return "";
  const r = (v: number) => Math.round(v * 10) / 10;
  if (points.length < 3) {
    const [a, b = [a[0] + 0.1, a[1]] as const] = points;
    return `M ${r(a[0])} ${r(a[1])} L ${r(b[0])} ${r(b[1])}`;
  }
  let d = `M ${r(points[0][0])} ${r(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const [qx, qy] = points[i + 1];
    d += ` Q ${r(px)} ${r(py)} ${r((px + qx) / 2)} ${r((py + qy) / 2)}`;
  }
  const last = points[points.length - 1];
  return `${d} L ${r(last[0])} ${r(last[1])}`;
}

/** The tag text under a visitor's name. */
export function plantNote(plant: Pick<PublicPlant, "note" | "createdAt">) {
  const date = new Date(plant.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return [plant.note, `planted ${date}`].filter(Boolean).join(" · ");
}

/** A standalone SVG of a plant on its soil line, for preview cards. */
export function plantSvg(strokes: VisitorStroke[], size: { width: number; height: number }) {
  const xs = strokes.flatMap((s) => s.points.map((p) => p[0]));
  const ys = strokes.flatMap((s) => s.points.map((p) => p[1]));
  const pad = 20;
  const minX = Math.min(...xs, -80) - pad;
  const maxX = Math.max(...xs, 80) + pad;
  const minY = Math.min(...ys, -80) - pad;
  const maxY = 16;
  const paths = strokes
    .map(
      (s) =>
        `<path d="${pathFromPoints(s.points)}" stroke="${s.color}" stroke-width="${s.width * 1.2}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join("");
  const soil = `<path d="M ${minX} 1 L ${maxX} 1" stroke="#7a5a3f" stroke-width="4"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}" preserveAspectRatio="xMidYMax meet">${paths}${soil}</svg>`;
}
