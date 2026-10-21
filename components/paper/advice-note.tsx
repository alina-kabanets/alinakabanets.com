"use client";

import { PaperTexture } from "@paper-design/shaders-react";
import { Caveat, Nothing_You_Could_Do } from "next/font/google";
import { useRef, useState } from "react";
import { profile } from "@/content/profile";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import envelopePhoto from "@/public/images/paper/envelope.png";
import pillarBox from "@/public/images/paper/pillar-box.jpg";

// write → sending → folding (the sheet folds in thirds) → inserting (it
// shrinks down to the open envelope) → sealing (it slides in, the flap closes)
// → posting (the envelope flies into the slot) → posted.
type Stage = "write" | "sending" | "folding" | "inserting" | "sealing" | "posting" | "posted";
type Flap = "closed" | "open" | "closing";

// The envelope's flap, cut out of the photo: the V from the top corners down
// to the tip under the stamp. BODY is everything else.
const FLAP = "polygon(0% 0%, 100% 0%, 100% 3%, 71% 48%, 60% 59%, 50% 64%, 40% 59%, 29.5% 49.5%, 0% 3%)";
const BODY = "polygon(0% 3%, 29.5% 49.5%, 40% 59%, 50% 64%, 60% 59%, 71% 48%, 100% 3%, 100% 100%, 0% 100%)";

// Paper grain for the folding copies and the letter in the envelope: an SVG
// noise tile, so the fold doesn't need more WebGL canvases than the page has.
const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.39 0 0 0 0 0.33 0 0 0 0.24 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>\"), linear-gradient(170deg, #fdfdfb, #f3f1ea)";

// Kraft fibres for the inside of the envelope and its flap: the same noise,
// coarser and in brown, over the kraft colour.
const kraftFibres =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='k'><feTurbulence type='fractalNoise' baseFrequency='1.1 0.45' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.22 0 0 0 0 0.14 0 0 0 0 0.05 0 0 0 0.75 -0.12'/></filter><rect width='100%' height='100%' filter='url(%23k)'/></svg>\")";

