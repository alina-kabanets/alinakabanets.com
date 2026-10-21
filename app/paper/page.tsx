import type { Metadata } from "next";
import localFont from "next/font/local";
import { CaseSection, Prose, Subheading } from "@/components/case-study";
import { AdviceNote } from "@/components/paper/advice-note";
import { AgentCanvasMock } from "@/components/paper/agent-canvas-mock";
import { ComponentSyncMock } from "@/components/paper/component-sync-mock";
import { Container } from "@/components/container";
import { FlexLesson } from "@/components/paper/flex-lesson";
import { IdeaSheets } from "@/components/paper/ideas-sheet";
import { LostTimeline } from "@/components/paper/lost-timeline";
import { PortraitPaywall } from "@/components/paper/portrait-paywall";
import { ZoomImage } from "@/components/paper/shot-strip";
import { Tape } from "@/components/paper/tape";
import { TearOffFlyer } from "@/components/paper/tear-off-flyer";
import { TextureCard } from "@/components/paper/texture-card";
import {
  agentNotes,
  canvasNotes,
  lessons,
  loves,
  paperPage,
  startNotes,
} from "@/content/paper";

// Paper Mono, Paper's own typeface (SIL Open Font License), self-hosted.
const paperMono = localFont({
  src: [
    { path: "./PaperMono-Regular.woff2", weight: "400" },
    { path: "./PaperMono-Medium.woff2", weight: "500" },
  ],
  variable: "--font-paper-mono-face",
  display: "swap",
});

// Unlisted: shared by link only.
export const metadata: Metadata = {
  title: "Notes on Paper",
  description: "An independent concept: what I love about Paper, where my first hour went sideways, and what I’d build.",
  alternates: { canonical: "/paper" },
  robots: { index: false, follow: false },
  openGraph: { type: "article", url: "/paper", title: "Notes on Paper", description: paperPage.summary },
};

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

