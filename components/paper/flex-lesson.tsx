"use client";

import { useState } from "react";

// A working version of the proposed "Try it on canvas" lesson. The notepad's
// checkboxes tick from the canvas state, not from clicks on the list.
// Styled as Paper's UI (their blue, small type), since it's a proposal for it.

type Display = "block" | "flex";
type Direction = "row" | "column";
type Align = "start" | "center";

const gaps = [0, 8, 16] as const;

export function FlexLesson() {
  const [selected, setSelected] = useState(false);
  const [display, setDisplay] = useState<Display>("block");
  const [direction, setDirection] = useState<Direction>("row");
  const [gap, setGap] = useState<(typeof gaps)[number]>(0);
  const [align, setAlign] = useState<Align>("start");

  const steps = [
    { label: "Select the card", done: selected },
    { label: "Set display to Flex", done: selected && display === "flex" },
    { label: "Set direction to Column", done: selected && display === "flex" && direction === "column" },
    { label: "Set gap to 16", done: selected && display === "flex" && gap === 16 },
    { label: "Centre the items", done: selected && display === "flex" && align === "center" },
  ];
  const doneCount = steps.filter((step) => step.done).length;
  const current = steps.findIndex((step) => !step.done);
  const finished = current === -1;

  const reset = () => {
    setSelected(false);
    setDisplay("block");
    setDirection("row");
    setGap(0);
    setAlign("start");
  };

  const hint = finished
    ? "Done. Saved to All files as “Flex practice”. Next lesson: Shaders."
    : ["Click the card on the canvas", "Display → Flex", "Direction → Column", "Gap → 16", "Align → Center"][current];

  const isFlex = display === "flex";
  const segment = (active: boolean, enabled: boolean, coach: boolean) =>
    `rounded px-2 py-1 transition-colors ${
      active ? "bg-[#f9f9f9] text-[#222] shadow-sm" : "text-[#6b6b6b]"
    } ${enabled ? "hover:text-[#222]" : "opacity-40"} ${coach ? "ring-2 ring-[#6094f4]" : ""}`;

  return (
    <figure className="col-span-12">
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-[#999999] text-[13px] text-[#222]">
        <div className="flex items-center gap-2 border-b border-black/10 bg-[#e8e8e8] px-3 py-2">
          <span className="rounded px-2 py-0.5 text-[#6b6b6b]">Start</span>
          <span className="rounded bg-[#f9f9f9] px-2 py-0.5 shadow-sm">Flex practice</span>
        </div>

        <div className="grid gap-4 p-4 md:grid-cols-[15rem_1fr_13rem] md:p-5">
          {/* Notepad */}
          <div className="relative rotate-[-1.5deg] self-start bg-white p-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]">
            <p className="font-paper-mono text-[12px] text-[#6b6b6b]">Lesson 3 of 6</p>
            <p className="mt-1 text-[15px] font-medium">Real flex layout, by hand</p>
            <ol className="mt-3 space-y-2" aria-label="Lesson steps">
              {steps.map((step, index) => (
                <li key={step.label} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${
                      step.done ? "border-[#222] bg-[#222] text-white" : "border-[#6b6b6b]/60"
                    }`}
                  >
                    {step.done && (
                      <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M2.5 6.2l2.3 2.3L9.5 3.8" />
                      </svg>
                    )}
                  </span>
                  <span className={`${step.done ? "text-[#6b6b6b] line-through" : ""} ${index === current ? "font-medium" : ""}`}>
                    {step.label}
                    <span className="sr-only">{step.done ? " (done)" : " (to do)"}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 font-paper-mono text-[12px] text-[#6b6b6b]" aria-live="polite">
              {doneCount} of {steps.length} · ticks itself
            </p>
          </div>

          {/* Canvas */}
          <div
            className="relative flex min-h-64 flex-col items-center justify-center p-6"
          >
            <button
              type="button"
              onClick={() => setSelected(true)}
              aria-pressed={selected}
              aria-label="Card on the canvas"
              className={`w-full max-w-56 rounded-lg bg-white p-3 text-left shadow-sm outline-none ${
                selected ? "ring-2 ring-[#6094f4]" : "ring-1 ring-black/10 hover:ring-[#6094f4]/60"
              } ${!selected ? "animate-pulse motion-reduce:animate-none" : ""}`}
            >
              <span
                className="block transition-all duration-300 motion-reduce:transition-none"
                style={{
                  display: isFlex ? "flex" : "block",
                  flexDirection: direction,
                  gap: isFlex ? gap : undefined,
                  alignItems: align === "center" ? "center" : "flex-start",
                }}
              >
                <span className="mb-1 block h-10 w-10 shrink-0 rounded bg-[#6094f4]/70" />
                <span className="block">
                  <span className="block text-[13px] font-medium">Flex practice</span>
                  <span className="block text-[12px] text-[#6b6b6b]">A card, laid out by hand</span>
                </span>
              </span>
            </button>
            <p
              className="mt-4 rounded-full bg-[#222] px-3 py-1.5 text-center text-[12px] text-white"
              aria-live="polite"
            >
              {hint}
            </p>
          </div>

          {/* Properties */}
          <div className={`self-start rounded-md bg-[#f2f2f2] p-3 ${selected ? "" : "opacity-60"}`}>
            <p className="text-[12px] font-medium text-[#6b6b6b]">Layout</p>
            <fieldset className="mt-3" disabled={!selected}>
              <legend className="mb-1 text-[12px] text-[#6b6b6b]">Display</legend>
              <div className="inline-flex gap-1 rounded-md bg-[#e4e4e4] p-0.5">
                {(["block", "flex"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={display === value}
                    onClick={() => setDisplay(value)}
                    className={segment(display === value, selected, selected && current === 1 && value === "flex")}
                  >
                    {value === "flex" ? "Flex" : "Block"}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-3" disabled={!selected || !isFlex}>
              <legend className="mb-1 text-[12px] text-[#6b6b6b]">Direction</legend>
              <div className="inline-flex gap-1 rounded-md bg-[#e4e4e4] p-0.5">
                {(["row", "column"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={direction === value}
                    onClick={() => setDirection(value)}
                    className={segment(direction === value, selected && isFlex, current === 2 && value === "column")}
                  >
                    {value === "row" ? "Row" : "Column"}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-3" disabled={!selected || !isFlex}>
              <legend className="mb-1 text-[12px] text-[#6b6b6b]">Gap</legend>
              <div className="inline-flex gap-1 rounded-md bg-[#e4e4e4] p-0.5">
                {gaps.map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={gap === value}
                    onClick={() => setGap(value)}
                    className={segment(gap === value, selected && isFlex, current === 3 && value === 16)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="mt-3" disabled={!selected || !isFlex}>
              <legend className="mb-1 text-[12px] text-[#6b6b6b]">Align</legend>
              <div className="inline-flex gap-1 rounded-md bg-[#e4e4e4] p-0.5">
                {(["start", "center"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={align === value}
                    onClick={() => setAlign(value)}
                    className={segment(align === value, selected && isFlex, current === 4 && value === "center")}
                  >
                    {value === "start" ? "Start" : "Center"}
                  </button>
                ))}
              </div>
            </fieldset>
            {finished && (
              <button type="button" onClick={reset} className="mt-4 text-[12px] text-[#6b6b6b] underline">
                Start again
              </button>
            )}
          </div>
        </div>
      </div>
      <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">
        Try it: this one works. The checklist reads the card’s real layout, and the hint always points at the control
        you need next.
      </figcaption>
    </figure>
  );
}
