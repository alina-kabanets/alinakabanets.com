"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Rectangle2d,
  SVGContainer,
  ShapeUtil,
  T,
  atom,
  useValue,
  type TLShape,
} from "tldraw";
import { seedThankYous, thankYous, type GardenStroke } from "@/content/garden";
import { crayonOutline } from "./stroke";

/** A stroke as drawn: its centre line (for growing) and its tapered outline. */
export type PlantStroke = GardenStroke & { outline: string };

// Every crayon mark goes through this SVG filter (defined once in garden.tsx):
// a wobbly edge plus grainy gaps where the paper shows through.
export const WAX_FILTER_ID = "garden-wax";
const wax = `url(#${WAX_FILTER_ID})`;

export const PLANT = "garden-plant";
export const CRAYON = "garden-crayon";
export const SOIL = "garden-soil";
export const PLOT = "garden-plot";

type Point = { x: number; y: number };

declare module "tldraw" {
  export interface TLGlobalShapePropsMap {
    [PLANT]: {
      strokes: PlantStroke[];
      name: string;
      note: string;
      // The strokes' box relative to the base (0, 0); the shape sits at base + (ox, oy).
      ox: number;
      oy: number;
      w: number;
      h: number;
    };
    [CRAYON]: { color: string; width: number; points: Point[] };
    [SOIL]: { w: number };
    [PLOT]: { w: number; h: number };
  }
}

export type PlantShape = TLShape<typeof PLANT>;
export type CrayonShape = TLShape<typeof CRAYON>;
export type SoilShape = TLShape<typeof SOIL>;
export type PlotShape = TLShape<typeof PLOT>;

const strokeProps = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

/* ---------------------------------------------------------------- growing */

// Asking a plant to grow (redraw itself stroke by stroke) is a tiny piece of
// shared state: the garden writes a request, the plant's component reacts.
const growRequests = atom<Record<string, { nonce: number; delay: number }>>("garden-grow", {});
let growNonce = 0;

export function requestGrow(id: string, delay = 0) {
  growRequests.update((all) => ({ ...all, [id]: { nonce: ++growNonce, delay } }));
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useGrow(id: string, paths: React.RefObject<(SVGPathElement | null)[]>) {
  const request = useValue("grow request", () => growRequests.get()[id], [id]);

  useEffect(() => {
    if (!request || prefersReducedMotion()) return;
    const animations: Animation[] = [];
    let t = request.delay;
    for (const path of paths.current) {
      if (!path) continue;
      const length = path.getTotalLength() + 1;
      // Slow enough to watch the plant being drawn, stroke by stroke.
      const duration = Math.min(1700, 420 + length * 4);
      const dash = `${length} ${length}`;
      animations.push(
        path.animate(
          [
            { strokeDasharray: dash, strokeDashoffset: length },
            { strokeDasharray: dash, strokeDashoffset: 0 },
          ],
          // "backwards" keeps each stroke hidden until its turn comes.
          { duration, delay: t, easing: "cubic-bezier(.45,.05,.4,1)", fill: "backwards" },
        ),
      );
      t += duration * 0.9;
    }
    return () => animations.forEach((a) => a.cancel());
  }, [request, paths]);
}

/* ---------------------------------------------------------------- watering */

// When each plant was last watered, by shape id, and a counter per plant that
// bumps each time it's watered (to play the water drops).
export const wateredAt = atom<Record<string, number>>("garden-watered", {});
const splashes = atom<Record<string, number>>("garden-splash", {});

export function markWatered(id: string, at = Date.now(), splash = false) {
  wateredAt.update((all) => ({ ...all, [id]: at }));
  if (splash) splashes.update((all) => ({ ...all, [id]: (all[id] ?? 0) + 1 }));
}

const HOUR = 3_600_000;
/** 0 = happy, 1 = thirsty (a day without water), 2 = wilting (three days). */
export function thirst(at: number | undefined, now = Date.now()) {
  if (at === undefined) return 0;
  const hours = (now - at) / HOUR;
  return hours > 72 ? 2 : hours > 24 ? 1 : 0;
}

const WILT = [
  { lean: 0, opacity: 1, saturate: 1 },
  // Thirst shows mostly as a lean; colour only fades a little, late on.
  { lean: 6, opacity: 1, saturate: 0.92 },
  { lean: 12, opacity: 0.92, saturate: 0.75 },
];

/* ---------------------------------------------------------------- marker */

// A small seeded random, so every tag wobbles differently but the same way on every visit.
function seeded(key: string) {
  let s = 0;
  for (const c of key) s = (s * 31 + c.charCodeAt(0)) % 233280;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280 - 0.5) * 2.5;
}

