"use client";

import { useRef, useState } from "react";

// The hero as a free arrangement on wider screens, like a poster: each block
// sits where the layout file says, with x, y and width all in % of the hero's
// width (so the composition keeps its proportions at any screen size), and s
// scaling it. The composition is centred vertically in the first screen. On the dev
// server an "Arrange hero" switch lets each block be dragged to move it,
// widened from its right edge, and resized from its corner, then saved back
// to content/hero-layout.json. On phones the blocks simply stack in order
// (a block's `phone` classes can set it beside the next one instead).

export type Box = { x: number; y: number; w: number; s: number };
export type HeroLayout = { height: number; blocks: Record<string, Box> };
type Block = { id: string; label: string; node: React.ReactNode; phone?: string };
type Drag = { id: string; mode: "move" | "width" | "scale"; px: number; py: number; start: Box; widthPx: number };

const round = (n: number) => Math.round(n * 100) / 100;

// After editing: measure the composition's height (to the lowest block's
// bottom), in % of the width, so it stays centred in the first screen.
function normalise(blocks: Record<string, Box>, area: HTMLElement): HeroLayout {
  const width = area.getBoundingClientRect().width;
  let bottom = 0;
  area.querySelectorAll<HTMLElement>("[data-block]").forEach((el) => {
    const b = blocks[el.dataset.block!];
    bottom = Math.max(bottom, b.y + ((el.offsetHeight * b.s) / width) * 100);
  });
  return { height: round(bottom), blocks };
}

export function HeroCanvas({ blocks, saved, editable }: { blocks: Block[]; saved: HeroLayout; editable: boolean }) {
  const [layout, setLayout] = useState(saved);
  const [base, setBase] = useState(saved);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const area = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const dirty = JSON.stringify(layout) !== JSON.stringify(base);

  const start = (event: React.PointerEvent, id: string, mode: Drag["mode"]) => {
    if (!editing) return;
    event.preventDefault();
    event.stopPropagation();
    const block = (event.currentTarget as HTMLElement).closest("[data-block]") as HTMLElement;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    drag.current = { id, mode, px: event.clientX, py: event.clientY, start: layout.blocks[id], widthPx: block.getBoundingClientRect().width };
  };

  const move = (event: React.PointerEvent) => {
    const d = drag.current;
    const box = area.current?.getBoundingClientRect();
    if (!d || !box) return;
    const dx = event.clientX - d.px;
    const dy = event.clientY - d.py;
    const next = { ...d.start };
    if (d.mode === "move") {
      next.x = round(d.start.x + (dx / box.width) * 100);
      next.y = round(d.start.y + (dy / box.width) * 100);
    } else if (d.mode === "width") {
      next.w = round(Math.max(8, d.start.w + (dx / box.width) * 100 / d.start.s));
    } else {
      next.s = Math.round(Math.max(0.4, Math.min(3, d.start.s * ((d.widthPx + dx) / d.widthPx))) * 100) / 100;
    }
    setLayout((current) => ({ ...current, blocks: { ...current.blocks, [d.id]: next } }));
  };

  const end = () => {
    drag.current = null;
  };

  const save = async () => {
    if (!area.current) return;
    setStatus("Saving…");
    const next = normalise(layout.blocks, area.current);
    const response = await fetch("/api/hero-layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (response.ok) {
      setLayout(next);
      setBase(next);
      setStatus("Saved");
      setTimeout(() => setStatus(""), 1500);
    } else setStatus("Couldn’t save");
  };

  return (
    <>
      {/* Centred in the first screen; the composition is as tall as its blocks. */}
      <div className="md:flex md:h-full md:items-center">
      <div
        ref={area}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        style={{ "--h": layout.height } as React.CSSProperties}
        className="flex w-full flex-row flex-wrap gap-x-4 gap-y-6 md:relative md:block md:h-[calc(var(--h)*1cqw)]"
      >
        {blocks.map(({ id, label, node, phone = "max-md:w-full" }) => {
          const b = layout.blocks[id];
          return (
            <div
              key={id}
              data-block={id}
              onPointerDown={(event) => start(event, id, "move")}
              style={{ "--x": `${b.x}%`, "--y": b.y, "--w": `${b.w}%`, "--s": b.s } as React.CSSProperties}
              className={`${phone} md:absolute md:top-[calc(var(--y)*1cqw)] md:left-(--x) md:w-(--w) md:origin-top-left md:scale-(--s) ${
                editing ? "cursor-move outline-1 outline-offset-4 outline-ink/40 outline-dashed hover:outline-ink [&_*]:pointer-events-none" : ""
              }`}
            >
              {node}
              {editing && (
                <>
                  <span className="pointer-events-none absolute -top-6 left-0 rounded bg-ink px-1.5 py-0.5 font-sans text-[11px] whitespace-nowrap text-paper">
                    {label} · {b.x}%, {b.y}% · w {b.w}% · ×{b.s}
                  </span>
                  <span
                    title="Drag to change the width"
                    onPointerDown={(event) => start(event, id, "width")}
                    className="pointer-events-auto! absolute top-1/2 -right-2.5 h-8 w-2 -translate-y-1/2 cursor-ew-resize rounded-full bg-ink"
                  />
                  <span
                    title="Drag to make it bigger or smaller"
                    onPointerDown={(event) => start(event, id, "scale")}
                    className="pointer-events-auto! absolute -right-3 -bottom-3 size-4 cursor-nwse-resize rounded-sm border-2 border-paper bg-ink"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
      </div>

      {editable && (
        <div className="fixed right-5 bottom-5 z-50 hidden items-center gap-2 rounded-full bg-ink p-1.5 font-sans text-sm text-paper shadow-xl md:flex">
          {editing ? (
            <>
              <span className="px-2 text-paper/70">Drag to move · edge: width · corner: size</span>
              <button type="button" onClick={save} disabled={!dirty} className="rounded-full bg-paper px-3 py-1 text-ink disabled:opacity-40">
                {status || "Save"}
              </button>
              <button type="button" onClick={() => setLayout(base)} disabled={!dirty} className="rounded-full px-3 py-1 hover:bg-paper/15 disabled:opacity-40">
                Undo changes
              </button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-full px-3 py-1 hover:bg-paper/15">
                Done
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setEditing(true)} className="rounded-full px-3 py-1 hover:bg-paper/15">
              Arrange hero
            </button>
          )}
        </div>
      )}
    </>
  );
}
