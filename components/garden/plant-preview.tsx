import { pathFromPoints, type VisitorStroke } from "@/lib/garden";

// A plain SVG drawing of a visitor's plant, sitting on a soil line. Used where
// the full tldraw garden would be too much, like the review queue.
export function PlantPreview({ strokes, className = "" }: { strokes: VisitorStroke[]; className?: string }) {
  const xs = strokes.flatMap((s) => s.points.map((p) => p[0]));
  const ys = strokes.flatMap((s) => s.points.map((p) => p[1]));
  const pad = 16;
  const minX = Math.min(...xs, -60) - pad;
  const maxX = Math.max(...xs, 60) + pad;
  const minY = Math.min(...ys, -60) - pad;
  const maxY = 14;

  return (
    <svg
      className={className}
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      role="img"
      aria-label="A visitor’s crayon plant"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {strokes.map((s, i) => (
          <path key={i} d={pathFromPoints(s.points)} stroke={s.color} strokeWidth={s.width} />
        ))}
        <path d={`M ${minX} 1 L ${maxX} 1`} stroke="#7a5a3f" strokeWidth={3} />
      </g>
    </svg>
  );
}
