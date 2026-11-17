"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  HandTool,
  TldrawEditor,
  createShapeId,
  useValue,
  type Editor,
  type TLCameraOptions,
  type TLShapeId,
} from "tldraw";
import "@tldraw/editor/editor.css";
import "./garden.css";
import { crayons, gardenPage, gardenShare, starterPlants, type GardenStroke } from "@/content/garden";
import { gardenerName, pathFromPoints, plantNote, type PlantStatus, type PublicPlant, type VisitorStroke } from "@/lib/garden";
import { CrayonTool, currentCrayon } from "./crayon-tool";
import { SkyArt, currentSky } from "./sky";
import { crayonOutline, outlineFromPath } from "./stroke";
import {
  CRAYON,
  CrayonShapeUtil,
  PLANT,
  PLOT,
  PlantShapeUtil,
  PlotShapeUtil,
  SOIL,
  SOIL_OFFSET,
  SoilShapeUtil,
  TAG,
  WAX_FILTER_ID,
  estimateTagWidth,
  prefersReducedMotion,
  markWatered,
  requestGrow,
  type CrayonShape,
  type PlantStroke,
  type SoilShape,
} from "./shapes";

// Defined outside the component so the editor isn't recreated on each render.
const shapeUtils = [PlantShapeUtil, CrayonShapeUtil, SoilShapeUtil, PlotShapeUtil];
const tools = [HandTool, CrayonTool];

/* ---------------------------------------------------------------- layout */

// Garden units: the soil runs along y = 0, plants grow into negative y.
const GAP = 240; // between one plant's base and the next
const TOP = -400; // the highest point the camera shows
const BOTTOM = 70; // a little earth under the soil line
const PLOT_W = 320;
const PLOT_H = 380;
const SOIL_ID = createShapeId("soil");
const PLOT_ID = createShapeId("plot");
const FIRST_VISITOR_X = Math.max(...starterPlants.map((p) => p.x)) + GAP;

// A seed waiting for review: a little mound with a sprout.
const SEED: GardenStroke[] = [
  { d: "M -26 1 C -16 -16 16 -16 26 1", color: "#7a5a3f", width: 4 },
  { d: "M 0 -12 C -2 -22 3 -30 8 -33", color: "#6fae4a", width: 3 },
  { d: "M 4 -27 C 10 -32 15 -30 17 -26 C 11 -24 7 -25 4 -27", color: "#6fae4a", width: 3 },
];

/* ---------------------------------------------------------------- the visitor's own plants */

// Plants this browser planted, so a visitor sees their seed until it's reviewed.
const MINE_KEY = "garden:mine:v1";
type MyPlant = { id: string; name: string; createdAt: string };

function loadMine(): MyPlant[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(MINE_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as MyPlant[]).filter((p) => typeof p?.id === "string") : [];
  } catch {
    return [];
  }
}

function saveMine(plants: MyPlant[]) {
  try {
    window.localStorage.setItem(MINE_KEY, JSON.stringify(plants.slice(-20)));
  } catch {
    // Private mode or full storage: the seed shows until the page closes.
  }
}

/* ---------------------------------------------------------------- shapes */

// The box around a plant's strokes and its marker, relative to its base.
function measurePlant(strokes: readonly GardenStroke[], name: string, note: string) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("style", "position:absolute;width:0;height:0;overflow:hidden;visibility:hidden");
  document.body.appendChild(svg);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const stroke of strokes) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", stroke.d);
    svg.appendChild(path);
    const box = path.getBBox();
    const pad = stroke.width * 0.75 + 4; // half the swollen stroke plus the wax wobble
    minX = Math.min(minX, box.x - pad);
    minY = Math.min(minY, box.y - pad);
    maxX = Math.max(maxX, box.x + box.width + pad);
    maxY = Math.max(maxY, box.y + box.height + pad);
  }
  svg.remove();
  // The marker sits to the right of the base and its stick goes into the soil.
  minX = Math.min(minX, TAG.x);
  minY = Math.min(minY, TAG.y);
  maxX = Math.max(maxX, TAG.x + estimateTagWidth(name, note));
  maxY = Math.max(maxY, TAG.y + TAG.h + TAG.stick);
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

function plantShape(id: string, baseX: number, strokes: PlantStroke[], name: string, note: string) {
  const box = measurePlant(strokes, name, note);
  return {
    id: createShapeId(id),
    type: PLANT,
    x: baseX + box.x,
    y: box.y,
    isLocked: true,
    props: { strokes, name, note, ox: box.x, oy: box.y, w: box.w, h: box.h },
  } as const;
}

