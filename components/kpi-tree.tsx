// The KPI tree as a diagram: each row is a lever on the row above it.
// Shows structure only. No targets, revenue figures or volumes.
//
// Layout follows the card's own width (container queries), because the same
// diagram sits in a narrow homepage column and a wide case study page.

const drivers = [
  { name: "Visits", metrics: "The founders’ lane", collapse: false },
  { name: "Sign-up start", metrics: "CTA click rate · section reach", collapse: true },
  { name: "Mobile sign-up", metrics: "Phone vs desktop start rate", collapse: true },
  { name: "Activation, 48 h", metrics: "Time to value · checklist completion", collapse: false },
  { name: "Retention, 4 weeks", metrics: "Invite-sent rate · solo vs team retention", collapse: true },
  { name: "Free to paid", metrics: "Prompt shown to clicked · limit hit to upgrade", collapse: false },
];

const revenueLines = [
  ["Self-serve", "product funnel"],
  ["Teams", "sales-led"],
  ["Partners", "sales-led"],
];

const label = "text-[11px] font-medium tracking-[0.12em] text-paper/75 uppercase";
const line = "bg-paper/50";
// The bracket over a row of n boxes: one shape that runs from the centre of
// the first box to the centre of the last, with its two end ticks. Drawing it
// as one element keeps the corners closed. `gaps` is the total gap width.
const bracket = (n: number, gaps: string) => {
  const edge = `calc((100% - ${gaps}) / ${2 * n} - 0.5px)`;
  return { left: edge, right: edge };
};
// A tick from a middle box up to the bracket above its row.
const tick = "relative before:absolute before:-top-3 before:left-1/2 before:hidden before:h-3 before:w-px before:-translate-x-1/2 before:bg-paper/50";

// The connector between two levels. The level's label sits beside the line,
// not in its path, so the tree stays joined up.
// `through` extends the same line down across the bracket to the middle box,
// so the centre connector is one element with no joint to drift.
function Join({ children, through = false }: { children: string; through?: boolean }) {
  return (
    <div className="relative z-10 h-9">
      <p className={`${label} absolute bottom-2 left-0`}>{children}</p>
      <div
        aria-hidden
        className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 ${line} ${
          through ? "@xl:h-[calc(100%+0.75rem)]" : ""
        }`}
      />
    </div>
  );
}

export function KpiTree() {
  return (
    <figure className="@container rounded-xl bg-ink p-5 text-paper md:p-8">
      {/* The tree widens as it goes down: one target, three revenue lines,
          one north star, six drivers. */}
      <p className={`${label} mb-2`}>Target</p>
      <p className="mx-auto rounded-lg border-2 border-paper px-4 py-3 text-center text-base font-medium @xl:w-3/5 @xl:text-lg">
        The company’s revenue target, with a first checkpoint
      </p>

      <Join through>Revenue lines</Join>
      <div className="relative mx-auto @xl:w-5/6 @xl:pt-3">
        <div
          aria-hidden
          className="absolute top-0 hidden h-3 border-x border-t border-paper/50 @xl:block"
          style={bracket(3, "1rem")}
        />
        <ul className="grid gap-2 @xl:grid-cols-3">
          {revenueLines.map(([name, note]) => (
            <li key={name} className="rounded-lg border border-paper/30 bg-paper/[0.08] px-3 py-2.5 text-center text-sm">
              <span className="font-medium">{name}</span> <span className="text-paper/75">· {note}</span>
            </li>
          ))}
        </ul>
      </div>

      <Join>North star</Join>
      <p className="mx-auto rounded-lg border border-paper/60 bg-paper/[0.18] px-4 py-3 text-center text-sm @xl:w-2/3">
        <span className="text-base font-medium @xl:text-lg">Weekly active collaborating workspaces</span>
        <span className="mt-0.5 block text-paper/85">
          Two or more members, and at least one comment or review action that week
        </span>
      </p>

      <Join>Drivers</Join>
      <div className="relative @4xl:pt-3">
        <div
          aria-hidden
          className="absolute top-0 hidden h-3 border-x border-t border-paper/50 @4xl:block"
          style={bracket(6, "2.5rem")}
        />
        <ol className="grid grid-cols-2 gap-2 @xl:grid-cols-3 @4xl:grid-cols-6">
          {drivers.map((driver, index) => (
            <li
              key={driver.name}
              className={`rounded-lg px-3.5 py-3 ${index > 0 && index < 5 ? `${tick} @4xl:before:block` : ""} ${
                driver.collapse ? "bg-paper text-ink" : "border border-paper/30 bg-paper/[0.08]"
              }`}
            >
              <p className={`text-[11px] font-medium ${driver.collapse ? "text-ink/70" : "text-paper/75"}`}>
                {index + 1}
                {driver.collapse && <span> · collapse point</span>}
              </p>
              <p className="mt-1 text-[15px] leading-snug font-medium">{driver.name}</p>
              <p className={`mt-2 text-[13px] leading-snug ${driver.collapse ? "text-ink/80" : "text-paper/85"}`}>
                {driver.metrics}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <figcaption className="mt-6 border-t border-paper/25 pt-4 text-sm leading-relaxed text-paper/80">
        Each row is a lever on the one above. Design can only push the bottom row, through the design metrics on each
        card. The light cards are where the numbers collapsed at baseline.
      </figcaption>
    </figure>
  );
}
