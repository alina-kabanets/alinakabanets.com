import { starterPlants } from "@/content/garden";

// A still drawing of the starter plants on their soil line, for the homepage.
// Plain SVG, so the homepage doesn't load tldraw.
export function GardenStrip({ className = "" }: { className?: string }) {
  const filterId = "garden-strip-wax";
  return (
    <svg className={className} viewBox="100 -300 1400 330" role="img" aria-label="Crayon plants growing along a line of soil">
      <defs>
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" result="d" />
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="9" result="g" />
          <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="holes" />
          <feComposite in="d" in2="holes" operator="in" />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {starterPlants.map((plant) => (
          <g key={plant.id} transform={`translate(${plant.x} 0)`}>
            {plant.strokes.map((stroke, i) => (
              <path key={i} d={stroke.d} stroke={stroke.color} strokeWidth={stroke.width} />
            ))}
          </g>
        ))}
        <path d="M 100 1 C 400 -3 700 4 1000 0 S 1400 -2 1500 1" stroke="#7a5a3f" strokeWidth={5} />
      </g>
    </svg>
  );
}
