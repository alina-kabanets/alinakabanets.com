import { ideaSheets } from "@/content/paper";
import { Tape } from "./tape";

// Lined notepad pages of ideas, one per theme, taped to the page and each a
// little askew. Every idea notes which Paper feature it builds on, from the
// build log and roadmap. Numbering runs on across the sheets and reads across
// rows: on wider screens even sheets go in the left column and odd ones in the
// right, so uneven heights still pack together. On phones the columns dissolve
// (display: contents) and `order` keeps the sheets in reading order.

const tilt = [-0.8, 0.6, -0.4, 0.9, -0.6];
const tapeTilt = [-3, 4, -2, 3, -4];

// Faint ruled lines every 1.75rem and a red margin, like a notepad page. Every
// line of text uses leading-7 (1.75rem) so it sits on the rules.
const ruled = {
  backgroundImage:
    "linear-gradient(90deg, transparent 2.1rem, rgba(220,80,60,0.28) 2.1rem, rgba(220,80,60,0.28) calc(2.1rem + 1px), transparent calc(2.1rem + 1px)), repeating-linear-gradient(180deg, transparent 0 calc(1.75rem - 1px), rgba(96,148,244,0.16) calc(1.75rem - 1px) 1.75rem)",
};

// A star scribbled in yellow marker in the right margin, next to the ideas
// I'd start with. Drawn the way people draw stars by hand: five crossing
// strokes in one go, slightly bowed, uneven, ending just past where it began.
// A touch of displacement roughens the marker edge.
const starPath =
  "M6.4 29.6 Q10.4 16.4 15.3 2.9 Q19.4 15.8 24.6 28.4 Q13.4 20.9 1.9 12.7 Q15.4 11.4 28.7 11.9 Q18 20.4 5.4 30.6";

function MarkerStar({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 30 33" className={`overflow-visible text-[#f2bf2a] mix-blend-multiply ${className}`}>
      <filter id="marker-edge" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="4" />
        <feDisplacementMap in="SourceGraphic" scale="1.2" />
      </filter>
      <path
        d={starPath}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#marker-edge)"
      />
    </svg>
  );
}

export function IdeaSheets() {
  const starts = ideaSheets.map((_, i) =>
    ideaSheets.slice(0, i).reduce((n, sheet) => n + sheet.ideas.length, 0),
  );

  return (
    <>
      <p className="col-span-12 -mb-4 flex items-center gap-2 text-sm text-muted md:col-span-8 md:col-start-5">
        <MarkerStar className="size-5 -rotate-6" />
        The three I’d start with.
      </p>
      <div className="col-span-12 flex flex-col gap-12 pt-2 md:flex-row md:items-start md:gap-8">
        {[0, 1].map((column) => (
          <div
            key={column}
            className="contents md:flex md:flex-1 md:flex-col md:gap-12"
          >
            {ideaSheets.map((sheet, s) =>
              s % 2 !== column ? null : (
                <div
                  key={sheet.title}
                  className="relative order-(--order) md:order-none"
                  style={{ "--order": s } as React.CSSProperties}
                >
                  <Tape
                    className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2"
                    rotate={tapeTilt[s % tapeTilt.length]}
                  />
                  <div
                    className="relative bg-[#fdfdfb] px-6 pt-7 pb-7 shadow-[0_1px_2px_rgba(17,17,17,0.06),0_14px_30px_-16px_rgba(17,17,17,0.3)] md:px-10"
                    style={{ ...ruled, rotate: `${tilt[s % tilt.length]}deg` }}
                  >
                    <p className="pl-6 font-paper-mono text-[11px] leading-7 tracking-[0.06em] text-ink uppercase md:pl-2">
                      {sheet.title}
                    </p>
                    <ol
                      className="mt-7 space-y-7 pl-6 md:pl-2"
                      start={starts[s] + 1}
                    >
                      {sheet.ideas.map((idea, i) => (
                        <li
                          key={idea.title}
                          className="relative grid grid-cols-[1.75rem_1fr] gap-x-2"
                        >
                          {"starred" in idea && (
                            <MarkerStar className="absolute -top-1 -right-3 size-8 rotate-[8deg] md:-right-7" />
                          )}
                          <span className="font-paper-mono text-[13px] leading-7 text-muted">
                            {String(starts[s] + i + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="text-base leading-7 font-medium">
                              {idea.title}
                              {"starred" in idea && (
                                <span className="sr-only">
                                  {" "}
                                  (one of the three I’d start with)
                                </span>
                              )}
                            </p>
                            <p className="text-sm leading-7 text-ink/75">
                              {idea.body}
                            </p>
                            {"buildsOn" in idea && (
                              <p className="font-paper-mono text-[11px] leading-7 text-muted">
                                builds on: {idea.buildsOn}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ),
            )}
          </div>
        ))}
      </div>
    </>
  );
}