// Visitors' strokes arrive as points; starter plants and seeds as SVG paths.
const fromPoints = (strokes: VisitorStroke[]): PlantStroke[] =>
  strokes.map((s) => ({
    d: pathFromPoints(s.points),
    outline: crayonOutline(s.points, s.width),
    color: s.color,
    width: s.width,
  }));
const fromPaths = (strokes: readonly GardenStroke[]): PlantStroke[] =>
  strokes.map((s) => ({ ...s, outline: outlineFromPath(s.d, s.width) }));

/* ---------------------------------------------------------------- camera */

function cameraOptions(gardenEnd: number): Partial<TLCameraOptions> {
  return {
    wheelBehavior: "pan",
    // Zoom is fixed: the garden always fills the strip's height.
    zoomSteps: [1],
    constraints: {
      bounds: { x: 0, y: TOP, w: gardenEnd, h: BOTTOM - TOP },
      padding: { x: 0, y: 0 },
      origin: { x: 0, y: 0.5 },
      initialZoom: "fit-y",
      baseZoom: "fit-y",
      behavior: { x: "contain", y: "fixed" },
    },
  };
}

/* ---------------------------------------------------------------- icons */

// A little hand-drawn watering can for the tray button, spout to the left.
// The same drawing is the cursor while watering (see garden.css).
const CAN_PATHS = [
  // body, slightly tapered, with a wobble
  "M14.2 10.4 C14.1 9.3 14.8 8.7 15.9 8.8 L25.4 8.6 C26.5 8.6 27.1 9.3 27 10.4 L26.1 22.3 C26 23.3 25.3 23.9 24.3 23.8 L16.4 23.9 C15.4 23.9 14.8 23.3 14.7 22.3 Z",
  // a painted band
  "M14.6 13.2 C18 13.6 22.5 13 26.7 13.4",
  // handle
  "M17.6 8.7 C17.2 3.6 24.6 3.1 24.8 8.6",
  // spout and its sprinkler head
  "M14.5 18.6 C11.5 16.4 9.2 13.9 6.8 11.1",
  "M3.6 9.6 C4.9 7.9 6.4 6.9 8.3 6.5 L9 10.3 C7.2 10.8 5.7 11.6 4.6 12.6 Z",
  // drops
  "M2.4 15.2 l-0.5 1.6 M5.2 15.9 l-0.5 1.6 M3.4 19 l-0.5 1.6",
];

