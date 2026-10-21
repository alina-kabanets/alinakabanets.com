// Masking tape: a translucent strip with soft, uneven ends. Used both as a
// label (with text) and to hold notes to the page (empty).

export function Tape({
  children,
  className = "",
  rotate = -2,
}: {
  children?: React.ReactNode;
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      className={`paper-tape inline-block px-5 ${className.includes("absolute") ? "" : "relative"} py-1.5 font-paper-mono text-[13px] tracking-[0.02em] text-ink/80 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}

// A note held to the page by two pieces of tape, slightly askew.
export function TapedNote({
  children,
  rotate = 0,
  className = "",
}: {
  children: React.ReactNode;
  rotate?: number;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ transform: `rotate(${rotate}deg)` }}>
      <Tape className="absolute -top-3 left-6 z-10 h-6 w-16" rotate={-6} />
      <Tape className="absolute -top-3 right-6 z-10 h-6 w-16" rotate={5} />
      <div className="h-full bg-[#fbfaf6] p-6 shadow-[0_1px_2px_rgba(17,17,17,0.06),0_8px_24px_-12px_rgba(17,17,17,0.18)]">
        {children}
      </div>
    </div>
  );
}