// Focus, drawn by hand instead of the heavy outline: while a field has focus,
// or once something is written in it, its printed frame or underline gives way
// to a wobbly pen-drawn one in the same place. Written fields keep it, so the
// note still looks hand-drawn when it is copied for the fold.
function DrawnFocus({ shape, on }: { shape: "box" | "line"; on: boolean }) {
  const shown = on ? "opacity-100" : "opacity-0 group-focus-within:opacity-100";
  return shape === "box" ? (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute -inset-px h-[calc(100%+2px)] w-[calc(100%+2px)] overflow-visible transition-opacity duration-200 ${shown}`}
    >
      <path
        d="M1.5 2.6 C30 1.1 70 3.4 98.6 1.7 C99.3 30 98.1 70 98.9 98.3 C70 99.2 30 97.5 1.1 98.9 C2.2 70 0.8 30 2.6 1.4"
        fill="none"
        stroke="#111"
        strokeWidth="1.4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  ) : (
    <svg
      aria-hidden
      viewBox="0 0 100 4"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 -bottom-[2px] h-1 w-full overflow-visible transition-opacity duration-200 ${shown}`}
    >
      <path d="M0 2.2 C20 0.9 42 3.4 63 1.8 S88 2.9 100 1.6" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

// A still copy of the note as written, to fold. A live form can't be folded,
// so the fold uses copies of it with the typed values carried over.
function snapshot(form: HTMLFormElement) {
  const copy = form.cloneNode(true) as HTMLFormElement;
  const from = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
  copy.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((field, i) => {
    field.value = from[i].value;
  });
  copy.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
  copy.setAttribute("aria-hidden", "true");
  copy.inert = true;
  copy.style.boxShadow = "none";
  // A cloned WebGL canvas comes out blank; use the grain instead.
  copy.querySelectorAll("canvas").forEach((canvas) => canvas.remove());
  copy.style.backgroundImage = grain;
  return copy;
}

// Handwriting for what people write on the note: a thin pen script, with
// Caveat behind it for Cyrillic (the script has Latin only).
const script = Nothing_You_Could_Do({ subsets: ["latin"], weight: "400", variable: "--font-note-script" });
const caveat = Caveat({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-note-caveat" });
const handFont = { fontFamily: "var(--font-note-script), var(--font-note-caveat), cursive" };

// Small printed labels, as on a form.
const printed = "text-[11px] font-semibold tracking-[0.08em] uppercase";

// A small pen as the cursor over the page, with the nib as the hotspot.
const penCursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M3 21l3-1 12-12-2-2L4 18z' fill='%23111'/></svg>") 2 22, text`;

// A note card with a pen. "Post it" folds the note into an envelope
// and drops it into a red pillar box; the note is emailed to Alina. The next
// blank page is underneath, so people can send more than one.
// Where the letter slot is in the photo, as a fraction of its natural size.
const SLOT = { x: 0.6, y: 0.225 };
// Which part of the photo stays in view when it is cropped (object-position):
// mostly the right, where the pillar box stands, so narrow frames keep it whole.
const FOCUS = { x: 0.74, y: 0.5 };

// The slot's position on screen. The photo is cropped to match the note's
// height (object-cover at FOCUS), so map the natural-image point through that
// crop.
function slotPoint(img: HTMLImageElement | null) {
  if (!img || !img.naturalWidth) return null;
  const box = img.getBoundingClientRect();
  const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
  const drawnW = img.naturalWidth * scale;
  const drawnH = img.naturalHeight * scale;
  return {
    x: box.left + (box.width - drawnW) * FOCUS.x + SLOT.x * drawnW,
    y: box.top + (box.height - drawnH) * FOCUS.y + SLOT.y * drawnH,
  };
}

// The note paper: near-white with a little fibre, shared by the page being
// written and the blank page underneath it.
function NotePaper() {
  return (
    <PaperTexture
      aria-hidden
      className="absolute inset-0 h-full w-full"
      colorBack="#ffffff"
      colorPaper="#ffffff"
      colorShadow="#efede8"
      speed={0}
      fit="cover"
      scale={1}
      folds={0}
      wrinkles={0.25}
      crumples={0}
      fiber={0.4}
      roughness={0.2}
      drops={0}
      seed={3}
    />
  );
}

export function AdviceNote() {
  const [stage, setStage] = useState<Stage>("write");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(0);
  const [flap, setFlap] = useState<Flap>("closed");
  const [sheetHeight, setSheetHeight] = useState(0);
  const [letterHeight, setLetterHeight] = useState(0);
  const [letterStart, setLetterStart] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const slots = useRef<(HTMLDivElement | null)[]>([]);
  const inside = useRef<HTMLDivElement>(null);
  const envelope = useRef<HTMLDivElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const reducedMotion = useReducedMotion();
  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, reducedMotion ? 0 : ms));

  const post = async () => {
    if (message.trim().length < 2 || stage !== "write") return;
    setError("");
    setStage("sending");
    try {
      const response = await fetch("/api/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, name, email, website }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Couldn’t send");
    } catch (reason) {
      setError(`${reason instanceof Error ? reason.message : "Couldn’t send"}. You can email me instead: ${profile.email}`);
      setStage("write");
      return;
    }

    const form = formRef.current;
    const node = envelope.current;
    if (reducedMotion || !form || !node) {
      setStage("posted");
      setSent((count) => count + 1);
      setMessage("");
      await wait(4000);
      setStage("write");
      return;
    }

    // 1. Fold: copies of the note replace the form, then fold in thirds like a
    //    letter, the bottom third up and the top third down over it.
    const height = form.offsetHeight;
    const copies = [snapshot(form), snapshot(form), snapshot(form)];
    setSheetHeight(height);
    setStage("folding");
    await frame();
    await frame();
    slots.current.forEach((slot, i) => slot?.replaceChildren(copies[i]));
    const fold = { duration: 450, easing: "cubic-bezier(0.55, 0, 0.3, 1)", fill: "forwards" as const };
    const [top, , bottom] = panels.current;
    const motions: Animation[] = [];
    if (bottom) {
      motions.push(bottom.animate([{ transform: "rotateX(0deg) translateZ(0px)" }, { transform: "rotateX(180deg) translateZ(-1px)" }], fold));
      await motions.at(-1)!.finished;
    }
    if (top) {
      motions.push(top.animate([{ transform: "rotateX(0deg) translateZ(0px)" }, { transform: "rotateX(-180deg) translateZ(-2px)" }], fold));
      await motions.at(-1)!.finished;
    }

    // 2. Insert: the envelope appears with its flap open, and the folded sheet
    //    shrinks to fit just above its opening.
    setFlap("open");
    setStage("inserting");
    await frame();
    const env = node.getBoundingClientRect();
    const wrap = sheet.current?.getBoundingClientRect();
    const scale = wrap ? (env.width * 0.9) / wrap.width : 1;
    const letter = (height / 3) * scale;
    const overlap = 14;
    setLetterHeight(letter);
    setLetterStart(-(letter - overlap) - env.height * 0.08);
    if (sheet.current && wrap) {
      const x = env.left - wrap.left + env.width * 0.05;
      const y = env.top - wrap.top - letter + overlap - (scale * height) / 3;
      motions.push(
        sheet.current.animate([{ transform: "none" }, { transform: `translate(${x}px, ${y}px) scale(${scale})` }], {
          duration: 650,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          fill: "forwards",
        }),
      );
      await motions.at(-1)!.finished;
    }

    // 3. Seal: the sheet slides into the pocket and the flap closes over it.
    setStage("sealing");
    await frame();
    if (inside.current) {
      motions.push(
        inside.current.animate([{ transform: `translateY(${-(letter - overlap) - env.height * 0.08}px)` }, { transform: "translateY(0)" }], {
          duration: 450,
          easing: "cubic-bezier(0.4, 0, 0.6, 1)",
          fill: "forwards",
        }),
      );
      await motions.at(-1)!.finished;
    }
    setFlap("closing");
    await wait(550);

    // 4. Post: fly to the slot, then shrink into it to a dot and vanish, without stopping.
    const from = node.getBoundingClientRect();
    const to = slotPoint(photo.current);
    setStage("posting");
    if (to) {
      const x = to.x - (from.left + from.width / 2);
      const y = to.y - (from.top + from.height / 2);
      const flight = node.animate(
        [
          { transform: "translate(-50%, 0) rotate(0deg) scale(1)", opacity: 1, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
          { transform: `translate(calc(-50% + ${x}px), ${y}px) rotate(-4deg) scale(0.16)`, opacity: 1, offset: 0.78, easing: "ease-in" },
          { transform: `translate(calc(-50% + ${x}px), ${y + 4}px) rotate(-4deg) scale(0.02)`, opacity: 0 },
        ],
        { duration: 1150, fill: "forwards" },
      );
      motions.push(flight);
      await flight.finished;
    }
    setStage("posted");
    setSent((count) => count + 1);
    setMessage("");
    // Long enough to read the thank-you on the blank page before it clears.
    await wait(4000);
    setStage("write");
    setFlap("closed");
    motions.forEach((motion) => motion.cancel());
    slots.current.forEach((slot) => slot?.replaceChildren());
  };

  const writing = stage === "write" || stage === "sending";

  return (
    <div className="col-span-12 grid grid-cols-12 items-stretch gap-x-5 gap-y-10 pt-4 md:gap-x-12">
      <div className="relative z-10 col-span-12 md:col-span-7 lg:col-span-6">
        {/* The pad: blank pages showing underneath the current one. */}
        <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rotate-[1.8deg] bg-[#ebe9e2] shadow-[0_0_0_1px_rgba(17,17,17,0.06),0_8px_18px_-12px_rgba(17,17,17,0.3)]" />
        <div aria-hidden className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[0.9deg] bg-[#f4f3ee] shadow-[0_0_0_1px_rgba(17,17,17,0.06)]" />

        <div className={`${script.variable} ${caveat.variable} relative`}>
          {/* The next blank page, under the one being written. Once a note is
              posted it shows through, with a thank-you written on it. */}
          <div aria-hidden className="absolute inset-0 overflow-hidden bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.05),0_2px_4px_rgba(17,17,17,0.06)]">
            <NotePaper />
            <div
              className={`relative flex h-full flex-col px-6 pt-8 pb-6 transition-opacity duration-500 motion-reduce:transition-none md:px-10 md:pt-10 ${
                stage === "posted" ? "opacity-100 delay-200" : "opacity-0"
              }`}
            >
              {/* The same lines as an empty note, answered. */}
              <div className="flex items-end justify-between gap-4">
                <p className="flex items-start gap-1 text-[44px] leading-none font-bold tracking-[-0.045em] md:text-[56px]">
                  NOTE
                  <span className="mt-auto mb-1 inline-block size-3 rounded-full bg-ink" />
                </p>
                <p className={`${printed} pb-1`}>From · {profile.name}</p>
              </div>
              <div className="mt-3 h-[5px] border-y border-ink" />
              <p className="flex flex-1 items-center justify-center text-center text-[30px] leading-[1.35] text-ink md:text-[36px]" style={handFont}>
                <span>
                  Posted - thank you.
                  <br />
                  I’ll read every note.
                </span>
              </p>
              <p className="flex items-end gap-3 self-end border-b border-ink/70 pb-1 sm:w-56">
                <span className={printed}>Signed:</span>
                <span className="text-[26px] leading-8" style={handFont}>
                  {profile.name.split(" ")[0]}
                </span>
              </p>
            </div>
          </div>

          {/* The page being written. */}
          <form
            ref={formRef}
            onSubmit={(event) => {
              event.preventDefault();
              post();
            }}
            className={`relative origin-top overflow-hidden bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.05),0_2px_4px_rgba(17,17,17,0.06),0_22px_40px_-22px_rgba(17,17,17,0.45)] transition-opacity duration-500 motion-reduce:transition-none ${
              writing ? "" : "pointer-events-none opacity-0"
            }`}
            // Hidden at once when the fold starts (the copies take its place);
            // fades back in for the next note.
            style={{ transitionDuration: writing ? undefined : "0ms" }}
          >
            <NotePaper />
            {/* On short screens (13" laptops) the note gets compact, so it and the photo fit in one view. */}
            <div className="relative px-6 pt-8 pb-6 md:px-10 md:pt-10 md:[@media(max-height:56rem)]:pt-7 md:[@media(max-height:56rem)]:pb-5">
              {/* Header: NOTE. on the left, who it's for on the right, a double rule. */}
              <div className="flex items-end justify-between gap-4">
                <p className="flex items-start gap-1 text-[44px] leading-none font-bold tracking-[-0.045em] md:text-[56px] md:[@media(max-height:56rem)]:text-[44px]">
                  NOTE
                  <span className="mt-auto mb-1 inline-block size-3 rounded-full bg-ink" />
                </p>
                <p className={`${printed} pb-1`}>To · {profile.name}</p>
              </div>
              <div aria-hidden className="mt-3 h-[5px] border-y border-ink md:[@media(max-height:56rem)]:mt-2" />

              {/* From and date, written in. */}
              {/* Side by side only once the name field has room for its whole hint. */}
              <div className="mt-5 grid gap-x-8 gap-y-4 md:[@media(max-height:56rem)]:mt-3 md:[@media(max-height:56rem)]:gap-y-2 xl:grid-cols-[minmax(0,1fr)_auto]">
                <label className={`group relative flex items-end gap-3 border-b pb-1 focus-within:border-transparent ${name ? "border-transparent" : "border-ink/70"}`}>
                  <DrawnFocus shape="line" on={!!name} />
                  <span className={printed}>From:</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={80}
                    autoComplete="name"
                    placeholder="your name, optional"
                    className="min-w-0 flex-1 bg-transparent text-[19px] leading-8 md:text-[20px] lg:text-[22px] text-ink outline-none focus-visible:outline-none! placeholder:text-ink/35"
                    style={{ ...handFont, cursor: penCursor }}
                  />
                </label>
                <p className="flex items-end gap-3 border-b border-ink/70 pb-1 xl:w-36">
                  <span className={printed}>Date:</span>
                  <span className="text-[19px] leading-8 md:text-[20px] lg:text-[22px]" style={handFont}>
                    Now
                  </span>
                </p>
              </div>

              {/* The note itself, in a framed box. */}
              <label htmlFor="advice-message" className="sr-only">
                Anything you’d like to tell me?
              </label>
              <div
                className={`group relative mt-6 border px-5 py-4 focus-within:border-transparent md:px-8 md:py-6 md:[@media(max-height:56rem)]:mt-3 md:[@media(max-height:56rem)]:py-3 ${
                  message ? "border-transparent" : "border-ink/80"
                }`}
              >
                <DrawnFocus shape="box" on={!!message} />
                <textarea
                  id="advice-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={3000}
                  rows={5}
                  required
                  placeholder="Write anything: a thought, a question, a hello…"
                  className="block w-full resize-none bg-transparent text-[26px] leading-[1.35] md:[@media(max-height:56rem)]:h-[8.1rem] text-ink outline-none focus-visible:outline-none! placeholder:text-ink/35 md:text-[30px]"
                  style={{ ...handFont, cursor: penCursor }}
                />
              </div>
              <p className={`${printed} mt-3 flex flex-wrap justify-between gap-x-2 text-ink/80`}>
                Anything you’d like to tell me?
              </p>

              {/* The button sits under the field, so the reply hint always shows in full. */}
              <div className="mt-6 grid gap-x-8 gap-y-4 md:[@media(max-height:56rem)]:mt-3 md:[@media(max-height:56rem)]:gap-y-3">
                <label
                  className={`group relative flex flex-col items-start gap-1 border-b pb-1 focus-within:border-transparent xl:flex-row xl:items-end xl:gap-3 ${
                    email ? "border-transparent" : "border-ink/40"
                  }`}
                >
                  <DrawnFocus shape="line" on={!!email} />
                  <span className={`${printed} text-muted`}>Reply to:</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    maxLength={120}
                    autoComplete="email"
                    placeholder="your email, if you’d like a reply"
                    className="w-full min-w-0 flex-1 bg-transparent text-[19px] leading-8 md:text-[20px] lg:text-[22px] text-ink outline-none focus-visible:outline-none! placeholder:text-ink/35"
                    style={{ ...handFont, cursor: penCursor }}
                  />
                </label>
                <button
                  type="submit"
                  disabled={message.trim().length < 2 || stage === "sending"}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-ink bg-ink px-5 text-sm text-paper transition-colors hover:bg-transparent hover:text-ink disabled:border-ink/25 disabled:bg-transparent disabled:text-ink/60 disabled:hover:bg-transparent disabled:hover:text-ink/60"
                >
                  {stage === "sending" ? "Sending…" : "Fold and post it"}
                </button>
              </div>
              <p className="mt-3 text-sm text-muted md:[@media(max-height:56rem)]:mt-2">Goes straight to my inbox. Nothing is stored.</p>

              {/* Honeypot: hidden from people, filled in by bots. */}
              <label aria-hidden className="absolute -left-[9999px]">
                Website
                <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
              </label>
            </div>
            {error && (
              <p role="alert" className="relative mx-6 mb-6 rounded-md bg-ink px-4 py-3 text-sm text-paper md:mx-10">
                {error}
              </p>
            )}
          </form>

          {/* The note being folded: three strips of the same page, each showing
              its third. The outer two turn over on their creases. */}
          <div
            ref={sheet}
            aria-hidden
            className={`absolute inset-x-0 top-0 z-20 origin-top-left [transform-style:preserve-3d] ${
              stage === "folding" || stage === "inserting" ? "" : "invisible"
            }`}
            style={{ height: sheetHeight, perspective: 1800 }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                ref={(el) => {
                  panels.current[i] = el;
                }}
                className="absolute inset-x-0 [transform-style:preserve-3d]"
                style={{ top: (i * sheetHeight) / 3, height: sheetHeight / 3, transformOrigin: i === 0 ? "bottom" : "top" }}
              >
                <div className="absolute inset-0 overflow-hidden bg-white [backface-visibility:hidden]">
                  <div
                    ref={(el) => {
                      slots.current[i] = el;
                    }}
                    className="absolute inset-x-0"
                    style={{ top: (-i * sheetHeight) / 3, height: sheetHeight }}
                  />
                  {/* A soft crease shadow where this strip meets the next. */}
                  {i !== 1 && (
                    <div className={`absolute inset-x-0 h-3 from-black/[0.06] to-transparent ${i === 0 ? "bottom-0 bg-gradient-to-t" : "top-0 bg-gradient-to-b"}`} />
                  )}
                </div>
                {/* The back of the paper, seen once the strip has turned over. */}
                <div
                  className="absolute inset-0 shadow-[0_1px_3px_rgba(17,17,17,0.12)] [backface-visibility:hidden]"
                  style={{ transform: "rotateX(180deg)", backgroundImage: grain }}
                />
              </div>
            ))}
          </div>

          {/* The envelope, in layers cut from one photo: the inside of the
              pocket, the flap, the letter, then the front, so the letter can
              slide in behind the front and the flap can close over it. */}
          <div
            ref={envelope}
            aria-hidden
            className={`absolute top-[55%] left-1/2 z-10 aspect-[600/417] w-56 drop-shadow-[0_10px_14px_rgba(17,17,17,0.25)] transition-opacity duration-300 motion-reduce:transition-none ${
              stage === "inserting" || stage === "sealing" || stage === "posting" ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{ transform: "translate(-50%, 0)" }}
          >
            <div
              className="absolute inset-0"
              style={{ clipPath: FLAP, backgroundImage: `${kraftFibres}, linear-gradient(180deg, #a8844f, #caa76d)` }}
            />
            <div
              ref={inside}
              className={`absolute top-[8%] left-[5%] z-[2] w-[90%] shadow-[0_1px_3px_rgba(17,17,17,0.15)] ${
                stage === "sealing" || stage === "posting" ? "" : "invisible"
              }`}
              style={{ height: letterHeight, transform: `translateY(${letterStart}px)`, backgroundImage: grain }}
            />
            <div className="absolute inset-0 z-[3]" style={{ clipPath: BODY }}>
              <Image src={envelopePhoto} alt="" fill sizes="14rem" loading="eager" className="object-contain" />
            </div>
            <div
              className="absolute inset-0 [transform-style:preserve-3d]"
              style={{
                zIndex: flap === "open" ? 1 : 4,
                transformOrigin: "50% 1%",
                transform: `perspective(600px) rotateX(${flap === "open" ? 172 : 0}deg)`,
                transition: flap === "closing" ? "transform 450ms cubic-bezier(0.5, 0, 0.3, 1)" : "none",
              }}
            >
              <div className="absolute inset-0 [backface-visibility:hidden]" style={{ clipPath: FLAP }}>
                <Image src={envelopePhoto} alt="" fill sizes="14rem" loading="eager" className="object-contain" />
              </div>
              {/* The inside of the flap, seen while it's open. */}
              <div
                className="absolute inset-0 [backface-visibility:hidden]"
                style={{
                  clipPath: FLAP,
                  transform: "rotateY(180deg)",
                  backgroundImage: `${kraftFibres}, linear-gradient(180deg, #d6b47a, #c9a66c)`,
                }}
              />
            </div>
          </div>

          <p aria-live="polite" className="sr-only">
            {stage === "posted" ? "Posted - thank you. I’ll read every note." : ""}
          </p>
        </div>


      </div>

      {/* The pillar box photo, the same height as the note. The envelope aims at its letter slot. */}
      <figure className="relative z-0 col-span-12 aspect-[3/2] md:col-span-5 md:aspect-auto lg:col-span-6">
        <Image
          ref={photo}
          src={pillarBox}
          alt="A red Royal Mail pillar box against a stone wall, next to a wooden door"
          fill
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 40vw, 100vw"
          className="rounded-sm object-cover object-[74%_50%]"
        />
      </figure>

      {/* Space is always reserved, so the photo beside the pad never jumps. */}
      <p className="col-span-12 -mt-4 min-h-5 text-sm text-muted" aria-live="polite">
        {sent > 0 && `${sent === 1 ? "1 note posted." : `${sent} notes posted.`} The next page is ready if you have more.`}
      </p>
    </div>
  );
}