export const TAG = { x: 22, y: -50, h: 38, stick: 40 };

export function estimateTagWidth(name: string, note: string) {
  return Math.max(name.length * 7, note.length * 6) + 34;
}

function PlantTag({ id, name, note }: { id: string; name: string; note: string }) {
  const nameRef = useRef<SVGTextElement>(null);
  const noteRef = useRef<SVGTextElement>(null);
  const [w, setW] = useState(() => estimateTagWidth(name, note));

  useLayoutEffect(() => {
    const measured = Math.max(
      nameRef.current?.getComputedTextLength() ?? 0,
      noteRef.current?.getComputedTextLength() ?? 0,
    );
    if (measured > 0) setW(Math.ceil(measured) + 30);
  }, [name, note]);

  const j = seeded(id);
  const h = TAG.h;
  const n = () => j().toFixed(1);
  const outline =
    `M${n()} ${n()} C ${w * 0.35} ${-1 + j()} ${w * 0.7} ${1 + j()} ${w + j()} ${n()}` +
    ` C ${w + 1 + j()} ${h * 0.4} ${w - 1 + j()} ${h * 0.7} ${w + j()} ${h + j()}` +
    ` C ${w * 0.65} ${h + 1 + j()} ${w * 0.3} ${h - 1 + j()} ${n()} ${h + j()}` +
    ` C ${-1 + j()} ${h * 0.65} ${1 + j()} ${h * 0.3} ${n()} ${n()} Z`;
  const tilt = (seeded(`${id}-tilt`)() * 1.4).toFixed(2);

  return (
    <g transform={`translate(${TAG.x} ${TAG.y}) rotate(${tilt})`}>
      <g filter={wax} {...strokeProps}>
        {/* The filter only covers its group's box. A straight stick is almost
            zero-width, which would shave the crayon down to a sliver, so an
            invisible rectangle gives the group some width. */}
        <rect x={4} y={h - 4} width={28} height={TAG.stick + 8} fill="none" />
        <path d={`M18 ${h - 2} C 19 ${h + 14} 17 ${h + 26} 18 ${h + TAG.stick}`} stroke="#b08d63" strokeWidth={6} />
      </g>
      {/* A solid card under the crayon outline, so the wax grain doesn't
          punch holes in it (they'd show against the night sky). */}
      <path d={outline} fill="#fdfaf3" />
      <g filter={wax} {...strokeProps}>
        <path d={outline} stroke="#8a6f52" strokeWidth={2.6} />
        <circle cx={w - 10} cy={8} r={2} stroke="#8a6f52" strokeWidth={1.6} />
      </g>
      <text ref={nameRef} className="garden-tag-name" x={10} y={16}>
        {name}
      </text>
      <text ref={noteRef} className="garden-tag-note" x={10} y={30}>
        {note}
      </text>
    </g>
  );
}

/* ---------------------------------------------------------------- water drops */

// A few blue crayon dashes falling onto the plant when someone waters it.
const DROPS = [-22, -8, 6, 18, 30];
function WaterDrops({ top }: { top: number }) {
  return (
    <g className="garden-drops" filter={wax}>
      {DROPS.map((x, i) => (
        <path
          key={i}
          d={`M ${x} ${top - 46 + (i % 2) * 10} l -2 10`}
          stroke="#5b8fd6"
          strokeWidth={4}
          strokeLinecap="round"
          style={{ animationDelay: `${i * 70}ms` }}
        />
      ))}
    </g>
  );
}

/* ---------------------------------------------------------------- speech bubble */

// The plant thanks whoever watered it, in a little crayon speech bubble that
// pops up above it and fades away.
const BUBBLE_H = 30;
const BUBBLE_MIN_TOP = -395; // the top of the garden's view; tall plants keep it on screen

