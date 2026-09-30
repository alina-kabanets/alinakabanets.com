"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Showcase } from "@/content/projects";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const BEFORE_SCROLL_MS = 34000;
const BROWSER_RATIO = 10 / 16;

type View = "before" | "after";

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink/15 bg-white">
      <div aria-hidden className="flex gap-1 border-b border-ink/10 px-2.5 py-2">
        <span className="size-1.5 rounded-full bg-ink/20" />
        <span className="size-1.5 rounded-full bg-ink/20" />
        <span className="size-1.5 rounded-full bg-ink/20" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden">{children}</div>
    </div>
  );
}

// Before/after for a landing page redesign: the old page is a long static
// export that scrolls on its own; the new one is a screen recording. Media plays only while on screen, never with reduced
// motion, and can always be paused.
export function LandingShowcase({ title, showcase }: { title: string; showcase: Showcase }) {
  const [view, setView] = useState<View>("after");
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const desktop = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  const active = playing && visible && !reducedMotion;
  const { before, after } = showcase;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.3,
    });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  // Each switch to "after" replays the recording from the top of the page.
  useEffect(() => {
    if (view === "after" && desktop.current) desktop.current.currentTime = 0;
  }, [view]);

  useEffect(() => {
    const video = desktop.current;
    if (!video) return;
    if (active && view === "after") video.play().catch(() => {});
    else video.pause();
  }, [active, view]);

  const visibleShare = (BROWSER_RATIO * before.width) / before.height;
  const caption = view === "before" ? before.caption : after.caption;

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
              onClick={() => setView(option)}
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
        <div
          aria-hidden={view !== "after"}
          className={`col-start-1 row-start-1 transition-opacity duration-500 ${
            view === "after" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <figure>
            <figcaption className="mb-2 truncate text-[10px] tracking-[0.12em] text-muted uppercase">
              After
            </figcaption>
            <BrowserFrame>
              <video
                ref={desktop}
                aria-label={after.alt}
                poster={after.desktop.poster}
                muted
                loop
                playsInline
                preload="none"
                className="h-full w-full object-cover object-top"
              >
                <source src={after.desktop.webm} type="video/webm" />
                <source src={after.desktop.mp4} type="video/mp4" />
              </video>
            </BrowserFrame>
          </figure>
        </div>

        <div
          aria-hidden={view !== "before"}
          className={`col-start-1 row-start-1 transition-opacity duration-500 ${
            view === "before" ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <figure>
            <figcaption className="mb-2 truncate text-[10px] tracking-[0.12em] text-muted uppercase">
              Before
            </figcaption>
            <BrowserFrame>
              <Image
                src={before.src}
                alt={before.alt}
                width={before.width}
                height={before.height}
                sizes="(min-width: 768px) 60vw, 100vw"
                className="h-auto w-full"
                style={
                  view === "before" && !reducedMotion
                    ? ({
                        "--scroll-end": `${-(1 - visibleShare) * 100}%`,
                        animation: `demo-scroll ${BEFORE_SCROLL_MS}ms ease-in-out infinite`,
                        animationPlayState: active ? "running" : "paused",
                      } as React.CSSProperties)
                    : undefined
                }
              />
            </BrowserFrame>
          </figure>
        </div>
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
            aria-label={playing ? "Pause" : "Play"}
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