function StartPageMock() {
  return (
    <figure className="col-span-12">
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-white text-[13px] text-[#222]">
        <div className="flex items-center gap-2 border-b border-black/10 bg-[#e8e8e8] px-3 py-2">
          <span className="rounded bg-[#f9f9f9] px-2 py-0.5 shadow-sm">Start</span>
          <span className="px-2 py-0.5 text-[#6b6b6b]">Welcome to Paper</span>
          <span className="px-2 py-0.5 text-[#6b6b6b]">Scratchpad</span>
        </div>
        <div className="grid md:grid-cols-[12rem_1fr_15rem]">
          <nav aria-label="Mock sidebar" className="hidden border-r border-black/10 bg-[#f2f2f2] p-3 md:block">
            {["Start", "All files · 3", "Shared with me", "Archive"].map((item, index) => (
              <p
                key={item}
                className={`rounded px-2 py-1.5 ${index === 0 ? "bg-[#e3e3e3] font-medium" : "text-[#6b6b6b]"}`}
              >
                {item}
              </p>
            ))}
            <div className="mt-6 px-2">
              <p className="text-[12px] text-[#6b6b6b]">Your progress</p>
              <div className="mt-2 h-1.5 rounded-full bg-[#e4e4e4]">
                <div className="h-full w-1/3 rounded-full bg-[#5c89dd]" />
              </div>
              <p className="mt-1.5 text-[12px] text-[#6b6b6b]">2 of 6 lessons done</p>
            </div>
          </nav>
          <div className="p-5">
            <p className="text-[20px] font-medium tracking-[-0.01em]">Good afternoon, Alina</p>
            <div className="mt-4 grid gap-4 rounded-lg bg-[#f2f2f2] p-4 sm:grid-cols-[10rem_1fr]">
              <div className="relative flex aspect-video items-center justify-center rounded-md bg-[#222] text-white">
                <svg aria-hidden viewBox="0 0 16 16" className="size-6" fill="currentColor">
                  <path d="M5 3.5v9l7.5-4.5z" />
                </svg>
                <span className="absolute bottom-1.5 left-2 text-[11px] opacity-80">1:40 · plays in Paper</span>
              </div>
              <div>
                <p className="text-[12px] text-[#6b6b6b]">Next lesson · 3 of 6</p>
                <p className="mt-1 text-[15px] font-medium">Real flex layout, by hand</p>
                <p className="mt-1 text-[#6b6b6b]">Watch for 100 seconds, then build it yourself.</p>
                <span className="mt-3 inline-block rounded-md bg-[#222] px-3 py-1.5 text-white">
                  Try it on canvas →
                </span>
              </div>
            </div>
            <ol className="mt-4 divide-y divide-black/5 rounded-lg bg-[#f2f2f2]">
              {lessons.map((lesson, index) => (
                <li key={lesson.title} className="flex items-center gap-3 px-4 py-2.5">
                  <span
                    className={`flex size-5 items-center justify-center rounded-full text-[11px] ${
                      "done" in lesson && lesson.done
                        ? "bg-[#222] text-white"
                        : "current" in lesson && lesson.current
                          ? "bg-[#5c89dd] text-white"
                          : "border border-black/20 text-[#6b6b6b]"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className={"done" in lesson && lesson.done ? "text-[#6b6b6b] line-through" : ""}>
                    {lesson.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <aside aria-label="Mock agent pane" className="border-t border-black/10 bg-[#f2f2f2] p-4 md:border-t-0 md:border-l">
            <p className="flex items-center gap-2 text-[12px] text-[#6b6b6b]">
              <span className="size-2 rounded-full bg-[#3E9C8F]" /> Claude Code · connected
            </p>
            <div className="mt-4 space-y-3">
              <p className="ml-6 rounded-lg bg-[#e3e3e3] p-2.5">Set me up to practise flex layout.</p>
              <p className="mr-6 rounded-lg bg-white p-2.5">
                Created “Flex practice” with one card to lay out. Open it when you’re ready.
              </p>
            </div>
          </aside>
        </div>
      </div>
      <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">
        A Start page that is always the first tab: the next lesson, all six lessons, and the agent docked beside it.
      </figcaption>
    </figure>
  );
}

export default function PaperPage() {
  // Tilted sheets, pads and tape reach a few pixels past the edges; the
  // article clips them so phones don't scroll sideways.
  return (
    <article className={`${paperMono.variable} overflow-x-clip`}>
      <Container className="pt-10 md:pt-16">
        <Tape rotate={-1.5}>{paperPage.disclaimer}</Tape>

        <h1 className="mt-10 max-w-[18ch] text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance md:mt-14">
          {paperPage.title}
        </h1>
        <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-4 border-t border-line pt-5">
          <p className="col-span-12 text-sm md:col-span-4">{paperPage.byline}</p>
          <p className="col-span-12 max-w-[38rem] text-lg leading-relaxed md:col-span-8 md:col-start-5 md:text-xl">
            {paperPage.summary}
          </p>
        </div>

        <CaseSection label="01 · What I love" title="Three things that made me stay.">
          <ul className="col-span-12 grid gap-5 md:grid-cols-3">
            <li>
              <TextureCard />
              <p className="mt-4 text-base font-medium">{loves[0].title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{loves[0].body}</p>
            </li>
            <li>
              <ZoomImage
                shot={{
                  src: "/images/paper/welcome-file.jpg",
                  alt: "Paper’s Welcome file: six columns of lessons on a grey canvas, from building with an AI agent to shaders, React export, colour tools and the roadmap",
                  width: 1353,
                  height: 1073,
                }}
                className="aspect-[4/3] rounded-md bg-[#8e8e8e]"
              />
              <p className="mt-4 text-base font-medium">{loves[1].title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{loves[1].body}</p>
            </li>
            <li>
              <ZoomImage
                shot={{
                  src: "/images/paper/agent-loop-v2.jpg",
                  alt: "Paper with a terminal beside it: a coding agent creates three mobile artboards in the file through Paper’s MCP server, then is asked to build them into the codebase",
                  width: 1324,
                  height: 721,
                }}
                className="aspect-[4/3] rounded-md bg-[#8e8e8e] [&>img]:p-4 [&>img]:drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]"
              />
              <p className="mt-4 text-base font-medium">{loves[2].title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{loves[2].body}</p>
            </li>
          </ul>
        </CaseSection>

        <CaseSection label="02 · Where I got lost" title="My first hour, and where the line wandered.">
          <LostTimeline />
          <Prose>
            <p>
              The pattern: <strong>the product is great once you’re in, and the way in is hidden.</strong> The Learn
              tab and the Welcome file already exist. They just aren’t the front door.
            </p>
          </Prose>
        </CaseSection>

        <CaseSection label="03 · What I’d build" title="A front door, then lessons you do on the canvas.">
          <Prose>
            <p>
              The lessons should be a short, deliberate list: the most important features, and the ones that set Paper
              apart, chosen as what we want every new designer to notice first. Each lesson is one of those, learned
              by doing it.
            </p>
            <p>
              At some point Paper showed me a short overview of everything it can do. I closed it, have never found it
              again, and still regret it. That list should live somewhere you can always come back to.
            </p>
          </Prose>
          <StartPageMock />
          <Notes items={startNotes} />
          <Subheading>Then: try it on canvas</Subheading>
          <FlexLesson />
          <Notes items={canvasNotes} />
          <Subheading>And: a bridge from a raw idea to agents</Subheading>
          <Prose>
            <p>
              Designers think in pictures. Agents take words. Every prompt is a lossy translation between the two.
            </p>
            <p>
              Paper’s canvas is already real CSS, so it can speak both. <strong>Point, don’t describe</strong>: select
              the part, say what’s wrong. <strong>Explore, then commit</strong>: references in, six directions out.
              The agent answers in layers, not words, and the designer steers with their eye.
            </p>
          </Prose>
          <AgentCanvasMock />
          <Notes items={agentNotes} />
        </CaseSection>

        <CaseSection label="04 · Product ideas" title="My product ideas for Paper, from a rough idea to code and back.">
          <IdeaSheets />
          <ComponentSyncMock />
        </CaseSection>

        <CaseSection label="05 · Quick wins" title="Two fixes that don’t need a roadmap slot.">
          <Prose>
            <p>
              <strong>Desktop handoff.</strong> Download → an “Open Paper Desktop” deep link → the first launch opens
              the Welcome file with the agent panel showing. No grey dashboard.
            </p>
            <p>
              <strong>The mobile menu.</strong> In Safari and Chrome on iOS, open the menu far down a long page
              (pricing, changelog) and its lower part disappears, showing the page behind. Layout and taps are
              correct, so it’s a WebKit painting bug, most likely the menu’s own scroll area being clipped at large
              scroll offsets. Locking the page scroll while the menu is open, so it never opens at a huge offset,
              should sidestep it.
            </p>
          </Prose>
        </CaseSection>

        <CaseSection label="06 · The ask" title="I’d like to build this with you.">
          <Prose>
            <p>
              I’m a product and design engineer in London. I design in code, ship React and TypeScript, and measure
              what changed. I used Paper and its agent connection to make the first version of this page.
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
                <TearOffFlyer />
              </div>
            </div>
          </div>
        </CaseSection>

        {/* A note to post: the form and the pillar box, with a label but no heading. */}
        <section className="mt-28 grid grid-cols-12 gap-x-5 gap-y-10 border-t border-line pt-5 md:mt-40">
          <p className="col-span-12 text-sm">07 · Leave a note</p>
          <AdviceNote />
        </section>

        {/* Sits just above the site footer: the negative margin eats most of the footer's top gap. */}
        <p className="mt-28 -mb-20 text-center text-sm text-muted md:mt-44 md:-mb-36">
          Made in Paper, with an agent, then built for the web.
        </p>
      </Container>
    </article>
  );
}
