"use client";

import dynamic from "next/dynamic";

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
  return <Garden />;
}
