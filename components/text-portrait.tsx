"use client";

import { useEffect, useRef, useState } from "react";
import { textPortrait } from "@/content/text-portrait";

// A monospace-style grid; each character is centred in its cell, since the
// site's typeface is proportional.
const CELL = { w: 6, h: 10.3 };

// A portrait set in her own words, in the site's type: each letter is larger,
// bolder and darker where the photo is darker. Rows develop in one after
// another when it scrolls into view; with reduced motion it is simply there.
export function TextPortrait({ label }: { label: string }) {
  const cols = textPortrait[0][0].length;
  const ref = useRef<SVGSVGElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      role="img"
      aria-label={label}
      viewBox={`0 0 ${cols * CELL.w} ${textPortrait.length * CELL.h}`}
      className={`text-portrait block h-auto w-full font-sans text-ink ${shown ? "is-shown" : ""}`}
      fill="currentColor"
    >
      {textPortrait.map(([chars, tones], r) => (
        <text
          key={r}
          y={(r + 0.8) * CELL.h}
          fontSize={9}
          textAnchor="middle"
          style={{ transitionDelay: `${r * 25}ms` }}
        >
          {Array.from(chars).map((ch, c) => {
            if (ch === " ") return null;
            const d = Number(tones[c]) / 9;
            return (
              <tspan
                key={c}
                x={(c + 0.5) * CELL.w}
                fontSize={(9 * (0.85 + 0.35 * d)).toFixed(1)}
                fontWeight={Math.round(200 + 700 * d)}
                fillOpacity={(0.15 + 0.85 * d).toFixed(2)}
              >
                {ch}
              </tspan>
            );
          })}
        </text>
      ))}
    </svg>
  );
}
