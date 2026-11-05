import { stackIcons } from "@/lib/stack-icons";

// The tools a piece of work was built with, shown first so engineering is
// visible next to the design and psychology. Each name gets its mark, in ink;
// a combined tag like "React / TypeScript" puts each mark before its own name.
function Mark({ d }: { d: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-[1.05em] shrink-0" fill="currentColor">
      <path d={d} fillRule="evenodd" />
    </svg>
  );
}

export function StackTags({
  items,
  className = "",
  pill = "border-ink/50",
}: {
  items: readonly string[];
  className?: string;
  pill?: string;
}) {
  return (
    <ul aria-label="Stack" className={`flex flex-wrap items-center gap-1.5 text-sm ${className}`}>
      {items.map((item) => (
        <li key={item} className={`flex h-[2em] items-center gap-1.5 rounded-full border px-2.5 ${pill}`}>
          {item.split(" / ").map((part, i) => (
            <span key={part} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>/</span>}
              {stackIcons[part] && <Mark d={stackIcons[part]} />}
              {part}
            </span>
          ))}
        </li>
      ))}
    </ul>
  );
}
