import { WAX_FILTER_ID } from "./shapes";

// The garden is lit by the visitor's own clock: a sun by day, a low warm sun
// at dusk, a moon and stars at night. Add ?sky=night (or dawn, day, dusk) to
// the address to see another time of day.

export type Sky = "dawn" | "day" | "dusk" | "night";
const skies: readonly Sky[] = ["dawn", "day", "dusk", "night"];

export function currentSky(): Sky {
  const asked = new URLSearchParams(window.location.search).get("sky");
  if (asked && (skies as readonly string[]).includes(asked)) return asked as Sky;
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

const wax = `url(#${WAX_FILTER_ID})`;
const line = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

function Sun({ y, color }: { y: number; color: string }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    return `M ${Math.cos(a) * 30} ${y + Math.sin(a) * 30} L ${Math.cos(a) * 44} ${y + Math.sin(a) * 44}`;
  }).join(" ");
  return (
    <g filter={wax} {...line} stroke={color}>
      <circle cx={0} cy={y} r={20} strokeWidth={6} />
      <path d={rays} strokeWidth={4} />
    </g>
  );
}

const STARS = [
  [-260, 70],
  [-170, 140],
  [-90, 40],
  [-330, 180],
  [60, 120],
  [-420, 60],
  [-520, 130],
] as const;

export function SkyArt({ sky }: { sky: Sky }) {
  return (
    <svg className="garden-sky-art" viewBox="-600 0 700 260" preserveAspectRatio="xMaxYMin meet" aria-hidden="true">
      {sky === "day" && <Sun y={80} color="#e8b730" />}
      {sky === "dawn" && <Sun y={190} color="#ef9a6a" />}
      {sky === "dusk" && <Sun y={200} color="#e8913a" />}
      {sky === "night" && (
        <g filter={wax} {...line}>
          <path d="M 12 52 A 34 34 0 1 0 12 118 A 26 26 0 1 1 12 52" stroke="#f3e2a0" strokeWidth={5} />
          {STARS.map(([x, y], i) => (
            <path
              key={i}
              className="garden-star"
              style={{ animationDelay: `${i * 0.6}s` }}
              d={`M ${x - 6} ${y} L ${x + 6} ${y} M ${x} ${y - 6} L ${x} ${y + 6}`}
              stroke="#f3e2a0"
              strokeWidth={3}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
