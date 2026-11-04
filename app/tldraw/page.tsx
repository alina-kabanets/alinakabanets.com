import type { Metadata } from "next";
import { Shantell_Sans } from "next/font/google";
import { CaseSection, Prose, Subheading } from "@/components/case-study";
import { AdviceNote } from "@/components/paper/advice-note";
import { ComponentSyncMock } from "@/components/paper/component-sync-mock";
import { Container } from "@/components/container";
import { IdeaSheets } from "@/components/paper/ideas-sheet";
import { LostTimeline } from "@/components/paper/lost-timeline";
import { PortraitPaywall } from "@/components/paper/portrait-paywall";
import { Tape } from "@/components/paper/tape";
import { TearOffFlyer } from "@/components/paper/tear-off-flyer";
import { CommentLesson } from "@/components/tldraw/comment-lesson";
import {
  agentNotes,
  canvasNotes,
  friction,
  ideaSheets,
  lessons,
  startNotes,
  timelineEnds,
  tldrawPage,
} from "@/content/tldraw";

// Shantell Sans, the hand-drawn face tldraw uses on the board (SIL OFL).
// It fills the same slot Paper Mono fills on /paper, so the shared notepad,
// timeline and flyer pieces pick it up through `font-paper-mono`.
const boardFont = Shantell_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-paper-mono-face",
  display: "swap",
});

// Unlisted: shared by link only.
export const metadata: Metadata = {
  title: "Notes on tldraw",
  description: "An independent concept: where my first hour with tldraw went sideways, and what I’d build.",
  alternates: { canonical: "/tldraw" },
  robots: { index: false, follow: false },
  openGraph: { type: "article", url: "/tldraw", title: "Notes on tldraw", description: tldrawPage.summary },
};

const blue = "#2f80ed";

function Notes({ items }: { items: readonly { key: string; title: string; body: string }[] }) {
  return (
    <dl className="col-span-12 grid gap-x-5 gap-y-6 sm:grid-cols-2 md:col-span-8 md:col-start-5">
      {items.map((note) => (
        <div key={note.key} className="border-t border-line pt-3">
          <dt className="text-base font-medium">
            <span className="mr-2 font-paper-mono text-muted">{note.key}</span>
            {note.title}
          </dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted">{note.body}</dd>
        </div>
      ))}
    </dl>
  );
}

