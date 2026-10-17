import { friction } from "@/content/paper";
import { ShotStrip, type Shot } from "./shot-strip";

// "Where I got lost" as a typewritten timeline. The line runs straight until
// the first problem, wanders off course through the lost stretch, and runs
// straight again once I found my way in.

type Stop = {
  label: string;
  title: string;
  body?: string;
  lost?: boolean; // the line wanders between this stop and the next
  highlight?: boolean;
  screenshots?: Shot[];
};

const stops: Stop[] = [
  { label: "start", title: "Opened paper.design on my phone" },
  ...friction.map((item, index) => ({
    label: `${String(index + 1).padStart(2, "0")} · ${item.tag}`,
    title: item.title,
    body: item.body,
    lost: index < friction.length - 1,
    highlight: "highlight" in item && item.highlight,
    screenshots: "screenshots" in item ? (item.screenshots as readonly Shot[]).slice() : undefined,
  })),
  { label: "then", title: "Found the Welcome file", body: "And fell for Paper. Everything below is about getting people there faster." },
];

// A hand-drawn detour: a deterministic wandering path from top centre to
// bottom centre, mostly swinging left (into the empty label column).
function detour(seed: number) {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const centre = 150;
  const points: [number, number][] = [[centre, 0]];
  const swing = -(55 + rand() * 75); // how far left the detour goes
  const wiggle = 8 + rand() * 14;
  const phase = rand() * Math.PI * 2;
  const steps = 34;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const bump = Math.sin(t * Math.PI) ** 2; // flat at both ends, so it leaves and rejoins the line smoothly
    const x = centre + bump * (swing + Math.sin(t * Math.PI * 3 + phase) * wiggle) + (rand() - 0.5) * 4 * bump;
    points.push([x, t * 100]);
  }
  points.push([centre, 100]);
  return points;
}

// A straight run that wavers slightly, like a pen line drawn by hand: a slow,
// smooth drift rather than a zigzag.
function handLine(seed: number) {
  const points: [number, number][] = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const drift = Math.sin(t * Math.PI) * (Math.sin(t * Math.PI * 2 + seed) * 0.6 + Math.sin(t * Math.PI * 5 + seed * 1.7) * 0.2);
    points.push([10 + drift, t * 100]);
  }
  return points;
}

// Ink that thickens and thins as the pen presses and lifts: the path is drawn
// as short pieces, each with its own width. Round caps hide the joins, and the
// widths stay in screen pixels however far the SVG is stretched.
function InkLine({ points, seed }: { points: [number, number][]; seed: number }) {
  return points.slice(1).map(([x, y], i) => {
    const [px, py] = points[i];
    const width = 1.7 + Math.sin(i * 0.45 + seed) * 0.6 + Math.sin(i * 1.7 + seed * 2.3) * 0.3;
    return (
      <path
        key={i}
        d={`M${px.toFixed(2)} ${py.toFixed(2)} L${x.toFixed(2)} ${y.toFixed(2)}`}
        fill="none"
        stroke="#111"
        strokeWidth={width.toFixed(2)}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    );
  });
}

// An ink dot that isn't a perfect circle.
function blot(seed: number) {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    const k = 5 + Math.sin(a * 2 + seed) * 0.35 + Math.sin(a * 3 + seed * 2.1) * 0.2;
    return [6 + Math.cos(a) * k, 6 + Math.sin(a) * k];
  });
  return `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L")} Z`;
}

function Stroke({ seed, className }: { seed: number; className: string }) {
  return (
    <svg viewBox="0 0 20 100" preserveAspectRatio="none" className={className}>
      <InkLine points={handLine(seed)} seed={seed} />
    </svg>
  );
}

const isDev = process.env.NODE_ENV === "development";

export function LostTimeline() {
  return (
    <ol className="col-span-12 font-paper-mono text-[13px] leading-relaxed md:text-[14px]">
      {stops.map((stop, index) => {
        const last = index === stops.length - 1;
        return (
          <li
            key={stop.title}
            className="grid grid-cols-[5.5rem_2rem_1fr] gap-x-3 md:grid-cols-[1fr_3rem_1fr] md:gap-x-6"
          >
            <p className="pt-0.5 text-right text-muted">
              {stop.highlight ? <span className="rounded bg-ink px-1.5 py-0.5 text-paper">{stop.label}</span> : stop.label}
            </p>

            {/* The line: a dot, then a straight run or a detour down to the next stop,
                with a small gap either side of each dot, like a pen lifted. */}
            <div aria-hidden className="relative">
              <svg viewBox="0 0 12 12" className="absolute top-[0.4rem] left-1/2 size-3 -translate-x-1/2">
                <path d={blot(index * 1.7 + 0.4)} fill="#111" />
              </svg>
              {!last &&
                (stop.lost ? (
                  <svg
                    viewBox="0 0 180 100"
                    preserveAspectRatio="none"
                    className="absolute top-[1.6rem] left-1/2 h-[calc(100%-1.85rem)] w-[180px] -translate-x-[150px] overflow-visible"
                  >
                    <InkLine points={detour(index * 37 + 11)} seed={index * 0.9} />
                  </svg>
                ) : (
                  <Stroke seed={index * 29 + 3} className="absolute top-[1.6rem] left-1/2 h-[calc(100%-1.85rem)] w-5 -translate-x-1/2 overflow-visible" />
                ))}
            </div>

            <div className={`min-w-0 max-w-[28rem] ${last ? "" : stop.lost ? "min-h-64 pb-16" : "pb-14"}`}>
              <p className="font-medium text-ink">{stop.title}</p>
              {stop.body && <p className="mt-1 text-muted">{stop.body}</p>}
              {stop.screenshots ? (
                <ShotStrip shots={stop.screenshots} />
              ) : (
                isDev &&
                index > 0 &&
                !last && (
                  <p className="mt-5 flex aspect-[4/3] w-48 items-center justify-center border border-dashed border-ink/25 text-[11px] text-muted">
                    screenshot · dev only
                  </p>
                )
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
