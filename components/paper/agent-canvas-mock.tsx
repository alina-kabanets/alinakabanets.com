// Designing with an agent on the canvas: references and a brief go in, six
// directions for a pricing card come out, and one is selected and refined with
// an inline prompt. Static, in Paper's own greys.

type Variant = {
  card: string;
  muted: string;
  price: string;
  button: string;
  bar: string;
  label: string;
  layout?: "centre" | "split";
};

const variants: Variant[] = [
  { card: "bg-white text-[#222]", muted: "text-[#6b6b6b]", price: "text-[22px]", button: "bg-[#222] text-white", bar: "bg-[#e4e4e4]", label: "Quiet" },
  { card: "bg-[#222] text-white", muted: "text-white/60", price: "text-[22px]", button: "bg-white text-[#222]", bar: "bg-white/15", label: "Night" },
  { card: "bg-[#f2efe6] text-[#222]", muted: "text-[#6b6b6b]", price: "text-[30px] tracking-[-0.04em]", button: "bg-[#eb4e27] text-white", bar: "bg-[#222]/10", label: "Big number", layout: "centre" },
  { card: "bg-[#6094f4] text-white", muted: "text-white/70", price: "text-[22px]", button: "bg-white text-[#6094f4]", bar: "bg-white/25", label: "Colour" },
  { card: "bg-white text-[#222] ring-1 ring-[#222]", muted: "text-[#6b6b6b]", price: "font-paper-mono text-[18px]", button: "border border-[#222] text-[#222]", bar: "bg-[#222]/10", label: "Mono" },
  { card: "bg-gradient-to-b from-[#fff4e8] to-[#ffd9c7] text-[#222]", muted: "text-[#6b6b6b]", price: "text-[22px]", button: "bg-[#222] text-white rounded-full", bar: "bg-[#222]/10", label: "Warm", layout: "split" },
];

function MiniCard({ v, selected }: { v: Variant; selected?: boolean }) {
  return (
    <div className="relative">
      <p className="mb-1 text-[10px] text-white/80">{v.label}</p>
      <div
        className={`flex aspect-[4/5] flex-col rounded-md p-2.5 shadow-sm ${v.card} ${
          v.layout === "centre" ? "items-center text-center" : ""
        } ${selected ? "outline-2 outline-offset-2 outline-[#6094f4]" : ""}`}
      >
        <p className={`text-[10px] ${v.muted}`}>Pro</p>
        <p className={`mt-0.5 leading-none font-medium ${v.price}`}>
          $16<span className={`text-[10px] font-normal ${v.muted}`}>/mo</span>
        </p>
        <div className={`mt-2 space-y-1 ${v.layout === "centre" ? "w-3/4" : "w-full"}`}>
          <span className={`block h-1 w-full rounded-full ${v.bar}`} />
          <span className={`block h-1 w-4/5 rounded-full ${v.bar}`} />
          <span className={`block h-1 w-3/5 rounded-full ${v.bar}`} />
        </div>
        <span
          className={`mt-auto block rounded py-1 text-center text-[10px] ${v.button} ${
            v.layout === "split" ? "self-start px-3" : "w-full"
          }`}
        >
          Choose
        </span>
      </div>
      {selected && (
        <>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded bg-[#6094f4] px-1.5 py-0.5 text-[9px] whitespace-nowrap text-white">
            Selected
          </span>
        </>
      )}
    </div>
  );
}

export function AgentCanvasMock() {
  return (
    <figure className="col-span-12">
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-[#8e8e8e] text-[13px] text-[#222]">
        <div className="flex items-center gap-2 border-b border-black/10 bg-[#e8e8e8] px-3 py-2">
          <span className="rounded px-2 py-0.5 text-[#6b6b6b]">Start</span>
          <span className="rounded bg-[#f9f9f9] px-2 py-0.5 shadow-sm">Pricing ideas</span>
        </div>

        <div className="grid md:grid-cols-[1fr_15rem]">
          {/* Canvas */}
          <div className="grid min-w-0 gap-6 p-5 md:grid-cols-[9rem_1fr] md:p-6">
            {/* References and brief */}
            <div>
              <p className="text-[11px] text-white/85">References</p>
              <div className="mt-2 grid grid-cols-3 gap-1.5 md:grid-cols-1">
                <span className="block aspect-[4/3] rounded md:aspect-[16/10] bg-gradient-to-br from-[#ffd9c7] via-[#f2efe6] to-[#6094f4]/60 shadow-sm" />
                <span className="flex aspect-[4/3] items-center justify-center rounded bg-white text-[22px] md:aspect-[16/10] font-medium tracking-[-0.04em] shadow-sm">
                  Aa
                </span>
                <span className="block aspect-[4/3] rounded md:aspect-[16/10] bg-[#222] bg-[repeating-linear-gradient(135deg,transparent_0_6px,rgba(255,255,255,0.12)_6px_7px)] shadow-sm" />
              </div>
              <p className="mt-3 rounded-md bg-white/90 p-2 text-[11px] leading-snug shadow-sm">
                <span className="font-medium">Brief:</span> a pricing card for one plan. Calm, confident, one clear action.
              </p>
            </div>

            {/* Six directions */}
            <div className="min-w-0">
              <p className="text-[11px] text-white/85">6 directions · on your tokens</p>
              <div className="mt-2 grid grid-cols-3 gap-x-3 gap-y-4 lg:grid-cols-6">
                {variants.map((v, i) => (
                  <MiniCard key={v.label} v={v} selected={i === 2} />
                ))}
              </div>

              {/* Select, then ask */}
              <div className="mt-9 flex items-center gap-2 rounded-lg bg-white p-1.5 pl-3 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.45)] md:max-w-[26rem] lg:ml-[calc((100%-0.75rem*5)/6*2+1.5rem)]">
                <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 shrink-0 text-[#6094f4]" fill="currentColor">
                  <path d="M8 0l1.8 6.2L16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" />
                </svg>
                <span className="min-w-0 flex-1 truncate">More air, and keep the price as the hero</span>
                <span className="shrink-0 rounded-md bg-[#222] px-2.5 py-1 text-[11px] text-white">Apply</span>
              </div>
            </div>
          </div>

          {/* Agent pane */}
          <aside aria-label="Mock agent pane" className="border-t border-black/10 bg-[#f2f2f2] p-4 md:border-t-0 md:border-l">
            <p className="flex items-center gap-2 text-[12px] text-[#6b6b6b]">
              <span className="size-2 rounded-full bg-[#3E9C8F]" /> Claude Code · connected
            </p>
            <div className="mt-4 space-y-3">
              <p className="ml-6 rounded-lg bg-[#e3e3e3] p-2.5">Six directions for this brief, using the references.</p>
              <p className="mr-6 rounded-lg bg-white p-2.5">Done: six variants on the canvas, all on your tokens.</p>
              <p className="ml-6 rounded-lg bg-[#e3e3e3] p-2.5">Push “Big number” further.</p>
              <p className="mr-6 rounded-lg bg-white p-2.5">Editing the selection only. The other five stay as they are.</p>
            </div>
          </aside>
        </div>
      </div>
      <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">
        References and a brief in, six directions out. Select one and ask for changes right on the canvas, or keep
        talking in the sidebar.
      </figcaption>
    </figure>
  );
}
