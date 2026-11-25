import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CaseSection, Note, Prose, Stats, Subheading } from "@/components/case-study";
import { FlowVideo } from "@/components/concepts/flow-video";
import {
  AiIdeas,
  DocumentPair,
  Domains,
  DoubleDiamond,
  EdgeCases,
  EmpathyMap,
  JourneyMap,
  Metrics,
  Personas,
  ReceiptQuirks,
  Risks,
  StateMachine,
  TabsDecision,
  Trace,
  TrustRules,
} from "@/components/concepts/ledgerline-visuals";
import { type Screen, ScreenCarousel } from "@/components/concepts/screen-carousel";
import { ZoomGrid } from "@/components/concepts/zoom-grid";
import { Container } from "@/components/container";
import { HeroLinks } from "@/components/hero-links";
import { StackTags } from "@/components/stack-tags";
import { getConcept } from "@/content/concepts";
import { edgeCases, invoiceJourney, receiptJourney } from "@/content/ledgerline";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import invoices from "@/public/images/concepts/ledgerline/01-invoices.jpg";
import hero from "@/public/images/concepts/ledgerline/hero.jpg";
import traceAfter from "@/public/images/concepts/ledgerline/trace-after.jpg";
import traceCode from "@/public/images/concepts/ledgerline/trace-code.jpg";
import traceFund from "@/public/images/concepts/ledgerline/trace-fund.jpg";
import traceIntake from "@/public/images/concepts/ledgerline/trace-intake.jpg";
import tracePayee from "@/public/images/concepts/ledgerline/trace-payee.jpg";
import traceReceipts from "@/public/images/concepts/ledgerline/trace-receipts.jpg";
import traceReview from "@/public/images/concepts/ledgerline/trace-review.jpg";
import traceTriage from "@/public/images/concepts/ledgerline/trace-triage.jpg";
import receipts from "@/public/images/concepts/ledgerline/02-receipts.jpg";
import upload from "@/public/images/concepts/ledgerline/03-upload.jpg";
import review from "@/public/images/concepts/ledgerline/04-review.jpg";
import bankChange from "@/public/images/concepts/ledgerline/05-bank-change.jpg";
import receipt from "@/public/images/concepts/ledgerline/06-receipt.jpg";
import confirm from "@/public/images/concepts/ledgerline/07-confirm.jpg";
import notesPains from "@/public/images/concepts/ledgerline/notes-01-pains-gains.jpg";
import notesInvoice1 from "@/public/images/concepts/ledgerline/notes-03-journey-invoice-1.jpg";
import notesInvoice2 from "@/public/images/concepts/ledgerline/notes-04-journey-invoice-2.jpg";
import notesReceipts from "@/public/images/concepts/ledgerline/notes-05-journey-receipts.jpg";

const concept = getConcept("ledgerline")!;
const path = "/concepts/ledgerline";
const title = "Accounts payable UI for invoices and receipts: a fintech concept";
const description =
  "Fintech product design and engineering case study: a dense accounts payable queue for supplier invoices and receipts, with AI extraction people can check, a tested payment state machine and a live demo.";
const edgeCaseCount = edgeCases.reduce((sum, [, items]) => sum + items.length, 0);

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "fintech product design",
    "accounts payable UI",
    "invoice management",
    "receipt capture",
    "B2B payments",
    "treasury",
    "AI in finance",
    "dense UI",
    "design engineer",
    "product engineer",
    "Next.js case study",
  ],
  alternates: { canonical: path },
  // A page's openGraph replaces the layout's, so the shared fields are repeated.
  openGraph: {
    type: "article",
    url: path,
    siteName: profile.name,
    locale: "en_GB",
    title,
    description,
    authors: [profile.name],
  },
  twitter: { card: "summary_large_image", title, description },
};