function ThankYou({ id, top, nonce, seed }: { id: string; top: number; nonce: number; seed: boolean }) {
  const phrases = seed ? seedThankYous : thankYous;
  const text = phrases[(nonce + id.length) % phrases.length];
  const w = Math.round(text.length * 6.6 + 26);
  const y = Math.max(top - BUBBLE_H - 22, BUBBLE_MIN_TOP);
  const j = seeded(`${id}-${nonce}`);
  const h = BUBBLE_H;
  const n = () => j().toFixed(1);
  // A wobbly rounded box with a little tail pointing down at the plant.
  const outline =
    `M ${8 + j()} ${n()} L ${w - 8 + j()} ${n()} Q ${w} 0 ${w + j()} ${8 + j()}` +
    ` L ${w + j()} ${h - 8 + j()} Q ${w} ${h} ${w - 8 + j()} ${h + j()}` +
    ` L ${w / 2 + 7} ${h} L ${w / 2 - 2} ${h + 9} L ${w / 2 - 6} ${h}` +
    ` L ${8 + j()} ${h + j()} Q 0 ${h} ${n()} ${h - 8 + j()} L ${n()} ${8 + j()} Q 0 0 ${8 + j()} ${n()} Z`;
  return (
    <g className="garden-bubble" transform={`translate(${-w / 2} ${y})`}>
      <path d={outline} fill="#fdfaf3" />
      <g filter={wax} {...strokeProps}>
        <path d={outline} stroke="#8a6f52" strokeWidth={2.2} />
      </g>
      <text className="garden-bubble-text" x={w / 2} y={19.5} textAnchor="middle">
        {text}
      </text>
    </g>
  );
}

/* ---------------------------------------------------------------- plant */

function Plant({ shape }: { shape: PlantShape }) {
  const { strokes, name, note, ox, oy } = shape.props;
  const paths = useRef<(SVGPathElement | null)[]>([]);
  useGrow(shape.id, paths);
  const swaySeed = seeded(`${shape.id}-sway`);
  const maskBase = `grow-${shape.id.replace(/[^a-zA-Z0-9-]/g, "")}`;
  const level = useValue("thirst", () => thirst(wateredAt.get()[shape.id]), [shape.id]);
  const splash = useValue("splash", () => splashes.get()[shape.id] ?? 0, [shape.id]);
  const wilt = WILT[level];
  // Each plant leans its own way when it wilts.
  const leanSide = seeded(`${shape.id}-lean`)() > 0 ? 1 : -1;

  return (
    <SVGContainer style={{ overflow: "visible" }}>
      <g transform={`translate(${-ox} ${-oy})`}>
        {splash > 0 && <WaterDrops key={splash} top={oy} />}
        {splash > 0 && (
          <ThankYou key={`t${splash}`} id={shape.id} top={oy} nonce={splash} seed={shape.id.includes("seed-")} />
        )}
        <g
          className="garden-wilt"
          style={{
            transform: `rotate(${wilt.lean * leanSide}deg)`,
            opacity: wilt.opacity,
            filter: wilt.saturate < 1 ? `saturate(${wilt.saturate})` : undefined,
          }}
        >
        <g
          className="garden-sway"
          style={{
            animationDuration: `${(6 + swaySeed()).toFixed(2)}s`,
            animationDelay: `${(swaySeed() * 2).toFixed(2)}s`,
          }}
        >
          {/* Each stroke is a filled, tapered outline. Growing animates its
              centre line inside a mask, which reveals the outline as it goes. */}
          <defs>
            {strokes.map((stroke, i) => (
              <mask key={i} id={`${maskBase}-${i}`} maskUnits="userSpaceOnUse" x={-4000} y={-4000} width={8000} height={8000}>
                <path
                  ref={(el) => {
                    paths.current[i] = el;
                  }}
                  d={stroke.d}
                  stroke="#fff"
                  strokeWidth={stroke.width * 3}
                  {...strokeProps}
                />
              </mask>
            ))}
          </defs>
          <g filter={wax}>
            {strokes.map((stroke, i) => (
              <path key={i} d={stroke.outline} fill={stroke.color} mask={`url(#${maskBase}-${i})`} />
            ))}
          </g>
        </g>
        </g>
        <PlantTag id={shape.id} name={name} note={note} />
      </g>
    </SVGContainer>
  );
}

export class PlantShapeUtil extends ShapeUtil<PlantShape> {
  static override type = PLANT;
  static override props = {
    strokes: T.arrayOf(T.object({ d: T.string, color: T.string, width: T.number, outline: T.string })),
    name: T.string,
    note: T.string,
    ox: T.number,
    oy: T.number,
    w: T.number,
    h: T.number,
  };

