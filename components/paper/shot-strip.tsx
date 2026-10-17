"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Tape } from "./tape";

export type Shot = { src: string; alt: string; width: number; height: number };

const tilt = [-1.5, 1, -0.5];
const tapeTilt = [-3, 4, -2];

// Taped phone screenshots. They lift on hover; a click (or tap) opens one
// full size in a dialog, and the arrow keys step through the set.
export function ShotStrip({ shots }: { shots: Shot[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(0);
  const shot = shots[open];

  const show = (index: number) => {
    setOpen(index);
    dialog.current?.showModal();
  };
  const step = (by: number) => setOpen((current) => (current + by + shots.length) % shots.length);

  return (
    <>
      {/* On phones the column is too narrow for three, so they scroll sideways. */}
      <div className="-mr-5 mt-2 flex snap-x gap-3 overflow-x-auto pt-3 pr-5 pb-3 md:mr-0 md:flex-wrap md:overflow-visible md:pr-0">
        {shots.map((item, i) => (
          <figure
            key={item.src}
            // Phone shots are narrow; desktop shots get more room so they stay legible.
            className={`group relative shrink-0 snap-start ${
              item.width > item.height ? "w-[11rem] md:w-[13rem]" : "w-[6.5rem] md:w-[7.5rem]"
            }`}
            style={{ rotate: `${tilt[i % 3]}deg` }}
          >
            <Tape className="absolute -top-2.5 left-1/2 z-10 h-4 w-12 -translate-x-1/2" rotate={tapeTilt[i % 3]} />
            <button
              type="button"
              onClick={() => show(i)}
              aria-label={`Enlarge screenshot ${i + 1} of ${shots.length}`}
              className="block w-full cursor-zoom-in transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.06] motion-reduce:transition-none"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.width}
                height={item.height}
                sizes={item.width > item.height ? "13rem" : "7.5rem"}
                className="h-auto w-full border border-ink/15 bg-white shadow-[0_8px_18px_-12px_rgba(17,17,17,0.4)] transition-shadow duration-300 group-hover:shadow-[0_16px_28px_-14px_rgba(17,17,17,0.45)]"
              />
            </button>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        aria-label="Screenshot"
        onClick={(event) => {
          // A click on the backdrop (the dialog itself, not its content) closes it.
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 font-sans backdrop:bg-[rgba(17,17,17,0.82)] backdrop:backdrop-blur-sm"
      >
        <figure className="flex flex-col items-center gap-3">
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes="90vw"
            className="h-auto max-h-[82vh] w-auto max-w-[90vw] rounded-md shadow-2xl"
          />
          <figcaption className="flex items-center gap-2 text-sm text-paper">
            {shots.length > 1 && (
              <button type="button" onClick={() => step(-1)} aria-label="Previous screenshot" className="size-11 rounded-full hover:bg-paper/15">
                ←
              </button>
            )}
            <span>
              {open + 1} / {shots.length}
            </span>
            {shots.length > 1 && (
              <button type="button" onClick={() => step(1)} aria-label="Next screenshot" className="size-11 rounded-full hover:bg-paper/15">
                →
              </button>
            )}
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="ml-2 h-11 rounded-full border border-paper/40 px-4 hover:bg-paper/15"
            >
              Close
            </button>
          </figcaption>
        </figure>
      </dialog>
    </>
  );
}

// One image that fills its frame and opens full size on click (or tap).
export function ZoomImage({ shot, className = "" }: { shot: Shot; className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Enlarge: ${shot.alt}`}
        className={`group relative block w-full cursor-zoom-in overflow-hidden ${className}`}
      >
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-contain transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
        />
      </button>
      <dialog
        ref={dialog}
        aria-label={shot.alt}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 font-sans backdrop:bg-[rgba(17,17,17,0.82)] backdrop:backdrop-blur-sm"
      >
        <figure className="flex flex-col items-center gap-3">
          <Image
            src={shot.src}
            alt={shot.alt}
            width={shot.width}
            height={shot.height}
            sizes="90vw"
            className="h-auto max-h-[82vh] w-auto max-w-[90vw] rounded-md shadow-2xl"
          />
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            className="h-11 rounded-full border border-paper/40 px-4 text-sm text-paper hover:bg-paper/15"
          >
            Close
          </button>
        </figure>
      </dialog>
    </>
  );
}
