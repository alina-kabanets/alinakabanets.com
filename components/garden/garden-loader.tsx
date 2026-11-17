"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

// tldraw only runs in the browser, so the garden loads after the page.
// Until then, the bare soil line holds its place.
const Garden = dynamic(() => import("./garden"), {
  ssr: false,
  loading: () => (
    <div className="mt-4 flex h-[360px] items-end md:h-[500px]" aria-hidden="true">
      <div className="mb-[18%] h-[3px] w-full bg-[#7a5a3f]/60" />
    </div>
  ),
});

export function GardenLoader() {
  // Next.js keeps the scroll position when the new page is still in view, so
  // arriving from far down the homepage would land partway down the garden.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return <Garden />;
}