function StartBoardMock() {
  return (
    <figure className="col-span-12">
      <div className="overflow-hidden rounded-xl border border-ink/15 bg-[#f9fafb] text-[13px] text-[#1d1d1d]">
        <div className="grid md:grid-cols-[12rem_1fr_15rem]">
          <nav aria-label="Mock sidebar" className="hidden border-r border-black/5 bg-white p-3 md:block">
            {["Start", "My files · 3", "Shared with me", "Examples"].map((item, index) => (
              <p
                key={item}
                className={`rounded-lg px-2 py-1.5 ${index === 0 ? "bg-[#eef4fd] font-medium" : "text-[#1d1d1d]/60"}`}
                style={index === 0 ? { color: blue } : undefined}
              >
                {item}
              </p>
            ))}
            <div className="mt-6 px-2">
              <p className="text-[12px] text-[#1d1d1d]/60">Your progress</p>
              <div className="mt-2 h-1.5 rounded-full bg-[#e8eaed]">
                <div className="h-full w-1/3 rounded-full" style={{ background: blue }} />
              </div>
              <p className="mt-1.5 text-[12px] text-[#1d1d1d]/60">2 of 6 lessons done</p>
            </div>
          </nav>
          <div className="p-5 [background-image:radial-gradient(#d4d4d8_1px,transparent_1px)] [background-size:16px_16px]">
            <p className="font-paper-mono text-[22px]">Good afternoon, Alina</p>
            <div className="mt-4 grid gap-4 rounded-xl bg-white p-4 shadow-[0_1px_6px_rgba(0,0,0,0.08)] sm:grid-cols-[10rem_1fr]">
              <div className="relative flex aspect-video items-center justify-center rounded-lg bg-[#fef3a3] font-paper-mono">
                <svg aria-hidden viewBox="0 0 16 16" className="size-6" fill="currentColor">
                  <path d="M5 3.5v9l7.5-4.5z" />
                </svg>
                <span className="absolute bottom-1.5 left-2 text-[11px] opacity-70">0:30 · made in flash</span>
              </div>
              <div>
                <p className="text-[12px] text-[#1d1d1d]/60">Next lesson · 3 of 6</p>
                <p className="mt-1 text-[15px] font-medium">Point with a comment</p>
                <p className="mt-1 text-[#1d1d1d]/60">Watch for 30 seconds, then do it on the board.</p>
                <span className="mt-3 inline-block rounded-lg px-3 py-1.5 text-white" style={{ background: blue }}>
                  Try it on the board →
                </span>
              </div>
            </div>
            <ol className="mt-4 divide-y divide-black/5 rounded-xl bg-white shadow-[0_1px_6px_rgba(0,0,0,0.08)]">
              {lessons.map((lesson, index) => {
                const done = "done" in lesson && lesson.done;
                const current = "current" in lesson && lesson.current;
                return (
                  <li key={lesson.title} className="flex items-center gap-3 px-4 py-2.5">
                    <span
                      className={`flex size-5 items-center justify-center rounded-full text-[11px] ${
                        done ? "bg-[#1d1d1d] text-white" : current ? "text-white" : "border border-black/20 text-[#1d1d1d]/60"
                      }`}
                      style={current ? { background: blue } : undefined}
                    >
                      {index + 1}
                    </span>
                    <span className={done ? "text-[#1d1d1d]/60 line-through" : ""}>{lesson.title}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <aside aria-label="Mock collaborators" className="border-t border-black/5 bg-white p-4 md:border-t-0 md:border-l">
            <p className="text-[12px] text-[#1d1d1d]/60">On this board</p>
            <ul className="mt-2 space-y-2">
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#e85d75]" /> Alina
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#d97757]" /> Claude · agent
              </li>
            </ul>
            <div className="mt-4 space-y-3">
              <p className="ml-6 rounded-lg bg-[#eef4fd] p-2.5">Set me up a board to practise comments.</p>
              <p className="mr-6 rounded-lg bg-[#f3f4f6] p-2.5">
                Made “Comment practice” with two boxes to connect. Open it when you’re ready.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">
        A Start board that is always first: the next lesson, all six lessons, and the agent on the board as a
        collaborator.
      </figcaption>
    </figure>
  );
}

export default function TldrawPage() {
  // Tilted sheets, pads and tape reach a few pixels past the edges; the
  // article clips them so phones don't scroll sideways.
  return (
    <article className={`${boardFont.variable} overflow-x-clip`}>
      <Container className="pt-10 md:pt-16">
        <Tape rotate={-1.5}>{tldrawPage.disclaimer}</Tape>

        <h1 className="mt-10 max-w-[18ch] text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance md:mt-14">
          {tldrawPage.title}
        </h1>
        <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-4 border-t border-line pt-5">
          <p className="col-span-12 text-sm md:col-span-4">{tldrawPage.byline}</p>
          <p className="col-span-12 max-w-[38rem] text-lg leading-relaxed md:col-span-8 md:col-start-5 md:text-xl">
            {tldrawPage.summary}
          </p>
        </div>

        <CaseSection label="01 · Where I got lost" title="My first hour, and where the line wandered.">
          <LostTimeline friction={friction} ends={timelineEnds} />
          <Prose>
            <p>
              The pattern: <strong>the canvas can do a lot, and the first screen doesn’t say so.</strong> An empty
              board with no next step, then a key-shaped wall in front of the most magical feature.
            </p>
          </Prose>
        </CaseSection>

        <CaseSection label="02 · What I’d build" title="A front door, then lessons you do on the board.">
          <Prose>
            <p>
              The lessons should be a short, deliberate list: the most important features, and the ones that set
              tldraw apart, chosen as what we want every new person to notice first. Each lesson is one of those,
              learned by doing it on the board.
            </p>
            <p>
              tldraw has two front doors: the app and the SDK. The lessons should join them, so someone who starts
              by drawing ends up one command away from building their own canvas.
            </p>
          </Prose>
          <StartBoardMock />
          <Notes items={startNotes} />
          <Subheading>Then: try it on the board</Subheading>
          <CommentLesson />
          <Notes items={canvasNotes} />
          <Subheading>And: point at things, don’t describe them</Subheading>
          <Prose>
            <p>
              People think in pictures. Agents take words. Every prompt is a lossy translation between the two.
            </p>
            <p>
              tldraw already knows that: comments shipped in SDK 5.3, and agents now draw on boards from ChatGPT
              and Codex. <strong>Point, don’t describe</strong>: select the shapes, comment, mention the agent. The
              agent answers on the board, and you steer with your eye.
            </p>
          </Prose>
          <Notes items={agentNotes} />
        </CaseSection>

        <CaseSection label="03 · Product ideas" title="My product ideas for tldraw, from a sketch to an app and back.">
          <ComponentSyncMock product="tldraw" />
          <IdeaSheets sheets={ideaSheets} />
        </CaseSection>

        <CaseSection label="04 · Quick wins" title="Two fixes that don’t need a roadmap slot.">
          <Prose>
            <p>
              <strong>The empty canvas.</strong> Open on a few shapes that say what to try: draw a box, select it,
              press the button. One sticky does more than a tour.
            </p>
            <p>
              <strong>“Risky but cool”.</strong> Say what the risk is, in one line beside the fields: where the key
              is kept and where it is sent. And for people who already pay for ChatGPT, point to tldraw for ChatGPT
              and Codex, which works with the plan they already have.
            </p>
          </Prose>
        </CaseSection>

        <CaseSection label="05 · The ask" title="I’d like to build this with you.">
          <Prose>
            <p>
              I’m a design engineer in London. I design in code, ship React and TypeScript, and measure what
              changed.
            </p>
          </Prose>
          <div className="col-span-12 grid grid-cols-12 gap-x-5 gap-y-12 pt-6">
            <PortraitPaywall />
            {/* Centred in the right half, to balance the photo in the left half. */}
            <div className="col-span-12 md:col-span-6 md:flex md:flex-col md:items-center">
              <p className="w-full max-w-[30rem] text-2xl leading-[1.15] tracking-[-0.02em] text-balance md:text-center md:text-[2.25rem]">
                The rest is easier over a call.
              </p>
              <div className="mt-12 w-full max-w-[30rem]">
                <TearOffFlyer location="tldraw-flyer" />
              </div>
            </div>
          </div>
        </CaseSection>

        {/* A note to post: the form and the pillar box, with a label but no heading. */}
        <section className="mt-28 grid grid-cols-12 gap-x-5 gap-y-10 border-t border-line pt-5 md:mt-40">
          <p className="col-span-12 text-sm">06 · Leave a note</p>
          <AdviceNote page="tldraw" />
        </section>

        <p className="mt-28 -mb-20 text-center text-sm text-muted md:mt-44 md:-mb-36">{tldrawPage.checked}</p>
      </Container>
    </article>
  );
}
