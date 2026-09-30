"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { DemoScene } from "@/content/projects";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const TYPE_MS = 28; // per caption character
const HOLD_MS = 2800; // reading time after the caption finishes
// Frame height / width for each screen.
const PHONE_RATIO = 19.5 / 9;
const sceneDuration = (scene: DemoScene) => scene.caption.length * TYPE_MS + HOLD_MS;

// Phone screens taller than their frame scroll to the bottom over the scene. The
// end offset is the hidden part, as a percentage of the image's own height.
// Near-fits stay still rather than jiggle.
function scrollStyle(
  { width, height }: { width: number; height: number },
  frameRatio: number,
  duration: number,
  playState: string,
): React.CSSProperties | undefined {
  const visible = (frameRatio * width) / height;
  if (visible >= 0.9) return undefined;
  return {
    "--scroll-end": `${-(1 - visible) * 100}%`,
    animation: `demo-scroll ${duration}ms ease-in-out forwards`,
    animationPlayState: playState,
  } as React.CSSProperties;
}

// Recreates the borna.ai product demo in the portfolio's style: a patient
// phone and the admin app side by side, a caption that types itself out, and
// scenes that advance on their own. Autoplays only while on screen, never with
// reduced motion, and can always be paused.
export function DemoPlayer({ title, scenes }: { title: string; scenes: DemoScene[] }) {
  const [{ index, chars }, setState] = useState({ index: 0, chars: 0 });
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const autoplay = playing && visible && !reducedMotion;
  const scene = scenes[index];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.3,
    });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const typing = chars < scene.caption.length;
    const timer = setTimeout(
      () =>
        setState((current) =>
          typing
            ? { ...current, chars: current.chars + 1 }
            : { index: (current.index + 1) % scenes.length, chars: 0 },
        ),
      typing ? TYPE_MS : HOLD_MS,
    );
    return () => clearTimeout(timer);
  }, [autoplay, chars, scene.caption.length, scenes.length]);

  // Manual navigation shows the whole caption unless the demo is playing.
  const go = (next: number) => {
    const target = (next + scenes.length) % scenes.length;
    setState({ index: target, chars: autoplay ? 0 : scenes[target].caption.length });
  };

  const typed = reducedMotion ? scene.caption : scene.caption.slice(0, chars);
  const animationState = autoplay ? "running" : "paused";
  const control = "relative z-10 flex size-8 items-center justify-center rounded-full hover:bg-ink/5";

  return (
    <section ref={root} aria-roledescription="carousel" aria-label={title}>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span>{title}</span>
        <div className="flex items-center gap-3">
          <span className="text-muted">
            Scene {index + 1} of {scenes.length}
          </span>
          <div className="flex gap-1.5">
            {scenes.map((item, i) => (
              <button
                key={item.tag}
                type="button"
                aria-label={`Scene ${i + 1}: ${item.tag}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className="relative z-10 size-2 rounded-full bg-ink/20 aria-[current=true]:bg-ink"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 h-px bg-line">
        {!reducedMotion && (
          <div
            key={index}
            className="h-full origin-left bg-ink"
            style={{
              animation: `demo-progress ${sceneDuration(scene)}ms linear forwards`,
              animationPlayState: animationState,
            }}
          />
        )}
      </div>

      {/* Scenes share one grid cell so they can crossfade at natural height. */}
      <div className="mt-6 grid">
        {scenes.map((item, i) => (
          <div
            key={item.tag}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 flex items-center gap-[4%] transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <figure className="w-[24%] shrink-0">
              <figcaption className="mb-2 truncate text-[10px] tracking-[0.12em] text-muted uppercase">
                {item.patient.label}
              </figcaption>
              <div className="relative aspect-[9/19.5] overflow-hidden rounded-[12%/5.5%] border border-ink/15 bg-white">
                <Image
                  key={i === index ? `${index}-active` : "idle"}
                  src={item.patient.src}
                  alt={i === index ? item.patient.alt : ""}
                  width={item.patient.width}
                  height={item.patient.height}
                  sizes="(min-width: 768px) 14vw, 24vw"
                  className="h-auto w-full"
                  style={
                    i === index && !reducedMotion
                      ? scrollStyle(item.patient, PHONE_RATIO, sceneDuration(item), animationState)
                      : undefined
                  }
                />
              </div>
            </figure>
            <figure className="min-w-0 flex-1">
              <figcaption className="mb-2 truncate text-[10px] tracking-[0.12em] text-muted uppercase">
                {item.admin.label}
              </figcaption>
              <div className="overflow-hidden rounded-lg border border-ink/15 bg-white">
                <div aria-hidden className="flex gap-1 border-b border-ink/10 px-2.5 py-2">
                  <span className="size-1.5 rounded-full bg-ink/20" />
                  <span className="size-1.5 rounded-full bg-ink/20" />
                  <span className="size-1.5 rounded-full bg-ink/20" />
                </div>
                <div className="relative aspect-[16/10]">
                  <Image
                    src={item.admin.src}
                    alt={i === index ? item.admin.alt : ""}
                    fill
                    sizes="(min-width: 768px) 55vw, 70vw"
                    className="object-cover object-left-top"
                  />
                </div>
              </div>
            </figure>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-start">
        <span className="shrink-0 self-start rounded-full border border-ink px-3 py-1 text-xs">{scene.tag}</span>
        <p className="min-h-[3lh] flex-1 text-sm leading-relaxed">
          <span className="sr-only">{scene.caption}</span>
          <span aria-hidden>
            {typed}
            {!reducedMotion && typed.length < scene.caption.length && (
              <span className="ml-px inline-block h-[1em] w-px translate-y-[0.15em] animate-pulse bg-ink" />
            )}
          </span>
        </p>
        <div className="flex shrink-0 items-center self-end sm:self-start">
          <button type="button" onClick={() => go(index - 1)} aria-label="Previous scene" className={control}>
            ←
          </button>
          {!reducedMotion && (
            <button
              type="button"
              onClick={() => setPlaying((value) => !value)}
              aria-label={playing ? "Pause demo" : "Play demo"}
              className={control}
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
          <button type="button" onClick={() => go(index + 1)} aria-label="Next scene" className={control}>
            →
          </button>
        </div>
      </div>
    </section>
  );
}
