"use client";

import { PaperTexture } from "@paper-design/shaders-react";
import { Caveat, Nothing_You_Could_Do } from "next/font/google";
import { useRef, useState } from "react";
import { profile } from "@/content/profile";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import envelopePhoto from "@/public/images/paper/envelope.png";
import pillarBox from "@/public/images/paper/pillar-box.jpg";

type Stage = "write" | "sending" | "folded" | "posting" | "posted";

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

// The slot's position on screen. The photo is cropped to match the note's
// height (object-cover, anchored to the left edge), so map the natural-image
// point through that crop.
function slotPoint(img: HTMLImageElement | null) {
  if (!img || !img.naturalWidth) return null;
  const box = img.getBoundingClientRect();
  const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
  const drawnW = img.naturalWidth * scale;
  const drawnH = img.naturalHeight * scale;
  return {
    x: box.left + SLOT.x * drawnW,
    y: box.top + (box.height - drawnH) / 2 + SLOT.y * drawnH,
  };
}

export function AdviceNote() {
  const [stage, setStage] = useState<Stage>("write");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(0);
  const envelope = useRef<HTMLDivElement>(null);
  const flying = useRef<Animation | null>(null);
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

    setStage("folded");
    await wait(650);
    const node = envelope.current;
    const from = node?.getBoundingClientRect();
    const to = slotPoint(photo.current);
    setStage("posting");
    if (node && from && to) {
      const x = to.x - (from.left + from.width / 2);
      const y = to.y - (from.top + from.height / 2);
      // Fly to the slot, then shrink into it to a dot and vanish, without stopping.
      const flight = node.animate(
        [
          { transform: "translate(-50%, 0) rotate(0deg) scale(1)", opacity: 1, easing: "cubic-bezier(0.45, 0, 0.55, 1)" },
          { transform: `translate(calc(-50% + ${x}px), ${y}px) rotate(-4deg) scale(0.16)`, opacity: 1, offset: 0.78, easing: "ease-in" },
          { transform: `translate(calc(-50% + ${x}px), ${y + 4}px) rotate(-4deg) scale(0.02)`, opacity: 0 },
        ],
        { duration: reducedMotion ? 0 : 1150, fill: "forwards" },
      );
      flying.current = flight;
      await flight.finished;
    }
    setStage("posted");
    setSent((count) => count + 1);
    setMessage("");
    await wait(1600);
    setStage("write");
    flying.current?.cancel();
    flying.current = null;
  };

  const writing = stage === "write" || stage === "sending";

  return (
    <div className="col-span-12 grid grid-cols-12 items-stretch gap-x-5 gap-y-10 pt-4 md:gap-x-12">
      <div className="relative z-10 col-span-12 md:col-span-7 lg:col-span-6">
        {/* The pad: blank pages showing underneath the current one. */}
        <div aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 rotate-[1.8deg] bg-[#ebe9e2] shadow-[0_0_0_1px_rgba(17,17,17,0.06),0_8px_18px_-12px_rgba(17,17,17,0.3)]" />
        <div aria-hidden className="absolute inset-0 translate-x-1.5 translate-y-1.5 rotate-[0.9deg] bg-[#f4f3ee] shadow-[0_0_0_1px_rgba(17,17,17,0.06)]" />

        <div className="relative">
          {/* The page being written. */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              post();
            }}
            className={`${script.variable} ${caveat.variable} relative origin-top overflow-hidden bg-white shadow-[0_0_0_1px_rgba(17,17,17,0.05),0_2px_4px_rgba(17,17,17,0.06),0_22px_40px_-22px_rgba(17,17,17,0.45)] transition-[transform,opacity] duration-500 motion-reduce:transition-none ${
              writing ? "" : "pointer-events-none scale-y-0 opacity-0"
            }`}
          >
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
            <div className="relative px-6 pt-8 pb-6 md:px-10 md:pt-10">
              {/* Header: NOTE. on the left, who it's for on the right, a double rule. */}
              <div className="flex items-end justify-between gap-4">
                <p className="flex items-start gap-1 text-[44px] leading-none font-bold tracking-[-0.045em] md:text-[56px]">
                  NOTE
                  <span className="mt-auto mb-1 inline-block size-3 rounded-full bg-ink" />
                </p>
                <p className={`${printed} pb-1`}>To · {profile.name}</p>
              </div>
              <div aria-hidden className="mt-3 h-[5px] border-y border-ink" />

              {/* From and date, written in. */}
              <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-[1fr_auto]">
                <label className="flex items-end gap-3 border-b border-ink/70 pb-1">
                  <span className={printed}>From:</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={80}
                    autoComplete="name"
                    placeholder="your name, optional"
                    className="min-w-0 flex-1 bg-transparent text-[26px] leading-8 text-ink outline-none placeholder:text-ink/35"
                    style={{ ...handFont, cursor: penCursor }}
                  />
                </label>
                <p className="flex items-end gap-3 border-b border-ink/70 pb-1 sm:w-44">
                  <span className={printed}>Date:</span>
                  <span className="text-[26px] leading-8" style={handFont}>
                    Now
                  </span>
                </p>
              </div>

              {/* The note itself, in a framed box. */}
              <label htmlFor="advice-message" className="sr-only">
                What would make me a strong candidate later?
              </label>
              <div className="relative mt-6 border border-ink/80 px-5 py-4 md:px-8 md:py-6">
                <textarea
                  id="advice-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={3000}
                  rows={5}
                  required
                  placeholder="Write anything: skills, projects, what you’d look for…"
                  className="block w-full resize-none bg-transparent text-[26px] leading-[1.35] text-ink outline-none placeholder:text-ink/35 md:text-[30px]"
                  style={{ ...handFont, cursor: penCursor }}
                />
                {/* A small scribbled heart in a box, bottom right. */}
                <svg aria-hidden viewBox="0 0 28 34" className="absolute right-3 bottom-3 w-6 text-ink" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="2" y="12" width="24" height="20" />
                  <path d="M14 28 C4 18 4 6 10 6 C13 6 14 10 14 12 C14 10 15 4 20 4 C26 5 22 18 14 28" strokeLinecap="round" />
                </svg>
              </div>
              <p className={`${printed} mt-3 flex flex-wrap justify-between gap-x-2 text-ink/80`}>
                What would make me a strong candidate later?
              </p>

              <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <label className="flex items-end gap-3 border-b border-ink/40 pb-1">
                  <span className={`${printed} text-muted`}>Reply to:</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    maxLength={120}
                    autoComplete="email"
                    placeholder="your email, if you’d like a reply"
                    className="min-w-0 flex-1 bg-transparent text-[22px] leading-8 text-ink outline-none placeholder:text-ink/35"
                    style={{ ...handFont, cursor: penCursor }}
                  />
                </label>
                <button
                  type="submit"
                  disabled={message.trim().length < 2 || stage === "sending"}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-ink bg-ink px-5 text-sm text-paper transition-colors hover:bg-transparent hover:text-ink disabled:opacity-40 disabled:hover:bg-ink disabled:hover:text-paper"
                >
                  {stage === "sending" ? "Sending…" : "Fold and post it"}
                </button>
              </div>
              <p className="mt-3 text-sm text-muted">Goes straight to my inbox. Nothing is stored.</p>

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

          {/* The folded note: an envelope that flies into the postbox. */}
          <div
            ref={envelope}
            aria-hidden
            className={`absolute top-1/3 left-1/2 w-56 transition-opacity duration-300 motion-reduce:transition-none ${
              stage === "folded" || stage === "posting" ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{ transform: "translate(-50%, 0)" }}
          >
            <Image
              src={envelopePhoto}
              alt=""
              sizes="14rem"
              loading="eager"
              className="h-auto w-full drop-shadow-[0_10px_14px_rgba(17,17,17,0.25)]"
            />
          </div>

          <p aria-live="polite" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-lg">
            {stage === "posted" ? "Posted. Thank you." : ""}
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
          className="rounded-sm object-cover object-left"
        />
      </figure>

      {/* Space is always reserved, so the photo beside the pad never jumps. */}
      <p className="col-span-12 -mt-4 min-h-5 text-sm text-muted" aria-live="polite">
        {sent > 0 && `${sent === 1 ? "1 note posted." : `${sent} notes posted.`} The next page is ready if you have more.`}
      </p>
    </div>
  );
}
