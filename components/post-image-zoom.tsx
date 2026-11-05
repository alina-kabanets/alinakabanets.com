"use client";

import { useEffect, useRef, useState } from "react";

// Click an image in a post to see it full size; Escape, Close or a click
// outside closes it. Same look as the screenshot viewer in the case studies.
export function PostImageZoom() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [image, setImage] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target instanceof HTMLImageElement && target.closest(".post-body .post-images")) {
        setImage({ src: target.currentSrc || target.src, alt: target.alt });
        dialog.current?.showModal();
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-label={image?.alt ?? "Image"}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
      className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-2 font-sans backdrop:bg-[rgba(17,17,17,0.82)] backdrop:backdrop-blur-sm"
    >
      {image && (
        <figure className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- the post's own image, already loaded */}
          <img src={image.src} alt={image.alt} className="h-auto max-h-[84vh] w-auto max-w-[92vw] rounded-md shadow-2xl" />
          <figcaption className="flex items-center gap-4 text-sm text-paper">
            <span className="max-w-[40rem] text-paper/80">{image.alt}</span>
            <button
              type="button"
              autoFocus
              onClick={() => dialog.current?.close()}
              className="h-10 shrink-0 rounded-full border border-paper/40 px-4 hover:bg-paper/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
            >
              Close
            </button>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}