  getDefaultProps(): PlantShape["props"] {
    return { strokes: [], name: "", note: "", ox: 0, oy: 0, w: 1, h: 1 };
  }
  getGeometry(shape: PlantShape) {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true });
  }
  component(shape: PlantShape) {
    return <Plant shape={shape} />;
  }
  getIndicatorPath() {
    return undefined;
  }
  override canResize() {
    return false;
  }
}

/* ---------------------------------------------------------------- crayon */

export class CrayonShapeUtil extends ShapeUtil<CrayonShape> {
  static override type = CRAYON;
  static override props = {
    color: T.string,
    width: T.number,
    points: T.arrayOf(T.object({ x: T.number, y: T.number })),
  };

  getDefaultProps(): CrayonShape["props"] {
    return { color: "#4f9a4a", width: 6, points: [] };
  }
  getGeometry(shape: CrayonShape) {
    const xs = shape.props.points.map((p) => p.x);
    const ys = shape.props.points.map((p) => p.y);
    return new Rectangle2d({
      x: Math.min(0, ...xs),
      y: Math.min(0, ...ys),
      width: Math.max(1, Math.max(...xs) - Math.min(...xs)),
      height: Math.max(1, Math.max(...ys) - Math.min(...ys)),
      isFilled: false,
    });
  }
  component(shape: CrayonShape) {
    return (
      <SVGContainer style={{ overflow: "visible" }}>
        <path
          d={crayonOutline(
            shape.props.points.map((p) => [p.x, p.y] as const),
            shape.props.width,
            false,
          )}
          fill={shape.props.color}
          filter={wax}
        />
      </SVGContainer>
    );
  }
  getIndicatorPath() {
    return undefined;
  }
}

/* ---------------------------------------------------------------- soil */

// The soil sits 15 units below the shape's top, so placing the shape at
// y = -15 puts the line along y = 0.
export const SOIL_OFFSET = 15;

function soilPath(w: number) {
  const j = seeded("soil");
  let d = `M 0 ${SOIL_OFFSET}`;
  for (let x = 140; x <= w; x += 140) {
    d += ` S ${x - 70} ${SOIL_OFFSET + j() * 1.6} ${x} ${SOIL_OFFSET + j() * 1.2}`;
  }
  return d;
}

function soilSpecks(w: number) {
  const j = seeded("specks");
  let d = "";
  for (let x = 30; x < w; x += 90 + Math.abs(j()) * 60) {
    d += ` M ${Math.round(x)} ${SOIL_OFFSET + 14 + j() * 2} l ${10 + Math.abs(j()) * 6} ${j().toFixed(1)}`;
  }
  return d;
}

export class SoilShapeUtil extends ShapeUtil<SoilShape> {
  static override type = SOIL;
  static override props = { w: T.number };

  getDefaultProps(): SoilShape["props"] {
    return { w: 4000 };
  }
  getGeometry(shape: SoilShape) {
    return new Rectangle2d({ width: shape.props.w, height: SOIL_OFFSET * 2 + 10, isFilled: false });
  }
  component(shape: SoilShape) {
    return (
      <SVGContainer style={{ overflow: "visible" }}>
        <g filter={wax} {...strokeProps}>
          <path d={soilPath(shape.props.w)} stroke="var(--garden-soil)" strokeWidth={5} />
          <path d={soilSpecks(shape.props.w)} stroke="var(--garden-soil)" strokeWidth={3} opacity={0.7} />
        </g>
      </SVGContainer>
    );
  }
  getIndicatorPath() {
    return undefined;
  }
  override canResize() {
    return false;
  }
}

/* ---------------------------------------------------------------- plot */

// Where the visitor draws: a dashed patch above the soil.
export class PlotShapeUtil extends ShapeUtil<PlotShape> {
  static override type = PLOT;
  static override props = { w: T.number, h: T.number };

  getDefaultProps(): PlotShape["props"] {
    return { w: 320, h: 380 };
  }
  getGeometry(shape: PlotShape) {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: false });
  }
  component(shape: PlotShape) {
    const { w, h } = shape.props;
    return (
      <SVGContainer style={{ overflow: "visible" }}>
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={14}
          fill="none"
          stroke="#1111112e"
          strokeWidth={1.5}
          strokeDasharray="6 8"
        />
        <text className="garden-plot-hint" x={w / 2} y={28} textAnchor="middle">
          Draw your plant here. It grows from the soil.
        </text>
      </SVGContainer>
    );
  }
  getIndicatorPath() {
    return undefined;
  }
}
