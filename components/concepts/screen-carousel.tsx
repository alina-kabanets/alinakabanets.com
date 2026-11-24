"use client";

import Image, { type StaticImageData } from "next/image";
import { useState } from "react";

export type Screen = { label: string; src: StaticImageData; alt: string; caption: string };

// Product screenshots one at a time, at a size where the detail can be read.
// The numbered buttons above are the navigation and the table of contents.
// Screens load as they are first shown, plus the next one, so the crossfade
// never waits and unseen screens don't all download up front.
export function ScreenCarousel({ title, screens, priority = false }: { title: string; screens: Screen[]; priority?: boolean }) {
  const [{ index, loaded }, setState] = useState(() => ({ index: 0, loaded: new Set([0, 1]) }));
  const go = (next: number) => {
    const target = (next + screens.length) % screens.length;
    setState((current) => ({ index: target, loaded: new Set([...current.loaded, target, (target + 1) % screens.length]) }));
  };
  const screen = screens[index];
  const arrow = "grid size-9 place-items-center rounded-full border border-ink/15 bg-paper hover:border-ink";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={title}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(index + 1);
        if (event.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div className="mb-3 flex items-start gap-3">
        <div role="group" aria-label="Choose a screen" className="flex flex-1 flex-wrap gap-1.5">
          {screens.map((item, i) => (
            <button
              key={item.label}
              type="button"
              aria-current={i === index}
              onClick={() => go(i)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-ink/20 px-3.5 py-2 text-sm hover:border-ink aria-[current=true]:border-ink aria-[current=true]:bg-ink aria-[current=true]:text-paper"
            >
              <span className="text-xs tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button type="button" aria-label="Previous screen" onClick={() => go(index - 1)} className={arrow}>
            <span aria-hidden>←</span>
          </button>
          <button type="button" aria-label="Next screen" onClick={() => go(index + 1)} className={arrow}>
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-ink/15 bg-white">
        <div aria-hidden className="flex items-center gap-1.5 border-b border-ink/10 px-3 py-2.5">
          <span className="size-2 rounded-full bg-ink/15" />
          <span className="size-2 rounded-full bg-ink/15" />
          <span className="size-2 rounded-full bg-ink/15" />
          <span className="ml-3 truncate text-[11px] text-muted">ledgerline · {screen.label}</span>
        </div>
        {/* Screens share one grid cell so they crossfade at their natural height. */}
        <div className="grid">
          {screens.map((item, i) => (
            <div
              key={item.label}
              aria-hidden={i !== index}
              className={`col-start-1 row-start-1 transition-opacity duration-500 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              {loaded.has(i) && (
                <Image
                  src={item.src}
                  alt={i === index ? item.alt : ""}
                  quality={90}
                  preload={priority && i === 0}
                  placeholder="blur"
                  sizes="(min-width: 768px) 66vw, 100vw"
                  className="h-auto w-full"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-4 max-w-[40rem] text-sm leading-relaxed">
        <span className="font-medium">{screen.label}.</span> {screen.caption}
      </p>
    </section>
  );
}
