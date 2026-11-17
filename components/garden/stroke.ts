import { getStroke, getSvgPathFromPoints } from "tldraw";

// Crayon strokes that swell in the middle and thin out at both ends, like a
// real crayon pressed harder mid-stroke. tldraw's getStroke (the same maths
// behind its draw tool) turns a line of points into that filled outline.

type Pt = readonly [number, number];

export function crayonOutline(points: readonly Pt[], width: number, complete = true) {
  if (points.length === 0) return "";
  const length = points.reduce(
    (sum, p, i) => (i === 0 ? 0 : sum + Math.hypot(p[0] - points[i - 1][0], p[1] - points[i - 1][1])),
    0,
  );
  // Short strokes get short tapers, so a dot stays a dot. A loop that ends
  // where it began (a flower's centre) barely tapers, or it shows a gap.
  const first = points[0];
  const end = points[points.length - 1];
  const closed = points.length > 8 && Math.hypot(end[0] - first[0], end[1] - first[1]) < width * 2;
  const taper = closed ? Math.min(6, length * 0.05) : Math.min(36, length * 0.3);
  // Go a little past the start of a loop, like a crayon going round, so the
  // join doesn't show.
  const path = closed ? [...points, ...points.slice(1, Math.ceil(points.length * 0.2))] : points;
  const outline = getStroke(
    path.map(([x, y]) => ({ x, y })),
    {
      size: width * 1.45,
      thinning: 0.55,
      smoothing: 0.6,
      streamline: 0.35,
      simulatePressure: true,
      start: { taper, cap: true },
      end: { taper: complete ? taper * 1.3 : 0, cap: true },
      last: complete,
    },
  );
  return getSvgPathFromPoints(outline, true);
}

// The starter plants are drawn as SVG paths, so walk along each one to get
// points. A jump between samples means the path lifted the pen (a new "M").
export function samplePath(d: string, step = 3): Pt[][] {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  const total = path.getTotalLength();
  const runs: Pt[][] = [];
  let run: Pt[] = [];
  let last: Pt | null = null;
  for (let at = 0; at <= total + step; at += step) {
    const p = path.getPointAtLength(Math.min(at, total));
    const point: Pt = [p.x, p.y];
    if (last && Math.hypot(point[0] - last[0], point[1] - last[1]) > step * 3) {
      if (run.length) runs.push(run);
      run = [];
    }
    run.push(point);
    last = point;
  }
  if (run.length) runs.push(run);
  return runs;
}

/** A filled, tapered outline for a stroke given as an SVG path. */
export function outlineFromPath(d: string, width: number) {
  return samplePath(d)
    .map((run) => crayonOutline(run, width))
    .join(" ");
}