const author = {
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  sameAs: [profile.links.linkedin, profile.links.github],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${siteUrl}${path}#article`,
      headline: concept.title,
      alternativeHeadline: title,
      description,
      url: `${siteUrl}${path}`,
      image: `${siteUrl}${path}/opengraph-image`,
      datePublished: "2026-11-24",
      inLanguage: "en-GB",
      author,
      keywords: "fintech, accounts payable, invoices, receipts, treasury, B2B payments, AI, state machine, dense UI",
      about: [
        { "@type": "Thing", name: "Accounts payable" },
        { "@type": "Thing", name: "Financial technology" },
        { "@type": "Thing", name: "User interface design" },
      ],
      hasPart: {
        "@type": "SoftwareSourceCode",
        name: "Ledgerline",
        codeRepository: concept.links.repo,
        programmingLanguage: "TypeScript",
        author,
      },
      video: {
        "@type": "VideoObject",
        name: "Paying a batch of invoices in Ledgerline",
        description: "Select ready invoices, check the account balance against the total, and schedule the payments.",
        thumbnailUrl: `${siteUrl}/videos/concepts/ledgerline/pay-poster.jpg`,
        contentUrl: `${siteUrl}/videos/concepts/ledgerline/pay.mp4`,
        uploadDate: "2026-11-24",
        duration: "PT15S",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Concepts", item: `${siteUrl}/concepts` },
        { "@type": "ListItem", position: 3, name: concept.title, item: `${siteUrl}${path}` },
      ],
    },
  ],
};

const screens: Screen[] = [
  {
    label: "Invoices",
    src: invoices,
    alt: "The payments queue: invoices with issue and due dates, state in words, amount and the main action on every row",
    caption: "What needs a person comes first. The state in words, then the reason; the main action in the same place on every row.",
  },
  {
    label: "Receipts",
    src: receipts,
    alt: "The receipts tab: merchant, who sent each receipt and by which channel, category and state",
    caption: "Receipts get their own tab, with who sent each one and how, so finance knows whom to ask.",
  },
  {
    label: "Upload",
    src: upload,
    alt: "Upload panel: each file shown with what it was read as and why, and the files that failed with a reason",
    caption: "Each file says what it was read as and why. One bad file never blocks the rest.",
  },
  {
    label: "Review",
    src: review,
    alt: "Review: the invoice document beside its fields, the focused field highlighted on the document",
    caption: "The document beside the fields. Focus a field and its source lights up; every value says where it came from.",
  },
  {
    label: "Bank change",
    src: bankChange,
    alt: "An invoice whose bank details differ from the saved contact, with payment blocked until resolved",
    caption: "Bank details that differ from the saved contact block payment: the classic invoice fraud.",
  },
  {
    label: "Itemised receipt",
    src: receipt,
    alt: "A receipt with two VAT rates, itemised into lines that add up to the total",
    caption: "A receipt whose tax doesn’t match its code can’t be waved through. Itemising fixes it.",
  },
  {
    label: "Confirm",
    src: confirm,
    alt: "Confirm payments: source account and balance against the total, with unusual payments listed first",
    caption: "The account’s balance against the total and what’s already scheduled. Anything unusual is listed first.",
  },
];

const video = (name: string) => ({
  src: `/videos/concepts/ledgerline/${name}.mp4`,
  poster: `/videos/concepts/ledgerline/${name}-poster.jpg`,
});

function OutLink({ href, children, event }: { href: string; children: React.ReactNode; event: string }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="link" data-umami-event={event} data-umami-event-concept="ledgerline">
      {children} <span aria-hidden>↗</span>
    </a>
  );
}

