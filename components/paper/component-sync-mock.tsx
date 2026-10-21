"use client";

import { useEffect, useRef, useState } from "react";

// Codebase components as the source of truth, as a working prototype. The left
// panel lists every component in the repo with its sync status, the artboard
// says when code has moved on, and the agent's terminal is docked in Paper and
// speaks design: component pills find things on the canvas, the thumbnail
// selects the artboard, questions come with buttons, and the selection rides
// along with the next prompt. In Paper's own greys.

type Status = "sync" | "code" | "design";
type Plan = "Free" | "Pro" | "Team";
type Focus = string | null; // a component name, or "Pricing" for the artboard
type Line = { from: "you" | "agent"; text: string; undo?: boolean };

const statusDot: Record<Status, string> = {
  sync: "bg-[#3E9C8F]",
  code: "bg-[#eb4e27]",
  design: "bg-[#6094f4]",
};

const library: { name: string; uses: number; status: Status }[] = [
  { name: "Avatar", uses: 14, status: "sync" },
  { name: "Badge", uses: 9, status: "design" },
  { name: "Button", uses: 41, status: "sync" },
  { name: "Card", uses: 22, status: "sync" },
  { name: "Input", uses: 17, status: "sync" },
  { name: "PricingCard", uses: 3, status: "code" },
  { name: "Tabs", uses: 6, status: "sync" },
];

const onArtboard = ["PricingCard", "Button", "Badge"];

const plans: { plan: Plan; price: string }[] = [
  { plan: "Free", price: "$0" },
  { plan: "Pro", price: "$16" },
  { plan: "Team", price: "$40" },
];

// A dashed outline and a name tag, shown on whatever the focused pill points at.
const found = "outline-1 outline-offset-2 outline-dashed outline-[#6094f4]";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="pointer-events-none absolute -top-4 left-0 z-10 rounded-sm bg-[#6094f4] px-1 font-paper-mono text-[9px] leading-[14px] whitespace-nowrap text-white">
      {children}
    </span>
  );
}

