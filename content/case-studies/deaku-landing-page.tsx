import Link from "next/link";
import {
  Bars,
  CaseSection,
  CodeBlock,
  DataTable,
  Figure,
  FigureGrid,
  Note,
  Prose,
  Subheading,
  TeamMap,
} from "@/components/case-study";
import footer from "@/public/images/work/deaku/study/footer-v3.jpg";
import heroAfter from "@/public/images/work/deaku/study/hero-after.jpg";
import heroBefore from "@/public/images/work/deaku/study/hero-before.jpg";
import lineA from "@/public/images/work/deaku/study/line-a.jpg";
import lineB from "@/public/images/work/deaku/study/line-b.jpg";
import option1 from "@/public/images/work/deaku/study/option-1.jpg";
import option2 from "@/public/images/work/deaku/study/option-2.jpg";
import option3 from "@/public/images/work/deaku/study/option-3.jpg";
import option4 from "@/public/images/work/deaku/study/option-4.jpg";
import option5 from "@/public/images/work/deaku/study/option-5.jpg";
import option6 from "@/public/images/work/deaku/study/option-6.jpg";
import phoneStickyCta from "@/public/images/work/deaku/study/phone-sticky-cta.jpg";
import pricingFirst from "@/public/images/work/deaku/study/pricing-first-v3.jpg";
import pricingLive from "@/public/images/work/deaku/study/pricing-live.jpg";
import problem from "@/public/images/work/deaku/study/problem-v3.jpg";
import stages from "@/public/images/work/deaku/study/stages-v3.jpg";
import themeDark from "@/public/images/work/deaku/study/theme-dark.jpg";
import themeLight from "@/public/images/work/deaku/study/theme-light.jpg";
import swiss1 from "@/public/images/work/deaku/study/swiss-1.jpg";
import swiss2 from "@/public/images/work/deaku/study/swiss-2.jpg";
import swiss3 from "@/public/images/work/deaku/study/swiss-3.jpg";
import swiss4 from "@/public/images/work/deaku/study/swiss-4.jpg";

const fitToWidth = `/**
 * Either the mock has its own phone layout, with a measured height to reserve
 * on phones, or it is scaled on phones too. One of the two is required, so a
 * box can never start at zero height.
 */
type FitToWidthProps = SharedProps &
  ({ phoneHeight: number; scaleOnPhones?: false } | { phoneHeight?: never; scaleOnPhones: true });

// The box's height, in CSS only, so it is right in the server HTML and never
// changes. Phones: the mock's own layout height. From \`sm\` up: the design
// aspect ratio, capped at maxScale.
const boxStyle = {
  '--fit-phone-height': phoneHeight === undefined ? undefined : \`\${phoneHeight}px\`,
  '--fit-max-height': \`\${designHeight * maxScale}px\`,
  aspectRatio: \`\${designWidth} / \${designHeight}\`,
} as CSSProperties;

// Which layout to render inside; nothing renders until the client has measured.
const { content } = (() => {
  if (!isNear || containerWidth === null || isPhone === null) return { content: null };
  if (isPhone && !scaleOnPhones) return { content: children };
  const scale = Math.min(containerWidth / designWidth, maxScale);
  return { content: <div style={{ width: designWidth, transform: \`translateX(-50%) scale(\${scale})\` }}>{children}</div> };
})();`;

