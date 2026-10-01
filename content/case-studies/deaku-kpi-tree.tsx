import Link from "next/link";
import { CaseSection, DataTable, FigureGrid, Prose, Quote, RuleCard, Subheading, TeamMap } from "@/components/case-study";
import metricsList from "@/public/images/work/deaku/kpi/metrics-list.jpg";

// Deaku's commercial figures are confidential. This write-up shows method and
// ratios only: no revenue, runway, account counts, traffic volumes or vendors,
// and nothing that hints at how many users there are.
const baseline = [
  { name: "Visits", depth: "None", figure: "", note: "The founders’ lane: marketing and sales", collapse: false },
  { name: "Sign-up start", depth: "Deep", figure: "4 in 100", note: "visitors start sign-up. 7 in 10 of them finish", collapse: true },
  { name: "Mobile sign-up", depth: "Deep", figure: "1 in 7", note: "sign-up starts is on a phone, though a third of visitors are", collapse: true },
  { name: "Activation", depth: "Medium", figure: "", note: "Tracking being added", collapse: false },
  { name: "Retention", depth: "Deep", figure: "", note: "People who signed up alone stayed alone", collapse: true },
  { name: "Free to paid", depth: "Shallow", figure: "", note: "Tracking being added", collapse: false },
];

const verdicts = [
  {
    verdict: "Dropped",
    chips: ["Satisfaction score", "Effort score"],
    style: "struck",
    why: "Too early for the number to mean anything",
  },
  {
    verdict: "Deferred",
    chips: ["Lifetime value", "Acquisition cost", "Annual contract value"],
    style: "dashed",
    why: "Not enough history to calculate them yet",
  },
  {
    verdict: "Replaced",
    chips: ["Monthly active users", "Daily active users"],
    style: "struck",
    why: "A solo user being active isn’t the product working. The north star took their place",
  },
];
// \u2011 is a non-breaking hyphen, so "sign-up" never splits across lines.
const kept = ["Visits", "Sign\u2011up start", "Mobile sign\u2011up", "Activation", "Retention", "Free to paid"];

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 10"
      className={`h-2.5 w-3 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M0 5h11M7 1l4 4-4 4" />
    </svg>
  );
}

// The metric filter as a sorting diagram: candidates go through one test and
// land in a verdict; what survives is the six-step funnel.
function MetricFilter() {
  return (
    <figure className="col-span-12 md:col-span-8 md:col-start-5">
      <p className="rounded-lg border border-ink px-4 py-3 text-center text-base md:text-lg">
        <span className="text-muted">The test:</span> if this number moved, would we do anything differently?
      </p>
      <div aria-hidden className="mx-auto h-5 w-px bg-ink/40" />

      <ul className="grid gap-2 sm:grid-cols-3">
        {verdicts.map((group) => (
          <li key={group.verdict} className="flex flex-col rounded-lg border border-ink/20 p-4">
            <p className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">{group.verdict}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.chips.map((chip) => (
                <li
                  key={chip}
                  className={`rounded-full px-2.5 py-1 text-sm ${
                    group.style === "dashed"
                      ? "border border-dashed border-ink/40"
                      : "bg-tint text-muted line-through decoration-ink/50"
                  }`}
                >
                  {chip}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-4 text-sm leading-snug text-muted">{group.why}</p>
          </li>
        ))}
      </ul>

      <div aria-hidden className="mx-auto h-5 w-px bg-ink/40" />
      <div className="rounded-xl bg-ink p-5 text-paper md:p-7">
        <p className="text-[11px] font-medium tracking-[0.12em] text-paper/75 uppercase">Kept</p>
        <p className="mt-2 text-2xl leading-[1.15] tracking-[-0.02em] md:text-[2rem]">A six-step funnel</p>
        <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6 xl:gap-x-6">
          {kept.map((step, index) => (
            <li key={step} className="relative rounded-lg bg-paper px-3 py-3 text-ink">
              {index > 0 && (
                <Arrow className="absolute top-1/2 -left-[1.15rem] hidden -translate-y-1/2 text-paper/70 xl:block" />
              )}
              <p className="text-2xl tracking-[-0.03em] text-ink/50">{index + 1}</p>
              <p className="mt-2 text-[15px] leading-snug font-medium">{step}</p>
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-3 max-w-[38rem] text-sm leading-relaxed text-muted">
        Fifteen candidates in, six numbers out.
      </figcaption>
    </figure>
  );
}

const designMetrics = [
  { name: "CTA click rate", definition: "Clicks on the main call to action ÷ landing-page visitors", ready: false },
  { name: "Section reach", definition: "Visitors who reach the workflow steps and the pricing block", ready: false },
  { name: "Bounce by source", definition: "Bounce rate, split by where the visitor came from", ready: true },
];
const levers = ["The hero message", "Where the call to action sits", "A visible price before the fold", "Proof from a real creator"];

// One branch of the tree in full: a driver, its design metrics, and the
// things design can change to move them.
function DriverBreakdown() {
  const label = "text-[11px] font-medium tracking-[0.12em] text-muted uppercase";
  // Same construction as the tree on the cover: the level label sits beside
  // the connector, and the branch is one closed bracket.
  // `through` runs the same line on across the bracket to the middle card.
  const join = (text: string, through = false) => (
    <div className="relative z-10 h-9">
      <p className={`${label} absolute bottom-2 left-0`}>{text}</p>
      <div
        aria-hidden
        className={`absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-ink/40 ${
          through ? "sm:h-[calc(100%+0.75rem)]" : ""
        }`}
      />
    </div>
  );
  const edge = "calc((100% - 1rem) / 6 - 0.5px)";
  return (
    <figure className="col-span-12 md:col-span-8 md:col-start-5">
      <p className={`${label} mb-2`}>Driver 2</p>
      <p className="rounded-lg bg-ink px-4 py-3 text-center text-paper">
        <span className="text-base font-medium md:text-lg">Sign-up start</span>
        <span className="block text-sm text-paper/80">4 in 100 visitors start sign-up</span>
      </p>

      {join("Design metrics", true)}
      <div className="relative sm:pt-3">
        <div
          aria-hidden
          className="absolute top-0 hidden h-3 border-x border-t border-ink/40 sm:block"
          style={{ left: edge, right: edge }}
        />
        <ul className="grid gap-2 sm:grid-cols-3">
          {designMetrics.map((metric) => (
            <li key={metric.name} className="relative flex flex-col rounded-lg border border-ink/20 p-4">
              <p className="text-base font-medium">{metric.name}</p>
              <p className="mt-1 text-sm leading-snug text-muted">{metric.definition}</p>
              <p
                className={`mt-4 self-start rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  metric.ready ? "bg-ink text-paper" : "border border-ink/30"
                }`}
              >
                {metric.ready ? "Countable now" : "Needs a tracking goal"}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {join("What design can change")}
      <ul className="flex flex-wrap justify-center gap-2 rounded-lg border border-ink/20 p-3">
        {levers.map((lever) => (
          <li key={lever} className="rounded-full bg-tint px-3 py-1.5 text-sm">
            {lever}
          </li>
        ))}
      </ul>
      <figcaption className="mt-4 max-w-[38rem] text-sm leading-relaxed text-muted">
        One branch of the tree, in full. Each metric has a definition and says whether it can be counted today.
        Traffic is not a design lever, so it isn’t here.
      </figcaption>
    </figure>
  );
}

// The six drivers as a left-to-right funnel. Dark cards are collapse points.
function DriverStrip() {
  return (
    <figure className="col-span-12">
      <ol className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 xl:grid-cols-6 xl:gap-x-7">
        {baseline.map((driver, index) => (
          <li
            key={driver.name}
            className={`relative flex min-h-44 flex-col rounded-xl p-4 ${
              driver.collapse ? "bg-ink text-paper" : "border border-ink/20"
            }`}
          >
            {index > 0 && (
              <svg
                aria-hidden
                viewBox="0 0 12 10"
                className="absolute top-1/2 -left-[1.15rem] hidden h-2.5 w-3 -translate-y-1/2 text-ink/50 xl:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <path d="M0 5h11M7 1l4 4-4 4" />
              </svg>
            )}
            <p
              className={`flex items-center justify-between gap-2 text-[11px] font-medium ${
                driver.collapse ? "text-paper/75" : "text-muted"
              }`}
            >
              <span>
                {index + 1}
                {driver.collapse && <span> · collapse point</span>}
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 ${driver.collapse ? "border-paper/40" : "border-ink/20"}`}
              >
                {driver.depth}
              </span>
            </p>
            <p className="mt-1 text-[15px] leading-snug font-medium">{driver.name}</p>
            <div className="mt-auto pt-4">
              {driver.figure && <p className="text-3xl tracking-[-0.03em]">{driver.figure}</p>}
              <p className={`mt-1 text-sm leading-snug ${driver.collapse ? "text-paper/80" : "text-muted"}`}>
                {driver.note}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 max-w-[38rem] text-sm leading-relaxed text-muted">
        The rule of the tree: the first stage where the number collapses is where the work goes. The tag on each
        card is how deep the design metrics go for that driver: deep on the three collapse points, none on visits.
      </figcaption>
    </figure>
  );
}

