"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState } from "react";

type Shot = { src: StaticImageData; alt: string };

// Small thumbnails that open full size on click: enough to show the artefact
// without letting it take over the page. Same viewer look as the blog's.
export function ZoomGrid({ images, caption }: { images: Shot[]; caption?: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<Shot | null>(null);

  return (
    <figure className="col-span-12">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {images.map((image) => (
          <li key={image.alt}>
            <button
              type="button"
              onClick={() => {
                setOpen(image);
                dialog.current?.showModal();
              }}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg border border-ink/15"
            >
              <Image
                src={image.src}
                alt={image.alt}
                placeholder="blur"
                sizes="(min-width: 768px) 25vw, 50vw"
                className="aspect-[4/3] h-auto w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute right-2 bottom-2 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] text-paper">Enlarge</span>
            </button>
          </li>
        ))}
      </ul>
      {caption && <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">{caption}</figcaption>}

      <dialog
        ref={dialog}
        aria-label={open?.alt ?? "Image"}
        onClose={() => setOpen(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-2 font-sans backdrop:bg-[rgba(17,17,17,0.82)] backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="flex flex-col items-center gap-3">
            <Image
              src={open.src}
              alt={open.alt}
              sizes="92vw"
              className="h-auto max-h-[84vh] w-auto max-w-[92vw] rounded-md shadow-2xl"
            />
            <div className="flex items-center gap-4 text-sm text-paper">
              <span className="max-w-[40rem] text-paper/80">{open.alt}</span>
              <button
                type="button"
                autoFocus
                onClick={() => dialog.current?.close()}
                className="h-10 shrink-0 rounded-full border border-paper/40 px-4 hover:bg-paper/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </figure>
  );
}