export default function DeakuLandingCaseStudy() {
  return (
    <>
      <CaseSection label="What you’re looking at" title="My version of the page, and what’s live today.">
        <Prose>
          <p>
            I designed and built this page in two days, and the team approved the structure. Before launch, a
            founder restyled the visuals to match the brand.{" "}
            <strong>The structure, the pricing logic and the instrumentation I built are what’s live today.</strong>{" "}
            This case study shows my version.
          </p>
          <p>
            It was the first fix to come out of a larger piece of work:{" "}
            <Link href="/work/deaku-kpi-tree" className="link">
              defining Deaku’s funnel and KPI tree
            </Link>
            , which is a case study of its own.
          </p>
        </Prose>
        <TeamMap
          members={[
            { role: "Me", note: "Research, structure, copy, design, build, instrumentation", me: true },
            { role: "Two founders", note: "Brief, brand, final say on visuals" },
            { role: "Founding technical lead", note: "Event system, review" },
          ]}
        />
      </CaseSection>

      <CaseSection label="The problem" title="Nobody could see where visitors were leaving.">
        <Prose>
          <p>
            Deaku had no reliable picture of how a visitor became a paying customer. While building the KPI tree I
            asked for access to the analytics and looked at the landing page.
          </p>
        </Prose>
        <Bars
          title="96 in 100 visitors never started sign-up. The form itself converted 70%."
          rows={[
            { label: "Visited the landing page", value: 100, display: "100" },
            { label: "Started sign-up", value: 4, display: "4 in 100", strong: true },
            { label: "Created an account", value: 2.8, display: "7 in 10 of those who started" },
          ]}
          note="Eight weeks of traffic. Ratios only; visitor numbers are confidential."
        />
        <Prose>
          <p>
            <strong>People who started sign-up mostly finished it. The leak was the landing page.</strong>
          </p>
        </Prose>
        <Bars
          title="A third of visitors were on a phone. One in seven sign-up starts was."
          rows={[
            { label: "Phone share of visitors", value: 33, display: "33%" },
            { label: "Phone share of sign-up starts", value: 14, display: "14%", strong: true },
          ]}
          note="Phones started sign-up at under half the desktop rate."
        />
        <Prose>
          <ul>
            <li>
              <strong>Almost nobody engaged with the content.</strong> The hero video and the feature grids were
              opened a handful of times.
            </li>
            <li>
              <strong>The tracking was half blind.</strong> Only two of the page’s entry points were measured, and
              one event watched an element that no longer existed.
            </li>
          </ul>
        </Prose>
        <Subheading>A page working against the visitor</Subheading>
        <Prose>
          <p>
            The page was a 20-screen feature tour with seven feature grids and several competing calls to action.
            It described what the product had without saying who it was for or what problem it solved. The team’s
            own read was the same: the demos were overwhelming, and the page should lead with the outcome.
          </p>
        </Prose>
        <Figure
          wide
          image={{
            src: heroBefore,
            alt: "The old Deaku hero: “The best creators aren’t superhuman, they just have systems”, over a busy product collage",
          }}
          caption="Before: a philosophical headline, a collage of product windows and a button that says “Build Your System”."
        />
      </CaseSection>

      <CaseSection label="01 · Research and brief" title="Agree the structure first. Taste can differ later.">
        <Prose>
          <p>
            Before touching the page I researched what high-converting SaaS landing pages share, and gave the team
            a structure to react to. We agreed that style could be argued and tested freely, as long as it stayed
            within this skeleton.
          </p>
        </Prose>
        <Note title="The brief I sent the team">
          <ol>
            <li>
              <strong>The hero has one job:</strong> in under five seconds the visitor understands what this is and
              why it matters to them. An outcome headline, a subhead that says how, one CTA, the real product on
              screen, and a trust line that removes the first hesitation.
            </li>
            <li>
              <strong>A thin social-proof strip</strong>, then <strong>the problem</strong> in the visitor’s words,
              and <strong>who it’s for</strong>, before any features.
            </li>
            <li>
              <strong>The product, benefit-led:</strong> a headline about an outcome, paired with the feature that
              produces it.
            </li>
            <li>
              <strong>Deeper proof:</strong> specific testimonials with a name and a face.
            </li>
            <li>
              <strong>Pricing on the page</strong>, three tiers, with the FAQ that answers the real objections
              directly beneath.
            </li>
            <li>
              <strong>A final CTA</strong> that restates the promise. Every CTA points to the same action.
            </li>
          </ol>
          <p>
            <strong>How it should feel:</strong> “finally, a workflow tool built for me”; creator energy rooted in
            productivity; calm, seamless, help where it’s needed.
          </p>
        </Note>
      </CaseSection>

      <CaseSection label="02 · One story, one action" title="From a feature tour to a page with one job.">
        <Prose>
          <p>
            The rebuild follows that sequence and reuses existing demos wherever they earned their place. The
            headline moved from something philosophical to something a creator can act on:{" "}
            <strong>“Build the system your channel runs on.”</strong>
          </p>
        </Prose>
        <Figure
          wide
          image={{
            src: heroAfter,
            alt: "The new Deaku hero: “Build the system your channel runs on”, a username field, and the product below",
          }}
          caption="After: outcome headline, what’s in the system, one action, and a trust line (“Built with creators behind 50B+ views · Free, no card required”)."
        />
        <Subheading>Exploring the hero in code</Subheading>
        <Prose>
          <p>
            Deaku has no Figma. I design in code against the team’s living style guide, so explorations are real
            HTML that can be compared side by side and taken straight into the build.
          </p>
        </Prose>
        <FigureGrid
          columns={3}
          images={[
            { src: option1, alt: "Hero option A: heavy Poppins headline with a serif accent" },
            { src: option2, alt: "Hero option B: quiet, one wide line" },
            { src: option3, alt: "Hero option C: editorial serif headline" },
            { src: option4, alt: "Hero option D: split Swiss layout, headline left, form right" },
            { src: option5, alt: "Hero option E: centred stack" },
            { src: option6, alt: "Hero option F: light headline with an italic serif accent" },
          ]}
          caption="Six layout and type options. D, the split Swiss layout, was taken forward: the headline gets the full width and the form sits where the eye lands next."
        />
        <Figure
          wide
          image={{
            src: problem,
            alt: "Problem section: seven crossed-out tool names joining into one line that drops into “One Deaku workspace”",
          }}
          caption="The problem, in the visitor’s words, then who it’s for, before any feature is shown."
        />
        <Subheading>One call to action</Subheading>
        <Prose>
          <p>
            <strong>“Claim your username”</strong> everywhere. It’s low-commitment and personal, and the @ prefix
            makes it feel like something you already own. Every pricing button pre-selects its plan at sign-up,
            which removes a step.
          </p>
          <p>
            On phones, where sign-up starts lagged most, a full-width CTA bar appears only after the hero’s CTA
            scrolls away, and hides when the final CTA is on screen. There is never more than one CTA visible.
          </p>
        </Prose>
        <FigureGrid
          wide={false}
          columns={3}
          images={[{ src: phoneStickyCta, alt: "Phone view of a stage with a full-width “Claim your username” bar at the bottom" }]}
          caption="Phone: the sticky CTA bar."
        />
      </CaseSection>

      <CaseSection label="Key decision" title="Which plans to show.">
        <Prose>
          <p>
            Five things could plausibly be called plans: Free, Pro, Founding Partner, Scale and Network Partner.
            Showing all five would turn pricing into a spreadsheet. My first version showed the launch offer,
            Founding Partner, as its own card.
          </p>
          <p>
            I argued for <strong>Free, Pro and Scale</strong>, because each maps to a different customer: someone
            trying Deaku, a creator running an operation, and a larger team. The other two aren’t plans:
          </p>
          <ul>
            <li>
              <strong>Founding Partner is a launch offer on Pro.</strong> As its own card, the visitor never sees
              what Pro normally costs, so the discount has nothing to be a discount against. It belongs inside the
              Pro card. When the seats sell out, you delete a line instead of redesigning the section.
            </li>
            <li>
              <strong>Network Partner is a sales conversation</strong> with businesses buying accounts for other
              people. It belongs on the pricing page and as one line under Scale.
            </li>
          </ul>
        </Prose>
        <FigureGrid
          images={[
            { src: pricingFirst, alt: "First version of pricing: Free, Pro and Founding Partner as three cards" },
            { src: pricingLive, alt: "Live pricing: Free, Pro with the Founding Partner offer inside it, and Scale" },
          ]}
          caption="Left: my first version, with the launch offer as its own card. Right: the live page today, with Free, Pro and Scale, and the offer inside Pro. The recommendation shipped."
        />
      </CaseSection>

      <CaseSection label="03 · Visual concept" title="The lines draw the promise.">
        <Prose>
          <p>
            Deaku’s promise is that scattered tools become one connected system. I built the page on a Swiss grid
            and let the grid tell that story.
          </p>
          <ul>
            <li>
              <strong>The grid is the system.</strong> Faint hairlines run down the content edges and mark the top
              of every section.
            </li>
            <li>
              <strong>A thread through the stages.</strong> One line runs from Strategy to Analyse, with a node at
              each stage. The node you’re reading fills with the brand accent, the only accent on the thread.
            </li>
            <li>
              <strong>Disconnected to connected.</strong> Under the seven crossed-out tools, scattered segments
              level into one line. It’s the page’s only line animation, and it’s off for reduced motion.
            </li>
          </ul>
        </Prose>
        <FigureGrid
          images={[
            { src: swiss1, alt: "Swiss option A: poster grid, headline across three columns, action in the fourth" },
            { src: swiss2, alt: "Swiss option B: the word “system” set vertically down the right column" },
            { src: swiss3, alt: "Swiss option C: modular boxes with “system” in its own tall module" },
            { src: swiss4, alt: "Swiss option D: the existing layout with only “system” restyled" },
          ]}
          caption="Four Swiss-grid directions for the hero. A, the poster grid, set the direction for the rest of the page."
        />
        <FigureGrid
          images={[
            { src: lineA, alt: "Option A: a hairline under the word “system” only" },
            { src: lineB, alt: "Option B: the hairline under “system” runs to both edges of the screen" },
          ]}
          caption="One detail, two options. B was chosen: the line under “system” runs to the edges of the screen and starts the grid."
        />
        <Figure
          wide
          image={{
            src: stages,
            alt: "The seven stages: a sticky stage list on the left, a thread with nodes, and one live demo per stage",
          }}
          caption="Seven stages, one live demo each, cut from the original sprawl. The stage list stays in view and the thread marks where you are."
        />
        <FigureGrid
          images={[
            { src: themeLight, alt: "Stage 03, Plan, in the light theme: stage list, thread and a projects table demo" },
            { src: themeDark, alt: "The same stage in the dark theme, with the demo and its status chips recoloured" },
          ]}
          caption="Light and dark, from the same tokens. The grid, the thread and the live demos all follow the theme, so neither version is an afterthought."
        />
        <Figure
          wide
          image={{
            src: footer,
            alt: "Final call to action and footer: “Your system is waiting”, then the Deaku wordmark between two hairlines",
          }}
          caption="The final CTA restates the promise, and the wordmark closes the grid between two hairlines."
        />
      </CaseSection>

      <CaseSection label="04 · Built to hold still, and to be measured" title="Fast, stable and instrumented.">
        <Prose>
          <ul>
            <li>
              <strong>No layout shift.</strong> Every demo reserves its final height in CSS, so the server HTML is
              already correct and nothing moves as content loads. Checked in Chrome and WebKit at 390, 768 and
              1440px.
            </li>
            <li>
              <strong>Lazy loading.</strong> Heavy demos load only when they come near the viewport. The hero video
              plays only while on screen.
            </li>
            <li>
              <strong>SEO and accessibility.</strong> One h1, structured data for the app and the FAQ, and motion
              that respects reduced-motion settings.
            </li>
          </ul>
        </Prose>
        <CodeBlock
          code={fitToWidth}
          caption="Each product demo lazy-loads, so its box used to get its height from JavaScript after measuring, which shifted the page. I moved the height into CSS, and the type makes a reserved height compulsory: a box that could start at zero height won’t compile."
        />
        <Subheading>Measurable at a finer grain</Subheading>
        <Prose>
          <p>
            I wired the events that had been missing. Every section is tagged; the tracker records section views,
            the deepest section reached and the last one seen before leaving. Every CTA click records which section
            it came from, so the hero, sticky bar, pricing and final CTA can be compared.
          </p>
          <p>
            The old page stayed live at a fallback route, so the team could compare or revert with a one-line
            change.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection label="Results" title="Launched this week. Here is how I’ll know it worked.">
        <Prose>
          <p>
            The page went live on 30 September 2026. Deaku is an early-stage product, so a reliable
            reading takes about eight weeks. I’ve set the measures and targets now and will report against them.
          </p>
        </Prose>
        <DataTable
          head={["Measure", "Before", "Target", "Why"]}
          rows={[
            ["Visitors who start sign-up", "4 in 100", "6–8 in 100", "The main leak"],
            ["Phone share of sign-up starts", "14%", "25% or more", "Phones are a third of visitors"],
            ["Sign-up completion", "70%", "Stays at 70% or above", "Guardrail: more starts shouldn’t mean worse starts"],
          ]}
          caption="Targets are my proposals. Check date: late November 2026."
        />
        <Prose>
          <p>
            <strong>Already true:</strong> the structure, the three-plan pricing and the section tracking shipped,
            and the team can now see where visitors leave, not only whether they converted. The sign-up flow was
            rebuilt too, on my recommendations: the founding technical lead implemented it and I reviewed it.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection label="Reflection" title="What I’d do differently.">
        <Prose>
          <ul>
            <li>
              <strong>Agree the brand boundaries as well as the structure.</strong> We agreed the skeleton up
              front, and it held. The visuals were restyled after my hand-off; a short brand check before building
              would have saved that second pass.
            </li>
            <li>
              <strong>Next:</strong> an A/B test on the main CTA once there is enough data, and reading the
              section data to decide what to cut.
            </li>
          </ul>
        </Prose>
      </CaseSection>
    </>
  );
}
