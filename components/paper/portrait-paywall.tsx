"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import portrait from "@/public/images/portrait-square.jpg";
import { Tape } from "./tape";

const FROST_TOP = 46; // % of the height where the "Pro" frost begins
const WINDOW = 12; // window width, % of the photo's width

// The photo is clear at the top and frosted below, like a locked feature.
// A narrow clear window follows the pointer (or a finger) through the frost.
// The frost is a blurred copy of the photo in two strips either side of the
// window, so the window is just the sharp photo showing through.
export function PortraitPaywall() {
  const box = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(62);

  const move = (clientX: number) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setX(Math.min(100 - WINDOW / 2, Math.max(WINDOW / 2, pct)));
  };

  const left = x - WINDOW / 2;
  const right = 100 - (x + WINDOW / 2);
  const frost =
    "absolute inset-0 h-full w-full scale-110 object-cover blur-[14px] saturate-50";

  return (
    <figure className="col-span-12 md:col-span-6">
      {/* An instant print taped to the page by its four corners. */}
      <div className="relative mx-auto max-w-[30rem] rotate-[-1.5deg] px-8 py-6">
        <Tape
          className="absolute right-0 bottom-0 z-10 h-7 w-24"
          rotate={-38}
        />
        <div className="relative bg-[#fbfaf6] p-[5%] pb-[16%] shadow-[0_1px_2px_rgba(17,17,17,0.08),0_14px_30px_-16px_rgba(17,17,17,0.35)]">
          <Tape className="absolute -top-2 -left-7 z-10 h-7 w-24" rotate={-40} />
          <Tape className="absolute -top-2 -right-7 z-10 h-7 w-24" rotate={40} />
          <Tape className="absolute -bottom-2 -left-7 z-10 h-7 w-24" rotate={40} />
          <Tape className="absolute -right-7 -bottom-2 z-10 h-7 w-24" rotate={-40} />
          <div
            ref={box}
            className="relative aspect-square touch-pan-y overflow-hidden bg-tint outline outline-1 -outline-offset-1 outline-ink/10 select-none"
            onPointerMove={(event) => move(event.clientX)}
            onPointerDown={(event) => move(event.clientX)}
          >
            <Image
              src={portrait}
              alt="Alina Kabanets, smiling, in round glasses and a camel coat on a London street. The lower half of the photo is frosted over like a locked feature."
              placeholder="blur"
              sizes="(min-width: 768px) 45vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ clipPath: `inset(${FROST_TOP}% ${100 - left}% 0 0)` }}
            >
              <Image
                src={portrait}
                alt=""
                sizes="(min-width: 768px) 45vw, 100vw"
                className={frost}
              />
              <div className="absolute inset-0 bg-paper/25" />
            </div>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ clipPath: `inset(${FROST_TOP}% 0 0 ${100 - right}%)` }}
            >
              <Image
                src={portrait}
                alt=""
                sizes="(min-width: 768px) 45vw, 100vw"
                className={frost}
              />
              <div className="absolute inset-0 bg-paper/25" />
            </div>
            <div
              aria-hidden
              className="absolute bottom-[6%] border border-paper/90"
              style={{
                top: `${FROST_TOP + 4}%`,
                left: `${left}%`,
                width: `${WINDOW}%`,
              }}
            >
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl leading-none font-light text-paper">
                +
              </span>
            </div>
            <div
              aria-hidden
              className="absolute h-px w-full bg-paper/60"
              style={{ top: `${FROST_TOP}%` }}
            />
            <p className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-sm text-paper">
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <rect x="3" y="7" width="10" height="7" rx="1.5" />
                <path d="M5.5 7V5a2.5 2.5 0 015 0v2" />
              </svg>
              Pro
            </p>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-muted">
        Move across the photo to peek.
      </figcaption>
    </figure>
  );
}
