"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Showcase } from "@/content/projects";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type View = "before" | "after";
type Page = Showcase["before"];

// How fast the page scrolls itself, in frame widths per second.
const SPEED = 0.24;
// After the reader scrolls or touches it, wait this long before moving again.
const IDLE_MS = 2500;
// Rest at the bottom before gliding back to the top.
const BOTTOM_PAUSE_MS = 1500;

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink/15 bg-white">
      <div aria-hidden className="flex gap-1 border-b border-ink/10 px-2.5 py-2">
        <span className="size-1.5 rounded-full bg-ink/20" />
        <span className="size-1.5 rounded-full bg-ink/20" />
        <span className="size-1.5 rounded-full bg-ink/20" />
      </div>
      <div className="relative aspect-[16/10]">{children}</div>
    </div>
  );
}

// A full-page screenshot in a browser frame that scrolls itself, and that the
// reader can scroll like a real page (trackpad, wheel, touch, keyboard). Any
// scroll or touch hands control to the reader; it carries on from
// there after a short pause.
function ScrollingPage({
  page,
  running,
  restart,
}: {
  page: Page;
  running: boolean;
  restart: number;
}) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (el) el.scrollTop = 0;
  }, [restart]);

  useEffect(() => {
    const el = box.current;
    if (!el || !running) return;
    let pos = el.scrollTop;
    let idleUntil = 0;
    let atBottomSince = 0;
    let last = performance.now();
    let frame = 0;
    let lastSet = el.scrollTop; // where we last put it; any other position is the reader's doing

    const handBack = () => {
      idleUntil = performance.now() + IDLE_MS;
    };
    const onScroll = () => {
      if (Math.abs(el.scrollTop - lastSet) < 2) return;
      pos = lastSet = el.scrollTop;
      handBack();
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 64) / 1000;
      last = now;
      const max = el.scrollHeight - el.clientHeight;
      if (now >= idleUntil && max > 0) {
        if (pos >= max - 0.5) {
          if (!atBottomSince) atBottomSince = now;
          if (now - atBottomSince > BOTTOM_PAUSE_MS) {
            atBottomSince = 0;
            pos = lastSet = 0;
            el.scrollTo({ top: 0, behavior: "smooth" });
            idleUntil = now + 1200; // let the glide back finish
          }
        } else {
          pos = Math.min(max, pos + SPEED * el.clientWidth * dt);
          el.scrollTop = pos;
          lastSet = el.scrollTop;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", handBack, { passive: true });
    el.addEventListener("pointerdown", handBack);
    el.addEventListener("touchstart", handBack, { passive: true });
    el.addEventListener("keydown", handBack);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", handBack);
      el.removeEventListener("pointerdown", handBack);
      el.removeEventListener("touchstart", handBack);
      el.removeEventListener("keydown", handBack);
    };
  }, [running]);

  return (
    <div
      ref={box}
      tabIndex={0}
      role="region"
      aria-label={`${page.alt}. Scrollable.`}
      className="absolute inset-0 overflow-y-auto overscroll-y-auto [scrollbar-width:thin] focus-visible:outline-offset-[-2px]"
    >
      <Image
        src={page.src}
        alt={page.alt}
        width={page.width}
        height={page.height}
        sizes="(min-width: 1100px) 1100px, 100vw"
        // The first case study sits just below the hero, so load it early.
        loading="eager"
        className="h-auto w-full"
      />
    </div>
  );
}

// Before/after for a landing page redesign: each version is a full-page
// screenshot that scrolls on its own and can be scrolled by hand. It moves only
// while on screen, never with reduced motion, and can always be paused.
export function LandingShowcase({ title, showcase }: { title: string; showcase: Showcase }) {
  const [view, setView] = useState<View>("after");
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [restart, setRestart] = useState(0);
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const active = playing && visible && !reducedMotion;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.3,
    });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  const caption = showcase[view].caption;

  return (
    <section ref={root} aria-label={title}>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span>{title}</span>
        <div role="group" aria-label="Version" className="relative z-10 flex rounded-full border border-ink/20 p-0.5">
          {(["before", "after"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => {
                setView(option);
                setRestart((count) => count + 1);
              }}
              className="rounded-full px-3 py-0.5 capitalize text-muted aria-pressed:bg-ink aria-pressed:text-paper"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 h-px bg-line" />

      {/* Both views share one grid cell so switching doesn't shift the page. */}
      <div className="mt-6 grid">
        {(["after", "before"] as const).map((option) => (
          <div
            key={option}
            aria-hidden={view !== option}
            inert={view !== option}
            className={`col-start-1 row-start-1 transition-opacity duration-500 ${
              view === option ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <figure>
              <figcaption className="mb-2 flex justify-between gap-3 text-[10px] tracking-[0.12em] text-muted uppercase">
                <span>{option}</span>
                <span>Scroll it</span>
              </figcaption>
              <BrowserFrame>
                <ScrollingPage
                  page={showcase[option]}
                  running={active && view === option}
                  restart={view === option ? restart : 0}
                />
              </BrowserFrame>
            </figure>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-start">
        <span className="shrink-0 self-start rounded-full border border-ink px-3 py-1 text-xs capitalize">
          {view}
        </span>
        <p aria-live="polite" className="flex-1 text-sm leading-relaxed">
          {caption}
        </p>
        {!reducedMotion && (
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? "Pause scrolling" : "Play scrolling"}
            className="relative z-10 flex size-8 shrink-0 items-center justify-center self-end rounded-full hover:bg-ink/5 sm:self-start"
          >
            {playing ? (
              <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden fill="currentColor">
                <rect width="3" height="12" />
                <rect x="7" width="3" height="12" />
              </svg>
            ) : (
              <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden fill="currentColor">
                <path d="M0 0l10 6-10 6z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </section>
  );
}
