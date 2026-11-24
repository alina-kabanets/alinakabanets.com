"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

// A short, silent screen recording of one flow. It plays while on screen and
// pauses when scrolled away; with reduced motion it waits for a click. It can
// always be paused, and nothing downloads until it comes near the viewport.
export function FlowVideo({
  src,
  poster,
  title,
  caption,
  width = 2560,
  height = 1600,
}: {
  src: string;
  poster: string;
  title: string;
  caption: React.ReactNode;
  width?: number;
  height?: number;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(true);
  // Set once the visitor pauses, so scrolling back doesn't restart it.
  const [held, setHeld] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.5 });
    if (video.current) observer.observe(video.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (visible && !held && !reducedMotion) el.play().catch(() => {});
    else el.pause();
  }, [visible, held, reducedMotion]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (el.paused) {
      setHeld(false);
      el.play().catch(() => {});
    } else {
      setHeld(true);
      el.pause();
    }
  };

  return (
    <figure>
      <div className="relative overflow-hidden rounded-lg border border-ink/15 bg-white">
        <video
          ref={video}
          src={src}
          poster={poster}
          width={width}
          height={height}
          muted
          loop
          playsInline
          preload="none"
          aria-label={title}
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onClick={toggle}
          className="block h-auto w-full cursor-pointer"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? `Play: ${title}` : `Pause: ${title}`}
          className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-ink/80 text-paper hover:bg-ink"
        >
          <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" />}
          </svg>
        </button>
      </div>
      <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed">
        <span className="font-medium">{title}.</span> <span className="text-muted">{caption}</span>
      </figcaption>
    </figure>
  );
}