export default function DeakuKpiTreeCaseStudy() {
  return (
    <>
      <CaseSection label="Context" title="The founders bring users in. My job is to make sure they stay.">
        <Prose>
          <p>
            Deaku is an early-access workspace for creators and their teams. The company watched sign-ups, paid
            accounts and revenue. The product was collecting events, but nobody had defined which numbers mattered
            in between, or read them as a funnel.
          </p>
          <p>
            I raised it, and started with a hand-written list of about fifteen candidate metrics and one question:{" "}
            <strong>which of these matter, and how do they connect?</strong> It took about three working days,
            spread over a month alongside my other work, and gave the company its first measurement layer.
          </p>
        </Prose>
        <FigureGrid
          wide={false}
          columns={2}
          images={[
            {
              src: metricsList,
              alt: "A sheet of paper with a hand-written list of candidate metrics: active users, recurring revenue, activation, satisfaction, lifetime value, retention, churn",
            },
          ]}
          caption="Where it started: every metric I could think of, on paper. The work was deciding which ones a team this size should act on."
        />
        <TeamMap
          members={[
            { role: "Me", note: "Metric design, analysis, hypotheses, presentation", me: true },
            { role: "Two founders", note: "Target, plans, decisions" },
            { role: "Founding technical lead", note: "Added the event tracking" },
          ]}
        />
      </CaseSection>

      <CaseSection label="The problem" title="A revenue goal with nothing underneath it.">
        <Prose>
          <ul>
            <li>
              <strong>No target the metrics could ladder up to.</strong> The revenue goal existed, but it had never
              been connected to how people use the product.
            </li>
            <li>
              <strong>No agreed numbers between sign-up and payment.</strong> Activation, retention and usage had no
              definition and no baseline.
            </li>
            <li>
              <strong>The tracking that existed had gaps.</strong> Only some entry points were measured, and one
              event watched an element that no longer existed.
            </li>
          </ul>
        </Prose>
      </CaseSection>

      <CaseSection label="01 · Choose" title="A metric earns its place if it changes a decision.">
        <Prose>
          <p>
            I filtered the list with one test. Most of the list failed it at this stage of the company.
          </p>
        </Prose>
        <MetricFilter />
      </CaseSection>

      <CaseSection label="02 · Connect" title="From the revenue target down to design metrics.">
        <Prose>
          <p>
            <strong>Draft, don’t ask.</strong> I took the target from the company’s own business and sales
            plans, reconciled them where they differed, and drafted a specific target and north star for the
            founders to react to. They agreed with both.
          </p>
          <p>
            <strong>The north star: weekly active collaborating workspaces.</strong> The product is sold to teams,
            so a workspace only counts when two or more people are in it and someone has commented or reviewed
            that week.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection label="03 · Measure" title="Getting the first numbers.">
        <Prose>
          <p>
            Earlier in the year I made the case that we needed measurement, and the founding technical lead added event
            tracking to the product. So by the time I built the tree there were several months of data to read. I
            read it through a research agent with read-only access, alongside the web analytics, and I’m now
            refining the tracking so every driver in the tree can be read.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection label="04 · Baseline" title="Six drivers, and where the numbers collapse.">
        <DriverStrip />
      </CaseSection>

      <CaseSection label="05 · Design metrics" title="Hypotheses a test can disprove.">
        <Prose>
          <p>Under each driver sit two to four design metrics. Each had to pass three tests:</p>
          <ul>
            <li>Design can move it.</li>
            <li>It explains the driver above it.</li>
            <li>It can be counted now, or once tracking is added.</li>
          </ul>
        </Prose>
        <DataTable
          head={["Hypothesis", "Disproved if"]}
          rows={[
            [
              "Sign-up start: visitors can’t tell what the product does for them before the call to action",
              "The click rate stays flat after the hero is made explicit",
            ],
            [
              "Mobile: phones start sign-up at under half the desktop rate because there is no path shaped for a phone",
              "The phone start rate doesn’t close on desktop once that path exists",
            ],
          ]}
          caption="Two of the hypotheses. Each names what would prove it wrong."
        />
        <Subheading>What sits under one driver</Subheading>
        <DriverBreakdown />
        <Prose>
          <p>
            The first hypothesis led straight to the{" "}
            <Link href="/work/deaku-landing-page" className="link">
              landing page rebuild
            </Link>
            , which is its own case study.
          </p>
        </Prose>
      </CaseSection>

      <CaseSection label="06 · Decide" title="A cheap rule for what gets built.">
        <Prose>
          <p>
            Alongside the tree I proposed how to decide whether a feature is worth building, and a single place to
            collect user feedback so decisions can lean on it.
          </p>
        </Prose>
        <RuleCard
          title="The rule I proposed"
          statement="Anything that takes more than a couple of days needs a named customer, evidence and a rough revenue number. If it can’t be written in three sentences, it waits."
          itemsTitle="Where the expected number comes from, most reliable first"
          items={[
            { name: "Our own data", body: "How many active users tried a comparable feature in its first month." },
            { name: "The funnel it sits in", body: "Name the current rate and the change expected, not a usage guess." },
            {
              name: "Who it is for",
              body: "Build up from the share of users with that need. It’s crude, and it shows when the honest answer is “about four people”.",
            },
          ]}
          footer="Write the expectation down before building, with the date it will be checked. And say what would make us remove the feature, not only what success looks like."
        />
      </CaseSection>

      <CaseSection label="Outcome" title="The plan was accepted, and the area became mine.">
        <Prose>
          <ul>
            <li>
              <strong>I own the metrics.</strong> I track the six numbers, add the missing tracking and am building
              the dashboard for them.
            </li>
            <li>
              <strong>The first fixes shipped.</strong> The landing page was rebuilt and instrumented, and the
              sign-up flow was rebuilt on my recommendations.
            </li>
            <li>
              <strong>I track the six numbers weekly,</strong> against the company’s monthly targets. In the spring
              we review the set itself and may choose different things to measure.
            </li>
          </ul>
          <p>
            I delivered it as a written document, a slide deck and a live walkthrough with the team.
          </p>
        </Prose>
        <Quote name="Dr Oscar Ferguson" role="CEO & Co-Founder, Deaku">
          “Beyond her eye for detail for user experience and bugs, what I valued most was her judgement. She would
          push back when a design wasn’t right for users and back it up with evidence, and she was just as quick to
          change course when the data pointed the other way.”
        </Quote>
      </CaseSection>

      <CaseSection label="Reflection" title="What I’d do differently.">
        <Prose>
          <ul>
            <li>
              <strong>Get every data source before reading the numbers.</strong> A single source gives a partial
              picture. I now ask for all of them at the start.
            </li>
            <li>
              <strong>Next:</strong> finish the missing tracking, build the dashboard, and track the six numbers
              every week against the monthly targets.
            </li>
          </ul>
        </Prose>
      </CaseSection>
    </>
  );
}