function Legend({ status, label }: { status: Status; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-1.5 rounded-full ${statusDot[status]}`} />
      {label}
    </span>
  );
}

export function ComponentSyncMock() {
  const [focus, setFocus] = useState<Focus>(null);
  const [selected, setSelected] = useState<Plan>("Pro");
  const [synced, setSynced] = useState(false);
  const [flash, setFlash] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [log, setLog] = useState<Line[]>([]);
  const [draft, setDraft] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn: () => void, ms: number) => timers.current.push(setTimeout(fn, ms));
  const say = (line: Line) => setLog((current) => [...current, line].slice(-4));

  const toggle = (name: string) => setFocus((current) => (current === name ? null : name));
  const is = (name: string) => focus === name;

  const update = () => {
    if (synced) return;
    setSynced(true);
    setAnswered(true);
    setFlash(true);
    later(() => setFlash(false), 1400);
    say({ from: "agent", text: "Updated artboard “Pricing” from PricingCard.tsx. Design and code are in sync.", undo: true });
  };

  const undo = () => {
    setSynced(false);
    setAnswered(false);
    setFlash(false);
    say({ from: "agent", text: "Undone. The artboard is back to the design version; PricingCard.tsx is unchanged." });
  };

  const notNow = () => {
    setAnswered(true);
    say({ from: "agent", text: "Okay. I’ll build from the code version and leave the artboard as it is." });
  };

  const ask = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    say({ from: "you", text: `[${selected} card] ${text}` });
    later(
      () =>
        say({
          from: "agent",
          text: `In Paper, this would change only the ${selected} card. (This is a mock: try the pills and buttons.)`,
        }),
      600,
    );
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setFocus(null);
    setSelected("Pro");
    setSynced(false);
    setFlash(false);
    setAnswered(false);
    setLog([]);
    setDraft("");
  };

  const status = (name: string, base: Status): Status => (name === "PricingCard" && synced ? "sync" : base);
  const pill = (name: string) => (
    <button
      type="button"
      onClick={() => toggle(name)}
      aria-pressed={is(name)}
      className={`rounded px-1 py-px transition-colors ${
        is(name) ? "bg-[#6094f4] text-white" : "bg-[#6094f4]/15 text-[#2f5fc4] hover:bg-[#6094f4]/25"
      }`}
    >
      {name}
    </button>
  );
  const changed = flash ? "bg-[#fff1c2]" : "";
  const lastUpdate = log.findLastIndex((line) => line.undo);

  return (
    <figure className="col-span-12">
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-[#8e8e8e] text-[13px] text-[#222]">
        <div className="flex items-center gap-2 border-b border-black/10 bg-[#e8e8e8] px-3 py-2">
          <span className="rounded px-2 py-0.5 text-[#6b6b6b]">Start</span>
          <span className="rounded bg-[#f9f9f9] px-2 py-0.5 shadow-sm">Pricing page</span>
          <button
            type="button"
            onClick={reset}
            className="ml-auto rounded px-2 py-0.5 text-[12px] text-[#6b6b6b] hover:bg-[#f9f9f9] hover:text-[#222]"
          >
            Reset demo
          </button>
        </div>

        <div className="grid md:grid-cols-[14rem_1fr]">
          {/* Components from the codebase */}
          <nav aria-label="Mock components panel" className="border-b border-black/10 bg-[#f2f2f2] p-3 md:border-r md:border-b-0">
            <div className="flex rounded-md bg-[#e4e4e4] p-0.5 text-[12px]">
              <span className="flex-1 rounded px-2 py-1 text-center text-[#6b6b6b]">Layers</span>
              <span className="flex-1 rounded bg-[#f9f9f9] px-2 py-1 text-center shadow-sm">Components</span>
            </div>
            <p className="mt-3 px-1 font-paper-mono text-[11px] text-[#6b6b6b]">src/components · 7</p>
            <p className="mt-2 rounded-md bg-[#e4e4e4] px-2 py-1.5 text-[12px] text-[#6b6b6b]">Search components…</p>
            <ul className="mt-2 space-y-0.5">
              {library.map((c) => (
                <li key={c.name}>
                  <button
                    type="button"
                    onClick={() => toggle(c.name)}
                    aria-pressed={is(c.name)}
                    className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left transition-colors ${
                      is(c.name) ? "bg-[#e3e3e3] font-medium" : "hover:bg-[#e9e9e9]"
                    }`}
                  >
                    <span className={`size-1.5 shrink-0 rounded-full ${statusDot[status(c.name, c.status)]}`} />
                    <span className="flex-1">{c.name}</span>
                    <span className="text-[11px] text-[#6b6b6b]">{c.uses}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 min-h-8 px-1 text-[11px] leading-4 text-[#6b6b6b]" aria-live="polite">
              {focus && focus !== "Pricing" && !onArtboard.includes(focus)
                ? `${focus} isn’t on this artboard. Used ${library.find((c) => c.name === focus)?.uses} times elsewhere.`
                : focus && onArtboard.includes(focus)
                  ? `Showing ${focus} on the canvas.`
                  : ""}
            </p>
            <div className="mt-2 space-y-1 px-1 text-[11px] text-[#6b6b6b]">
              <Legend status="sync" label="In sync" />
              <Legend status="code" label="Code is ahead" />
              <Legend status="design" label="Design is ahead" />
            </div>
          </nav>

          {/* Canvas, with the agent docked along its bottom */}
          <div className="flex min-w-0 flex-col">
            <div className="min-w-0 flex-1 p-5 md:p-8">
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-white/85">Pricing</span>
                <span className="flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 shadow-sm">
                  <span className={`size-1.5 rounded-full ${synced ? statusDot.sync : statusDot.code}`} />
                  {synced ? "In sync · updated just now" : "Code is ahead · PricingCard.tsx changed 2h ago"}
                </span>
                {!synced && (
                  <button type="button" onClick={update} className="rounded-full bg-[#222] px-2 py-0.5 text-white hover:bg-black">
                    Update artboard
                  </button>
                )}
              </div>

              <div className={`relative mt-2 rounded-sm bg-white p-5 shadow-sm ${is("Pricing") ? "outline-2 outline-offset-2 outline-[#6094f4]" : ""}`}>
                {is("Pricing") && <Tag>Pricing · artboard</Tag>}
                <p className="text-center text-[15px] font-medium">Simple pricing</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {plans.map(({ plan, price }, i) => {
                    const hero = plan === "Pro";
                    return (
                      <button
                        type="button"
                        key={plan}
                        onClick={() => setSelected(plan)}
                        aria-pressed={selected === plan}
                        aria-label={`Select the ${plan} card`}
                        className={`relative flex flex-col rounded-md p-2.5 text-left transition-colors duration-700 ${
                          hero ? "bg-[#f2f2f2]" : "ring-1 ring-black/10"
                        } ${selected === plan ? "outline-2 outline-offset-2 outline-[#6094f4]" : is("PricingCard") ? found : ""}`}
                      >
                        {is("PricingCard") && i === 0 && <Tag>PricingCard × 3</Tag>}
                        <span className="flex items-center justify-between text-[10px] text-[#6b6b6b]">
                          {plan}
                          {hero && (
                            <span
                              className={`relative hidden rounded-full bg-[#222] px-1.5 text-[9px] text-white sm:inline ${is("Badge") ? found : ""}`}
                            >
                              {is("Badge") && <Tag>Badge</Tag>}
                              Popular
                            </span>
                          )}
                        </span>
                        <span className={`mt-0.5 rounded-sm text-[18px] leading-tight font-medium transition-colors duration-700 ${changed}`}>
                          {price}
                          {synced && <span className="text-[10px] font-normal text-[#6b6b6b]">/mo</span>}
                        </span>
                        {synced && (
                          <span className={`rounded-sm text-[9px] text-[#6b6b6b] transition-colors duration-700 ${changed}`}>
                            Billed yearly
                          </span>
                        )}
                        <span className="mt-2 block h-1 w-full rounded-full bg-[#e4e4e4]" />
                        <span className="mt-1 block h-1 w-3/4 rounded-full bg-[#e4e4e4]" />
                        <span
                          className={`relative mt-3 block rounded py-1 text-center text-[10px] ${
                            hero ? "bg-[#222] text-white" : "ring-1 ring-black/15"
                          } ${is("Button") ? found : ""}`}
                        >
                          {is("Button") && i === 0 && <Tag>Button × 3</Tag>}
                          {synced ? "Get started" : "Choose"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="mt-2 font-paper-mono text-[10px] text-white/80">Click a card to select it · click a pill to find it</p>
            </div>

            {/* The agent's terminal, docked in Paper */}
            <div className="border-t border-black/10 bg-[#f2f2f2] font-paper-mono text-[11px] leading-[1.7]">
              <div className="flex items-center gap-1 border-b border-black/10 px-2 py-1.5 font-sans text-[12px]">
                <span className="rounded bg-[#f9f9f9] px-2 py-0.5 shadow-sm">Agent</span>
                <span className="rounded px-2 py-0.5 text-[#6b6b6b]">Terminal</span>
                <span className="ml-auto flex items-center gap-1.5 truncate pr-1 text-[11px] text-[#6b6b6b]">
                  <span className="size-1.5 shrink-0 rounded-full bg-[#3E9C8F]" />
                  Claude Code · ~/code/acme-web
                </span>
              </div>
              <div className="space-y-1.5 px-3 py-3" aria-live="polite">
                <p>
                  <span className="text-[#3E9C8F]">❯</span> build the pricing page in code
                </p>
                <p className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[#6094f4]">●</span> Read
                  <button
                    type="button"
                    onClick={() => toggle("Pricing")}
                    aria-pressed={is("Pricing")}
                    className={`inline-flex items-center gap-1.5 rounded border bg-white py-0.5 pr-1.5 pl-0.5 transition-colors ${
                      is("Pricing") ? "border-[#6094f4]" : "border-black/10 hover:border-black/25"
                    }`}
                  >
                    <span aria-hidden className="grid h-4 w-6 grid-cols-3 gap-px rounded-sm bg-[#e4e4e4] p-0.5">
                      <span className="rounded-[1px] bg-white" />
                      <span className="rounded-[1px] bg-[#6094f4]/60" />
                      <span className="rounded-[1px] bg-white" />
                    </span>
                    Pricing
                  </button>
                </p>
                <p>
                  <span className="text-[#6094f4]">●</span> Using {pill("PricingCard")} {pill("Button")} {pill("Badge")} from
                  src/components. No new styles.
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  <p>
                    <span className="text-[#eb4e27]">●</span> {pill("PricingCard")} changed in code since this design.
                  </p>
                  {!answered && (
                    <span className="flex gap-1.5 font-sans">
                      <button type="button" onClick={update} className="rounded bg-[#222] px-2 py-0.5 text-white hover:bg-black">
                        Update artboard
                      </button>
                      <button
                        type="button"
                        onClick={notNow}
                        className="rounded px-2 py-0.5 text-[#6b6b6b] ring-1 ring-black/15 hover:bg-white"
                      >
                        Not now
                      </button>
                    </span>
                  )}
                </div>
                {log.map((line, i) => (
                  <p key={`${i}-${line.text}`}>
                    {line.from === "you" ? (
                      <span className="text-[#3E9C8F]">❯</span>
                    ) : (
                      <span className={synced ? "text-[#3E9C8F]" : "text-[#6094f4]"}>●</span>
                    )}{" "}
                    {line.text}
                    {/* Undo sits with the change it undoes, in the terminal. */}
                    {synced && i === lastUpdate && (
                      <button
                        type="button"
                        onClick={undo}
                        className="ml-2 rounded px-2 py-0.5 font-sans text-[#6b6b6b] ring-1 ring-black/15 hover:bg-white hover:text-[#222]"
                      >
                        ↶ Undo
                      </button>
                    )}
                  </p>
                ))}
              </div>
              <form
                onSubmit={ask}
                className="mx-3 mb-3 flex items-center gap-2 rounded-md bg-white px-2 py-1.5 font-sans text-[12px] ring-1 ring-black/10 focus-within:ring-[#6094f4]"
              >
                <span className="shrink-0 rounded bg-[#6094f4]/15 px-1.5 text-[11px] text-[#2f5fc4]">Selection · {selected} card</span>
                <label className="sr-only" htmlFor="sync-mock-prompt">
                  Ask the agent
                </label>
                <input
                  id="sync-mock-prompt"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Ask the agent, or type a command…"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#6b6b6b]"
                />
                <button type="submit" aria-label="Send" className="text-[#6b6b6b] hover:text-[#222]">
                  ↵
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">
        Try it: click the pills to find components, the thumbnail to select the artboard, and “Update artboard” to pull
        in the code change. Every component in the codebase lives in Paper with its sync status, so agents build from
        it instead of inventing new styles, and the agent’s terminal is docked inside Paper and speaks design.
      </figcaption>
    </figure>
  );
}
