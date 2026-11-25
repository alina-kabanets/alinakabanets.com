// Diagrams for the dashboard section of the KPI tree case study. Drawn in
// code, ink on white, no data: they show ideas, not numbers.

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 12 10" className={`h-2.5 w-3 text-ink/50 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M0 5h11M7 1l4 4-4 4" />
    </svg>
  );
}

// ── Six small illustrations, one per design decision ──────────────────────

function SameRows() {
  return (
    <div className="flex h-full items-center justify-center gap-3">
      <div className="grid grid-cols-2 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="block h-5 w-7 rounded-sm border border-ink/30" />
        ))}
      </div>
      <Arrow className="rotate-180" />
      <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] text-paper">rows</span>
      <Arrow />
      <div className="space-y-1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="block h-1.5 w-16 rounded-full bg-ink/25" />
        ))}
      </div>
    </div>
  );
}

function Density() {
  return (
    <div className="flex h-full flex-wrap content-center items-center justify-center gap-1.5 px-4">
      {["On plan", "On plan", "Behind", "On plan", "On plan", "On plan"].map((label, i) => (
        <span
          key={i}
          className={`rounded-full px-2 py-0.5 text-[11px] ${
            label === "Behind" ? "bg-ink text-paper" : "border border-ink/20 text-muted"
          }`}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function Traced() {
  return (
    <div className="flex h-full items-center justify-center gap-4">
      <span className="text-3xl tracking-[-0.03em]">129</span>
      <svg aria-hidden viewBox="0 0 24 40" className="h-10 w-6 text-ink/40" fill="none" stroke="currentColor">
        <path d="M0 20h8M8 4v32M8 4h16M8 15h16M8 25h16M8 36h16" strokeDasharray="2 2" />
      </svg>
      <ul className="space-y-1.5 text-[11px] text-muted">
        {["Account A", "Account B", "Account C", "Account D", "Account E"].map((a) => (
          <li key={a} className="leading-none">
            {a}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Gap() {
  return (
    <svg aria-hidden viewBox="0 0 200 90" className="h-full w-full">
      <rect x="78" y="10" width="34" height="66" className="fill-ink/[0.06]" />
      <text x="95" y="20" textAnchor="middle" className="fill-muted text-[9px]">
        No reading
      </text>
      <line x1="10" x2="190" y1="76" y2="76" className="stroke-ink/20" />
      <path d="M14 60 L38 54 L62 50 L78 46" fill="none" className="stroke-ink" strokeWidth="1.5" />
      <path d="M112 40 L136 36 L160 30 L186 26" fill="none" className="stroke-ink" strokeWidth="1.5" />
      {[
        [14, 60],
        [38, 54],
        [62, 50],
        [136, 36],
        [160, 30],
        [186, 26],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.5" className="fill-ink" />
      ))}
    </svg>
  );
}

function Context() {
  return (
    <svg aria-hidden viewBox="0 0 200 90" className="h-full w-full">
      <line x1="10" x2="190" y1="76" y2="76" className="stroke-ink/20" />
      <line x1="96" x2="96" y1="14" y2="76" strokeDasharray="2 3" className="stroke-ink/50" />
      <text x="100" y="20" className="fill-ink text-[9px]">
        Webinar
      </text>
      <path d="M14 62 L40 60 L66 58 L96 26 L122 57 L148 55 L186 52" fill="none" className="stroke-ink" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function CopyText() {
  return (
    <div className="flex h-full items-center justify-center gap-3">
      <div className="w-16 rounded-md border border-ink/30 p-2">
        <span className="block h-1.5 w-6 rounded-full bg-ink/30" />
        <span className="mt-2 block text-sm leading-none">£</span>
        <span className="mt-2 block h-1 w-full rounded-full bg-ink" />
      </div>
      <Arrow />
      <div className="w-28 rounded-xl rounded-bl-sm bg-ink p-2.5">
        {[20, 16, 18, 12].map((w, i) => (
          <span key={i} className="mb-1 block h-1 rounded-full bg-paper/70 last:mb-0" style={{ width: `${w * 4}px` }} />
        ))}
      </div>
    </div>
  );
}

const DECISIONS = [
  {
    title: "Results and levers take different shapes",
    body: "The four outcomes are tiles; the six drivers are a ladder table in funnel order. Both are built from the same rows, so they can never disagree.",
    art: SameRows,
  },
  {
    title: "Density without noise",
    body: "Mostly black, white and grey. A tinted pill appears only when a number is behind or close to target.",
    art: Density,
  },
  {
    title: "Every number can be traced",
    body: "Tiles open the exact accounts or workspaces counted, and hover panels show what a figure is made of.",
    art: Traced,
  },
  {
    title: "Show the gap, don’t invent the number",
    body: "When a figure can’t be read, the page says why. A missing week is a gap in the chart, never a zero.",
    art: Gap,
  },
  {
    title: "Context next to the data",
    body: "Webinars, launches and mail-outs are markers on the charts, so a spike explains itself.",
    art: Context,
  },
  {
    title: "It feeds the ritual",
    body: "“Copy update” turns the same numbers into text for the team chat, instead of replacing the chat.",
    art: CopyText,
  },
];

export function DesignDecisions() {
  return (
    <figure className="col-span-12">
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:gap-5">
        {DECISIONS.map(({ title, body, art: Art }) => (
          <li key={title} className="flex flex-col rounded-xl border border-ink/20 p-4">
            <div className="h-28 rounded-lg bg-tint">
              <Art />
            </div>
            <p className="mt-4 text-[15px] leading-snug font-medium">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
          </li>
        ))}
      </ul>
    </figure>
  );
}

// ── How it works: one pipeline from sources to sections ─────────────────────

const SOURCES = [
  { name: "Product database", note: "Accounts, workspaces, actions" },
  { name: "Billing", note: "Daily subscription snapshots" },
  { name: "Exchange rates", note: "European Central Bank, per day" },
  { name: "Web analytics", note: "Visits and sign-up steps" },
];

const RULES = [
  "Complete UK weeks",
  "Months built from weeks (Thursday rule)",
  "Cohorts read when their window is complete",
  "Staff, test and sample content excluded by one rule",
  "Recurring revenue counts software only",
  "A missing day’s rate leaves out only that day",
];

const OUTPUTS = ["Outcome tiles", "Ladder table", "Revenue staircase", "Trends", "Copy update"];

function Column({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <p className="mb-2 text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{label}</p>
      {children}
    </div>
  );
}

function Joint() {
  return (
    <div aria-hidden className="flex items-center justify-center py-1 xl:pt-7">
      <Arrow className="rotate-90 xl:rotate-0" />
    </div>
  );
}

export function HowItWorks() {
  return (
    <figure className="col-span-12">
      <div className="grid gap-2 xl:grid-cols-[1fr_auto_0.9fr_auto_1.4fr_auto_0.9fr] xl:gap-3">
        <Column label="Sources">
          <ul className="space-y-2">
            {SOURCES.map((s) => (
              <li key={s.name} className="rounded-lg border border-ink/20 px-3 py-2">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs text-muted">{s.note}</p>
              </li>
            ))}
          </ul>
        </Column>
        <Joint />
        <Column label="Access">
          <div className="flex h-full flex-col rounded-xl border border-ink/20 p-4 xl:h-[calc(100%-1.6rem)]">
            <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            <p className="mt-3 text-[15px] leading-snug font-medium">Read-only role</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Can only read the tables it needs. A write is refused by the database itself, not just by the code.
            </p>
          </div>
        </Column>
        <Joint />
        <Column label="One query layer">
          <div className="rounded-xl bg-ink p-4 text-paper xl:h-[calc(100%-1.6rem)]">
            <p className="text-[15px] leading-snug font-medium">Pure functions, tested</p>
            <p className="mt-1 text-sm text-paper/70">Every section reads from here, so they always agree.</p>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {RULES.map((r) => (
                <li key={r} className="rounded-full border border-paper/30 px-2.5 py-1 text-xs leading-snug">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </Column>
        <Joint />
        <Column label="The page">
          <ul className="space-y-2">
            {OUTPUTS.map((o) => (
              <li key={o} className="rounded-lg border border-ink/20 px-3 py-2 text-sm font-medium">
                {o}
              </li>
            ))}
          </ul>
        </Column>
      </div>
      <figcaption className="mt-4 max-w-[38rem] text-sm leading-relaxed text-muted">
        Read-only by design, one source of truth, and the hard rules written down in code with tests. Every tab can also
        run on example data, which is how the design was reviewed before the live data was wired up.
      </figcaption>
    </figure>
  );
}