export default function LedgerlineConcept() {
  const { links } = concept;
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Container className="pt-10 md:pt-16">
        <Link href="/concepts" className="text-sm link">
          ← All concepts
        </Link>

        {/* Same shop window as the work case studies: the pitch on the left, the
            product on the right. */}
        <div className="mt-8 grid grid-cols-12 gap-x-5 gap-y-10 md:mt-10">
          <header className="col-span-12 lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
            <p className="text-sm">Concept · {concept.context}</p>
            <h1 className="mt-4 text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance">
              {concept.title}
            </h1>
            <p className="mt-5 max-w-[30rem] text-lg leading-snug text-balance md:text-xl">{concept.headline}</p>
            <StackTags items={concept.stack} className="mt-6" />
            <HeroLinks
              className="mt-6"
              links={[
                ...(links.demo ? [{ href: links.demo, label: "Try the live demo", event: "concept-demo-click", data: { concept: "ledgerline" } }] : []),
                ...(links.repo ? [{ href: links.repo, label: "Code on GitHub", event: "concept-repo-click", data: { concept: "ledgerline" } }] : []),
                ...(links.deck ? [{ href: links.deck, label: "Design process deck", event: "concept-deck-click", data: { concept: "ledgerline" } }] : []),
              ]}
            />
          </header>
          <div className="col-span-12 lg:col-span-8">
            <Image
              src={hero}
              alt="The payments queue: invoices with due dates, state in words, amount and the main action on every row"
              quality={90}
              placeholder="blur"
              preload
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="h-auto w-full rounded-lg border border-ink/15"
            />
          </div>
        </div>

        <section aria-label="Summary" className="mt-14 grid grid-cols-12 gap-x-5 gap-y-8 border-t border-line pt-5">
          <dl className="col-span-12 grid grid-cols-2 gap-x-5 gap-y-6 text-sm md:col-span-6">
            {[
              ["Role", "Everything: research, design, build, tests"],
              ["Origin", "A take-home task for a fintech company, shared with permission and anonymised"],
              ["Timeline", "October 2026 · three days"],
              ["Tools", "Next.js, TypeScript, Tailwind, Vitest, Claude Code"],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-muted">{term}</dt>
                <dd className="mt-1">{detail}</dd>
              </div>
            ))}
          </dl>
          <div className="col-span-12 md:col-span-6">
            <h2 className="text-sm text-muted">What it shows</h2>
            <ul className="mt-3 space-y-3 text-lg leading-snug md:text-xl">
              <li>A dense, exception-first queue for two documents with different lives</li>
              <li>A strict state machine, so no screen can skip a step or pay twice</li>
              <li>AI that prepares and explains, while a person moves the money</li>
            </ul>
          </div>
        </section>

        <CaseSection label="The product" title="Seven screens, from upload to scheduled payment.">
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <ScreenCarousel title="Ledgerline screens" screens={screens} />
          </div>
        </CaseSection>

        <CaseSection label="Watch it work" title="Four flows, recorded from the working build.">
          <div className="col-span-12 grid gap-x-5 gap-y-10 md:grid-cols-2">
            <FlowVideo
              {...video("upload")}
              title="Upload a mixed batch"
              caption="Each file is read, typed and explained. An “invoice” already paid by card becomes a receipt; unreadable files say why."
            />
            <FlowVideo
              {...video("review")}
              title="Review with the source in view"
              caption="Focusing a field lights up where its value came from. Codes from history are labelled as such."
            />
            <FlowVideo
              {...video("bank")}
              title="Changed bank details"
              caption="Compared with the saved contact; the difference blocks payment until a person resolves it."
            />
            <FlowVideo
              {...video("pay")}
              title="Pay a batch"
              caption="Select what’s ready, check the balance against the total, schedule. A euro invoice waits for a euro account."
            />
          </div>
        </CaseSection>

        <CaseSection label="The problem" title="Receipts were squeezed into screens built for invoices.">
          <Prose>
            <p>
              A B2B finance platform lets companies pay supplier invoices from their treasury account. Customers started
              sending receipts too, and they landed in the invoice screens. The brief: one page that takes both to their
              end state, uses AI to remove the typing, and is ready for more accounting systems.
            </p>
          </Prose>
          <DocumentPair />
        </CaseSection>

        <CaseSection label="Process" title="Two rounds of opening up and narrowing down.">
          <DoubleDiamond />
        </CaseSection>

        <CaseSection label="Discover" title="Learning the domain before designing anything.">
          <Prose>
            <p>
              Product pages and demo videos of treasury and AP platforms, then the basics: GL and tax codes, settlement,
              how Xero and NetSuite fit in. Then every form a receipt can take, because each is an edge case waiting.
            </p>
          </Prose>
          <ReceiptQuirks />
          <Subheading>Five people around a document</Subheading>
          <Personas />
        </CaseSection>

        <CaseSection label="Define" title="One persona, and two journeys that show where it hurts.">
          <EmpathyMap />
          <Subheading>On paper first</Subheading>
          <ZoomGrid
            images={[
              { src: notesInvoice1, alt: "Handwritten invoice journey, stages 1 to 3: gather, triage, review, with friction and ideas under each" },
              { src: notesInvoice2, alt: "Handwritten invoice journey, stages 4 to 8: code, check payee, ready to pay, fund and pay, after" },
              { src: notesReceipts, alt: "Handwritten receipts journey: collect, check, fix, close" },
              { src: notesPains, alt: "Handwritten list of the finance lead’s pains and gains" },
            ]}
            caption="Worked through by hand before any screen. The maps below are the tidy version."
          />
          <JourneyMap title="An invoice, from arrival to paid" stages={invoiceJourney} />
          <JourneyMap title="Receipts at month end" stages={receiptJourney} />
        </CaseSection>

        <CaseSection label="Develop" title="Exploring options before committing to one.">
          <Subheading>The key decision: two tabs, or one mixed list?</Subheading>
          <TabsDecision />
          <Subheading>AI ideas, made specific</Subheading>
          <AiIdeas />
        </CaseSection>

        <CaseSection label="Deliver" title="Every finding from the journeys, answered on screen.">
          <Trace
            shots={{
              intake: traceIntake,
              triage: traceTriage,
              review: traceReview,
              code: traceCode,
              payee: tracePayee,
              fund: traceFund,
              after: traceAfter,
              receipts: traceReceipts,
            }}
          />
          <Subheading>AI that earns trust</Subheading>
          <TrustRules />
          <Subheading>Under the hood</Subheading>
          <StateMachine />
          <Stats
            items={[
              { value: "5", label: "screens, from upload to scheduled payment" },
              { value: String(edgeCaseCount), label: "edge cases handled, most with an example in the demo data" },
              { value: "65", label: "tests on the rules, the state machine and the money arithmetic" },
            ]}
          />
          <EdgeCases />
        </CaseSection>

        <CaseSection label="Honest about the gaps" title="What could go wrong, and how I’d measure it.">
          <Prose>
            <p>
              No backend and no real extraction: four server calls are mocked, with delays and scripted failures.
              Approvals, a full pay-run view and exchange rates are left out. These are the risks I’d design for next.
            </p>
          </Prose>
          <Risks />
          <Subheading>How I’d measure it</Subheading>
          <Metrics />
        </CaseSection>

        <CaseSection label="Beyond finance" title="The same patterns run every dense, high-stakes queue.">
          <Prose>
            <p>
              Fintech is where I started, but the same problems come up wherever mistakes are expensive and every screen
              is dense.
            </p>
          </Prose>
          <Domains />
        </CaseSection>

        <CaseSection label="How I worked" title="Research and decisions by me, code with an AI pair.">
          <Prose>
            <p>
              I built it with Claude Code. I set the direction, made the product calls and reviewed the work; the AI wrote
              much of the code to that plan. Midway I asked it to review its own code for defects. It found 30, from a
              “mark as paid” that skipped every check to a refresh that assumed a payment had gone through, and the fixes
              reshaped the code around one state machine.
            </p>
          </Prose>
          <Note title="See for yourself">
            <ul>
              {links.demo && (
                <li>
                  <OutLink href={links.demo} event="concept-demo-click">Live demo</OutLink>: everything behind the UI is
                  mocked; “Reset demo data” starts again.
                </li>
              )}
              {links.repo && (
                <li>
                  <OutLink href={links.repo} event="concept-repo-click">Code on GitHub</OutLink>: the build history and a
                  code walkthrough.
                </li>
              )}
              {links.deck && (
                <li>
                  <OutLink href={links.deck} event="concept-deck-click">Design process deck</OutLink>: all 22 slides, from
                  sources to metrics.
                </li>
              )}
            </ul>
          </Note>
        </CaseSection>
      </Container>
    </article>
  );
}
