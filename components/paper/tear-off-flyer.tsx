"use client";

import { PaperTexture } from "@paper-design/shaders-react";
import { useRef, useState } from "react";
import { profile } from "@/content/profile";

type Tab = {
  id: string;
  label: string;
  href?: string;
  copy?: string;
  event: string;
  trait?: boolean;
};

// What a team gets (taking one just tears it off), mixed in with the ways to
// reach me. A fixed mix, so the server and browser render the same order.
const tabs: Tab[] = [
  { id: "creativity", label: "Creativity", event: "paper-tab", trait: true },
  {
    id: "email",
    label: "Email · copy",
    copy: profile.email,
    event: "email-copy",
  },
  { id: "autonomy", label: "High autonomy", event: "paper-tab", trait: true },
  { id: "cv", label: "CV", href: profile.cv, event: "cv-click" },
  { id: "innovation", label: "Innovation", event: "paper-tab", trait: true },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: profile.links.linkedin,
    event: "linkedin-click",
  },
  { id: "analytics", label: "Analytical mind", event: "paper-tab", trait: true },
  { id: "eye-for-detail", label: "Eye for detail", event: "paper-tab", trait: true },
  { id: "portfolio", label: "Portfolio", href: "/", event: "portfolio-click" },
  { id: "product-thinking", label: "Product thinking", event: "paper-tab", trait: true },
];

// Hand-cut strips are never identical: small, fixed differences per tab.
const cut = [
  { h: 8.6, r: -1.4 },
  { h: 8.1, r: 0.6 },
  { h: 8.9, r: -0.4 },
  { h: 8.3, r: 1.1 },
  { h: 8.7, r: -0.8 },
  { h: 8.0, r: 0.3 },
  { h: 8.8, r: 1.4 },
  { h: 8.6, r: 0.7 },
  { h: 8.4, r: -0.2 },
  { h: 9.1, r: 0.9 },
];

// Handled paper on each tab: a faint fibre grain plus one or two creases,
// at a different angle per tab, as if people have fingered them.
const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.07 0 0 0 0 0.07 0 0 0 0 0.07 0 0 0 0.09 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function handled(index: number) {
  const a = [62, 118, 75, 104, 58, 128, 84, 110, 66, 96][index % 10];
  const at = [34, 58, 46, 70, 40, 62, 52, 30, 66, 44][index % 10];
  return [
    grain,
    `linear-gradient(${a}deg, transparent ${at - 1}%, rgba(17,17,17,0.07) ${at}%, rgba(255,255,255,0.9) ${at + 0.6}%, transparent ${at + 2}%)`,
    index % 3 === 0
      ? `linear-gradient(${180 - a}deg, transparent 77%, rgba(17,17,17,0.05) 78%, rgba(255,255,255,0.8) 78.6%, transparent 80%)`
      : "linear-gradient(transparent, transparent)",
    "linear-gradient(180deg, rgba(17,17,17,0.05), transparent 16%, transparent 84%, rgba(17,17,17,0.03))",
  ].join(", ");
}

// How each letter of "Take one" sits on the crumpled sheet: a small rise or
// dip, tilt and squash, following one gentle wave rather than random jitter.
const bend = [
  { y: 1.5, r: -2, s: 1.02 },
  { y: 0.5, r: -1, s: 1 },
  { y: -0.5, r: 0.5, s: 0.98 },
  { y: -1.5, r: 1.5, s: 0.97 },
  { y: 0, r: 0, s: 1 },
  { y: -1, r: -1.5, s: 1.01 },
  { y: 0.5, r: 1, s: 1.02 },
  { y: 2, r: 2.5, s: 0.99 },
];

const alreadyTaken = ["innovation", "eye-for-detail"];

// The stub left on the sheet once a tab is torn: a ragged bottom edge.
const stub =
  "polygon(0 0, 100% 0, 100% 62%, 86% 78%, 72% 58%, 57% 84%, 41% 63%, 27% 88%, 13% 66%, 0 80%)";

