"use client";

import { useState } from "react";

// A working version of the proposed "Try it on the board" lesson: point at
// shapes with a comment and let an agent answer in the thread. The sticky's
// checkboxes tick from the board's state, not from clicks on the list.
// Styled as tldraw's UI (white panels, its blue, Shantell Sans on the board).

const blue = "#2f80ed";

export function CommentLesson() {
  const [selected, setSelected] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [mentioned, setMentioned] = useState(false);
  const [resolved, setResolved] = useState(false);

  const steps = [
    { label: "Select the two boxes", done: selected },
    { label: "Press Comment", done: commenting },
    { label: "Ask @Claude to connect them", done: mentioned },
    { label: "Resolve the thread", done: resolved },
  ];
  const current = steps.findIndex((step) => !step.done);
  const finished = current === -1;
  const hint = finished
    ? "Done. Saved as “Comment practice”. Next lesson: Bring in your agent."
    : ["Click a box on the board", "Comment, in the toolbar", "Pick @Claude", "Resolve, in the thread"][current];

  const reset = () => {
    setSelected(false);
    setCommenting(false);
    setMentioned(false);
    setResolved(false);
  };

  const coach = (on: boolean) => (on ? "ring-2 ring-offset-1" : "");

  return (
    <figure className="col-span-12">
      <div className="overflow-hidden rounded-xl border border-ink/15 bg-[#f9fafb] text-[13px] text-[#1d1d1d]">
        <div className="grid gap-4 p-4 md:grid-cols-[14rem_1fr] md:p-5">
          {/* The lesson, as a sticky on the board */}
          <div className="relative self-start rotate-[-1deg] bg-[#fef3a3] p-4 font-paper-mono shadow-[0_2px_6px_rgba(0,0,0,0.12)]">
            <p className="text-[12px] text-[#1d1d1d]/60">Lesson 3 of 6</p>
            <p className="mt-1 text-[15px]">Point with a comment</p>
            <ol className="mt-3 space-y-2">
              {steps.map((step, index) => (
                <li key={step.label} className="flex items-start gap-2">
                  <span
                    aria-hidden
                    className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border border-[#1d1d1d]/50 text-[11px] ${
                      step.done ? "bg-[#1d1d1d] text-white" : ""
                    }`}
                  >
                    {step.done ? "✓" : ""}
                  </span>
                  <span className={`${step.done ? "line-through opacity-60" : ""} ${index === current ? "font-medium" : ""}`}>
                    {step.label}
                    <span className="sr-only">{step.done ? " (done)" : ""}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p aria-live="polite" className="mt-4 border-t border-[#1d1d1d]/15 pt-2 text-[12px] text-[#1d1d1d]/70">
              {hint}
            </p>
            {finished && (
              <button type="button" onClick={reset} className="mt-2 text-[12px] underline underline-offset-2">
                Start again
              </button>
            )}
          </div>

          {/* The board */}
          <div className="relative min-h-80 overflow-hidden rounded-lg border border-black/5 bg-white [background-image:radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px]">
            <div className="absolute inset-0 flex items-center justify-center gap-16 pb-10 font-paper-mono text-[15px]">
              {["Sign up", "First board"].map((label) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelected(true)}
                  className={`rounded-md border-2 border-[#1d1d1d] bg-white px-5 py-4 ${
                    selected ? "outline-2 outline-offset-4" : coach(current === 0)
                  }`}
                  style={{ outlineColor: blue, ["--tw-ring-color" as string]: blue }}
                >
                  {label}
                </button>
              ))}
              {mentioned && (
                <svg aria-hidden viewBox="0 0 64 12" className="absolute top-1/2 left-1/2 w-16 -translate-x-1/2 -translate-y-[calc(50%+1.25rem)]">
                  <path d="M2 6 C 20 2, 40 10, 58 6" fill="none" stroke="#1d1d1d" strokeWidth="2" strokeLinecap="round" />
                  <path d="M52 2 L59 6 L52 10" fill="none" stroke="#1d1d1d" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>

            {/* Comment thread, pinned to the selection */}
            {commenting && !resolved && (
              <div className="absolute top-4 right-4 w-60 rounded-xl bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
                <p className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-[#e85d75] text-[10px] text-white">A</span>
                  Alina
                </p>
                {!mentioned ? (
                  <div className="mt-2">
                    <p className="text-[#1d1d1d]/60">Mention someone…</p>
                    <button
                      type="button"
                      onClick={() => setMentioned(true)}
                      className={`mt-2 rounded-full bg-[#eef4fd] px-2.5 py-1 ${coach(current === 2)}`}
                      style={{ color: blue, ["--tw-ring-color" as string]: blue }}
                    >
                      @Claude connect these with an arrow
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="mt-1">
                      <span style={{ color: blue }}>@Claude</span> connect these with an arrow
                    </p>
                    <p className="mt-3 flex items-center gap-2">
                      <span className="flex size-5 items-center justify-center rounded-full bg-[#d97757] text-[10px] text-white">C</span>
                      Claude
                    </p>
                    <p className="mt-1 text-[#1d1d1d]/80">Done: one arrow, Sign up → First board. Nothing else moved.</p>
                    <button
                      type="button"
                      onClick={() => setResolved(true)}
                      className={`mt-3 rounded-md bg-[#1d1d1d] px-2.5 py-1 text-white ${coach(current === 3)}`}
                      style={{ ["--tw-ring-color" as string]: blue }}
                    >
                      Resolve
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Toolbar */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-white p-1 shadow-[0_1px_6px_rgba(0,0,0,0.15)]">
              {["Select", "Draw", "Arrow", "Note"].map((tool) => (
                <span key={tool} className={`rounded-lg px-2.5 py-1.5 ${tool === "Select" ? "text-white" : "text-[#1d1d1d]/60"}`} style={tool === "Select" ? { background: blue } : undefined}>
                  {tool}
                </span>
              ))}
              <button
                type="button"
                disabled={!selected}
                onClick={() => setCommenting(true)}
                className={`rounded-lg px-2.5 py-1.5 disabled:opacity-40 ${commenting ? "bg-[#eef4fd]" : ""} ${coach(current === 1)}`}
                style={{ ["--tw-ring-color" as string]: blue }}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">
        A lesson you do on the board: the steps are a sticky, they tick from what you do, and the agent answers in the thread.
      </figcaption>
    </figure>
  );
}
