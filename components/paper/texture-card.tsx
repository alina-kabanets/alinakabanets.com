"use client";

import { PaperTexture } from "@paper-design/shaders-react";

// Paper's own paper-texture shader (Apache-2.0), tinted to the site palette.
// Static: speed 0, so there's no animation to respect reduced motion for.
export function TextureCard() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[#efeee8]">
      <PaperTexture
        className="absolute inset-0 h-full w-full"
        colorBack="#e4e2dc"
        colorPaper="#f7f6f1"
        colorShadow="#bdbab2"
        speed={0}
        fit="cover"
        scale={1}
        folds={0.55}
        wrinkles={0.9}
        crumples={0.2}
        fiber={0.45}
        roughness={0.35}
        drops={0.25}
        seed={7}
      />
    </div>
  );
}