function WateringCan() {
  return (
    <svg
      width="26"
      height="21"
      viewBox="0 0 30 25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {CAN_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- component */

type Mode = "view" | "draw" | "label" | "sending" | "water";

export default function Garden() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  // The garden only renders in the browser, so the visitor's clock is known here.
  const [sky] = useState(currentSky);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  // Offered as the placeholder; used if the name is left empty.
  const [suggestedName, setSuggestedName] = useState(gardenerName);
  const [message, setMessage] = useState<string | null>(null);
  const [canPlant, setCanPlant] = useState(true);
  const [canWater, setCanWater] = useState(false);
  // Set when one of this visitor's plants has sprouted, to offer its link.
  const [shareId, setShareId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const nextX = useRef(FIRST_VISITOR_X);
  // Counts editor mounts, so a slow fetch from an earlier mount is ignored.
  const mountCount = useRef(0);
  const hovered = useRef<TLShapeId | null>(null);
  const colour = useValue("crayon colour", () => currentCrayon.get(), []);
  const strokeCount = useValue(
    "stroke count",
    () => (editor ? editor.getCurrentPageShapes().filter((s) => s.type === CRAYON).length : 0),
    [editor],
  );

  // While drawing, the garden runs on past the plot so the camera can centre it.
  const updateBounds = useCallback((ed: Editor, drawing = false) => {
    const end = nextX.current + (drawing ? 2000 : PLOT_W);
    ed.setCameraOptions(cameraOptions(end));
    ed.run(
      () => {
        ed.updateShape<SoilShape>({ id: SOIL_ID, type: SOIL, x: -3000, props: { w: end + 6000 } });
        ed.bringToFront([SOIL_ID]);
      },
      { history: "ignore", ignoreShapeLock: true },
    );
  }, []);

  // Adds plants at the end of the garden, one GAP apart, and grows them in.
  const addPlants = useCallback(
    (ed: Editor, plants: { id: string; strokes: PlantStroke[]; name: string; note: string }[], delay = 0) => {
      const shapes = plants.map((p) => {
        const shape = plantShape(p.id, nextX.current, p.strokes, p.name, p.note);
        nextX.current += GAP;
        return shape;
      });
      ed.run(() => ed.createShapes(shapes), { history: "ignore" });
      updateBounds(ed);
      shapes.forEach((s, i) => requestGrow(s.id, delay + i * 380));
    },
    [updateBounds],
  );

  // Visitors' plants come from the API: approved ones for everyone, plus a
  // seed for each of this browser's plants still waiting for review.
  const loadVisitors = useCallback(
    async (ed: Editor, mount: number) => {
      let approved: PublicPlant[] = [];
      let watered: Record<string, number> | null = null;
      try {
        const res = await fetch("/api/garden");
        if (res.status === 503) setCanPlant(false);
        if (res.ok) {
          const data = await res.json();
          approved = data.plants ?? [];
          watered = data.watered ?? {};
        }
      } catch {
        // Offline or the API is down: the starter plants still show.
      }

      let mine = loadMine();
      if (mine.length > 0) {
        let statuses: Record<string, PlantStatus> | null = null;
        try {
          const res = await fetch(`/api/garden?mine=${mine.map((p) => p.id).join(",")}`);
          if (res.ok) statuses = (await res.json()).mine ?? {};
        } catch {
          // Couldn't check: keep showing the seeds as they were.
        }
        if (statuses) {
          const known = statuses;
          const sprouted = mine.find((p) => known[p.id] === "approved");
          if (sprouted) {
            setMessage(gardenPage.sprouted);
            setShareId(sprouted.id);
          }
          // Only seeds still waiting stay; reviewed (or unknown) plants are forgotten.
          mine = mine.filter((p) => known[p.id] === "pending");
          saveMine(mine);
        }
      }

      if (mount !== mountCount.current || ed.isDisposed) return;
      const starterCount = starterPlants.length;
      addPlants(
        ed,
        [
          ...approved.map((p) => ({ id: p.id, strokes: fromPoints(p.strokes), name: p.name, note: plantNote(p) })),
          ...mine.map((p) => ({ id: `seed-${p.id}`, strokes: fromPaths(SEED), name: p.name, note: gardenPage.sprouting })),
        ],
        300 + starterCount * 380,
      );

      // How thirsty each plant is. A plant nobody has watered yet counts from
      // when it was planted; the starters count from today.
      if (watered) {
        const known = watered;
        const now = Date.now();
        for (const p of starterPlants) markWatered(createShapeId(p.id), known[p.id] ?? now);
        for (const p of approved) markWatered(createShapeId(p.id), known[p.id] ?? Date.parse(p.createdAt));
        setCanWater(true);
      }
    },
    [addPlants],
  );

  const onMount = useCallback(
    (ed: Editor) => {
      const mount = ++mountCount.current;
      nextX.current = FIRST_VISITOR_X;
      const starters = starterPlants.map((p) =>
        plantShape(p.id, p.x, fromPaths(p.strokes), p.name, `No. ${String(p.number).padStart(4, "0")} · ${p.note}`),
      );
      ed.run(
        () => {
          ed.createShapes(starters);
          ed.createShape({
            id: SOIL_ID,
            type: SOIL,
            x: -3000,
            y: -SOIL_OFFSET,
            isLocked: true,
            props: { w: 6000 },
          });
        },
        { history: "ignore" },
      );
      ed.clearHistory();
      updateBounds(ed);
      ed.setCamera(ed.getCamera(), { reset: true, immediate: true });

      // Plants grow in one after another, left to right.
      starters.forEach((p, i) => requestGrow(p.id, 300 + i * 380));
      setEditor(ed);
      void loadVisitors(ed, mount);
    },
    [updateBounds, loadVisitors],
  );

  /* ---- hover or tap a plant to watch it grow again */

  const plantAt = useCallback(
    (clientX: number, clientY: number) => {
      if (!editor) return null;
      const point = editor.screenToPage({ x: clientX, y: clientY });
      return (
        editor.getShapeAtPoint(point, {
          hitInside: true,
          hitLocked: true, // plants are locked so nobody can move them
          margin: 6,
          filter: (s) => s.type === PLANT,
        })?.id ?? null
      );
    },
    [editor],
  );

  // A plant replays once the pointer rests on it for a moment, not when the
  // pointer just passes over on its way somewhere else.
  const hoverTimer = useRef<number | undefined>(undefined);
  const onPointerMove = (e: React.PointerEvent) => {
    if (mode !== "view" || e.pointerType !== "mouse" || e.buttons !== 0) return;
    const id = plantAt(e.clientX, e.clientY);
    if (id === hovered.current) return;
    hovered.current = id;
    window.clearTimeout(hoverTimer.current);
    if (id) hoverTimer.current = window.setTimeout(() => requestGrow(id), 450);
  };
  const onPointerLeave = () => {
    hovered.current = null;
    window.clearTimeout(hoverTimer.current);
  };

  const tapStart = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    tapStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = tapStart.current;
    tapStart.current = null;
    if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > 8) return; // that was a drag
    const id = plantAt(e.clientX, e.clientY);
    if (!id) return;
    if (mode === "water") void waterPlant(id);
    else if (mode === "view" && e.pointerType !== "mouse") requestGrow(id);
  };

  /* ---- the shared watering can */

  const waterPlant = async (shapeId: TLShapeId) => {
    const id = shapeId.replace(/^shape:/, "");
    markWatered(shapeId, Date.now(), true);
    // Seeds only exist in their planter's browser, so their watering stays here.
    if (id.startsWith("seed-")) {
      return; // the seed says thanks in its own bubble
    }
    try {
      const res = await fetch("/api/garden/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.status === 429) setMessage((await res.json()).error);
      // Thanks come from the plant itself, in a speech bubble.
    } catch {
      // The drops still fell here; it just won't be shared this time.
    }
  };

  const startWatering = () => {
    setMessage(gardenPage.wateringHint);
    setMode("water");
    editor?.setCursor({ type: "pointer", rotation: 0 });
  };
  const stopWatering = () => {
    setMessage(null);
    setMode("view");
    editor?.setCursor({ type: "grab", rotation: 0 });
  };

  /* ---- planting */

  const startPlanting = (pick?: string) => {
    if (!editor) return;
    if (!canPlant) {
      setMessage(gardenPage.resting);
      return;
    }
    if (pick) currentCrayon.set(pick);
    setMessage(null);
    const x = nextX.current;
    editor.run(
      () => {
        editor.createShape({
          id: PLOT_ID,
          type: PLOT,
          x: x - PLOT_W / 2,
          y: -PLOT_H - 6,
          isLocked: true,
          props: { w: PLOT_W, h: PLOT_H },
        });
      },
      { history: "ignore" },
    );
    editor.clearHistory();
    updateBounds(editor, true);
    editor.centerOnPoint(
      { x, y: editor.getViewportPageBounds().center.y },
      prefersReducedMotion() ? undefined : { animation: { duration: 600 } },
    );
    editor.setCurrentTool("crayon");
    setMode("draw");
  };

  const clearDrawing = (ed: Editor) => {
    const ids = ed.getCurrentPageShapes().filter((s) => s.type === CRAYON).map((s) => s.id);
    ed.run(() => ed.deleteShapes([...ids, PLOT_ID]), { history: "ignore", ignoreShapeLock: true });
    ed.clearHistory();
  };

  const cancel = () => {
    if (!editor) return;
    clearDrawing(editor);
    updateBounds(editor);
    editor.setCurrentTool("hand");
    setMode("view");
  };

  const plant = async () => {
    if (!editor) return;
    const marks = editor.getCurrentPageShapes().filter((s): s is CrayonShape => s.type === CRAYON);
    if (marks.length === 0) return;

    // Set the drawing down on the soil: centred on its base, its lowest point
    // just under the soil line. The server gets points; paths are made here.
    const all = marks.map((m) => m.props.points.map((p) => ({ x: m.x + p.x, y: m.y + p.y })));
    const flat = all.flat();
    const centre = (Math.min(...flat.map((p) => p.x)) + Math.max(...flat.map((p) => p.x))) / 2;
    const bottom = Math.max(...flat.map((p) => p.y));
    const strokes: VisitorStroke[] = marks.map((m, i) => ({
      color: m.props.color,
      width: m.props.width,
      points: all[i].map((p) => [Math.round((p.x - centre) * 10) / 10, Math.round((p.y - bottom + 2) * 10) / 10]),
    }));

    setMode("sending");
    let created: { id: string; createdAt: string } | null = null;
    let error: string | null = null;
    try {
      const res = await fetch("/api/garden", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || suggestedName, note, strokes }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) created = body;
      else error = res.status === 503 ? gardenPage.resting : body.error || gardenPage.failed;
    } catch {
      error = gardenPage.failed;
    }

    if (!created) {
      setMode("label");
      setMessage(error);
      return;
    }

    const shownName = name.trim() || suggestedName;
    saveMine([...loadMine(), { id: created.id, name: shownName, createdAt: created.createdAt }]);
    clearDrawing(editor);
    addPlants(
      editor,
      [{ id: `seed-${created.id}`, strokes: fromPaths(SEED), name: shownName, note: gardenPage.sprouting }],
      200,
    );

    editor.setCurrentTool("hand");
    setName("");
    setNote("");
    setSuggestedName(gardenerName());
    setMode("view");
    setMessage(gardenPage.seedPlanted);
  };

  // Escape backs out of drawing or watering.
  useEffect(() => {
    if (mode === "view" || mode === "sending") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mode === "label") setMode("draw");
      else if (mode === "water") stopWatering();
      else cancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className="garden" aria-label="A garden of crayon plants drawn by visitors">
      {/* The crayon texture, shared by every mark on the canvas. */}
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <filter id={WAX_FILTER_ID} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="9" result="g" />
          <feColorMatrix
            in="g"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75"
            result="holes"
          />
          <feComposite in="d" in2="holes" operator="in" />
        </filter>
      </svg>

      <div
        className="garden-canvas"
        data-mode={mode}
        data-sky={sky}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <SkyArt sky={sky} />
        <TldrawEditor
          shapeUtils={shapeUtils}
          tools={tools}
          initialState="hand"
          onMount={onMount}
          autoFocus={false}
          components={{ Background: null }}
        />
      </div>

      <p className="garden-note" aria-live="polite">
        {message ?? `${gardenPage.hint} · ${gardenPage.madeWith}`}
        {shareId && message === gardenPage.sprouted && (
          <>
            {" "}
            <button
              type="button"
              className="link"
              data-umami-event="garden-share"
              onClick={async () => {
                const url = `${window.location.origin}/garden/p/${shareId}`;
                if (navigator.share) {
                  await navigator.share({ url, text: gardenShare.shareText }).catch(() => {});
                } else {
                  await navigator.clipboard.writeText(url);
                  setCopied(true);
                }
              }}
            >
              {copied ? gardenShare.copied : gardenShare.share}
            </button>
          </>
        )}
      </p>

      <div className="garden-bar">
        {mode === "label" || mode === "sending" ? (
          <form
            className="garden-tray garden-form"
            onSubmit={(e) => {
              e.preventDefault();
              void plant();
            }}
          >
            <label>
              <span>Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={24} placeholder={suggestedName} autoFocus />
            </label>
            <label>
              <span>A short note</span>
              <input value={note} onChange={(e) => setNote(e.target.value)} maxLength={32} placeholder="optional" />
            </label>
            <button type="button" className="garden-quiet" onClick={() => setMode("draw")} disabled={mode === "sending"}>
              Back
            </button>
            <button type="submit" className="garden-primary" disabled={mode === "sending"}>
              {mode === "sending" ? "Planting…" : "Plant it"}
            </button>
          </form>
        ) : (
          <div className="garden-tray" data-compact={mode === "water" || undefined}>
            <div className="garden-crayons" role="group" aria-label="Crayons" hidden={mode === "water"}>
              {crayons.map((c, i) => (
                <button
                  key={c.color}
                  type="button"
                  className="garden-crayon"
                  aria-label={c.name}
                  aria-pressed={mode === "draw" && colour === c.color}
                  style={{ "--crayon": c.color, height: 20 + ((i * 7) % 12) } as React.CSSProperties}
                  onClick={() => (mode === "view" ? startPlanting(c.color) : currentCrayon.set(c.color))}
                />
              ))}
            </div>
            {mode === "view" ? (
              <>
                {canWater && (
                  <button type="button" className="garden-quiet garden-can" onClick={startWatering} aria-label="Water the plants">
                    <WateringCan />
                    <span>Water</span>
                  </button>
                )}
                <button type="button" className="garden-primary" onClick={() => startPlanting()} disabled={!editor}>
                  Plant yours
                </button>
              </>
            ) : mode === "water" ? (
              <button type="button" className="garden-primary" onClick={stopWatering}>
                Done watering
              </button>
            ) : (
              <>
                <button type="button" className="garden-quiet" onClick={() => editor?.undo()} disabled={strokeCount === 0}>
                  Undo
                </button>
                <button type="button" className="garden-quiet" onClick={cancel}>
                  Cancel
                </button>
                <button type="button" className="garden-primary" onClick={() => setMode("label")} disabled={strokeCount === 0}>
                  Done
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