// "Take one": a flyer with tear-off tabs. Drag a tab down (or just
// click it) to tear it off. The contact tabs do their job as they go.
export function TearOffFlyer() {
  // Two tabs are already gone when the page loads: someone got here first.
  const [torn, setTorn] = useState<string[]>(alreadyTaken);
  const [drag, setDrag] = useState<{ id: string; dy: number } | null>(null);
  const [note, setNote] = useState("");
  const start = useRef(0);

  const tear = async (tab: Tab) => {
    setDrag(null);
    setTorn((current) =>
      current.includes(tab.id) ? current : [...current, tab.id],
    );
    if (tab.trait) {
      setNote(`${tab.label}: taken. There’s more where that came from.`);
    } else if (tab.copy) {
      try {
        await navigator.clipboard.writeText(tab.copy);
        setNote(`Copied: ${tab.copy}`);
      } catch {
        window.location.assign(`mailto:${tab.copy}`);
      }
    } else if (tab.href) {
      if (tab.href.startsWith("/") && !tab.href.endsWith(".pdf"))
        window.location.assign(tab.href);
      else window.open(tab.href, "_blank", "noopener");
    }
  };

  return (
    <div className="relative max-w-[30rem] rotate-[0.6deg]">
      {/* The sheet: Paper's own paper-texture shader, so it reads as real paper. */}
      <div className="relative overflow-hidden shadow-[0_1px_1px_rgba(17,17,17,0.05),0_18px_36px_-24px_rgba(17,17,17,0.3)]">
        {/* Its own sheet: crumpled once, laid-paper rows and a few specks, like a
            flyer that has been up on a noticeboard for a while. */}
        <PaperTexture
          className="absolute inset-0 h-full w-full"
          colorBack="#ffffff"
          colorPaper="#ffffff"
          colorShadow="#c9c4b6"
          speed={0}
          fit="cover"
          scale={1}
          angle={35}
          folds={0}
          wrinkles={0.45}
          wrinkleSize={0.6}
          crumples={0.9}
          crumpleCount={8}
          fiber={0.35}
          fiberSize={0.4}
          roughness={0.06}
          roughnessRows={0.4}
          drops={0.08}
          seed={47}
        />
        {/* The shader's relief shading greys the whole sheet; lift it back to the tabs' white. */}
        <div aria-hidden className="absolute inset-0 bg-white/40" />
        <div className="relative px-7 pt-9 pb-8 text-center">
          {/* Printed on crumpled paper: each letter sits a little off, as if the
              sheet bent under it. Plain transforms, so the text stays crisp. */}
          <p
            aria-label="Take one"
            className="rotate-[-1deg] skew-x-[-2deg] text-[clamp(2.6rem,6vw,3.5rem)] leading-tight tracking-[-0.03em] text-ink/90 mix-blend-multiply"
          >
            {Array.from("Take one").map((letter, i) => (
              <span
                key={i}
                aria-hidden
                className="inline-block whitespace-pre"
                style={{
                  transform: `translateY(${bend[i].y}px) rotate(${bend[i].r}deg) scaleY(${bend[i].s})`,
                  // Separate letters lose the font's kerning; tuck the "a" back under the T.
                  marginLeft: i === 1 ? "-0.07em" : undefined,
                }}
              >
                {letter}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Tabs hang from the bottom edge, cut by hand, each with its own shadow. */}
      <ul
        className="relative -mt-px grid grid-cols-10 gap-[3px] px-1"
        aria-label="Tear-off tabs"
      >
        {tabs.map((tab, index) => {
          const isTorn = torn.includes(tab.id);
          const dy = drag?.id === tab.id ? drag.dy : 0;
          const shape = cut[index];
          return (
            <li key={tab.id} className="relative">
              {isTorn && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 block h-3 bg-[#fefefc]"
                  style={{ clipPath: stub }}
                />
              )}
              <button
                type="button"
                disabled={isTorn}
                onPointerDown={(event) => {
                  start.current = event.clientY;
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setDrag({ id: tab.id, dy: 0 });
                }}
                onPointerMove={(event) => {
                  if (drag?.id !== tab.id) return;
                  setDrag({
                    id: tab.id,
                    dy: Math.max(
                      0,
                      Math.min(36, event.clientY - start.current),
                    ),
                  });
                }}
                onPointerCancel={() => setDrag(null)}
                onClick={() => tear(tab)}
                data-umami-event={tab.event}
                data-umami-event-tab={tab.id}
                data-umami-event-location="paper-flyer"
                aria-label={
                  tab.trait
                    ? `Take ${tab.label.toLowerCase()}`
                    : tab.copy
                      ? `Copy email address (${tab.copy})`
                      : `Open ${tab.label}`
                }
                className={`flex w-full origin-top items-center justify-center bg-[#fdfcf8] shadow-[0_1px_0_rgba(17,17,17,0.06),0_6px_10px_-6px_rgba(17,17,17,0.3)] transition-[transform,opacity] duration-700 ease-in motion-reduce:transition-none ${
                  isTorn ? "opacity-0" : ""
                } ${"font-paper-mono text-[13px] text-ink"}`}
                style={{
                  backgroundImage: handled(index),
                  height: `${shape.h}rem`,
                  transform: isTorn
                    ? `translateY(10rem) rotate(${shape.r * 14}deg)`
                    : `translateY(${dy}px) rotate(${shape.r + dy / 10}deg)`,
                  transition: !isTorn && dy ? "none" : undefined,
                }}
              >
                <span className="rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">
                  {tab.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p aria-live="polite" className="mt-8 min-h-5 text-center text-sm">
        {note}
      </p>
      {torn.length > 0 && (
        <p className="mt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setTorn([]);
              setNote("");
            }}
            className="inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm transition-colors hover:bg-ink hover:text-paper"
          >
            Put the tabs back
          </button>
        </p>
      )}
    </div>
  );
}
