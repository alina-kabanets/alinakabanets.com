// Concepts: self-initiated or anonymised work, kept apart from commercial
// case studies under /work.

export type Concept = {
  slug: string;
  title: string;
  context: string;
  headline: string;
  year: string;
  stack: string[];
  tags: string[];
  thumb: { src: string; alt: string };
  links: { demo?: string; repo?: string };
  // Unpublished concepts are reachable but hidden from search engines and the sitemap.
  draft: boolean;
};

export const concepts: Concept[] = [
  {
    slug: "ledgerline",
    title: "One queue for invoices and receipts",
    context: "B2B fintech · accounts payable",
    headline: "A dense payments queue for a treasury platform, from research to a working, tested build",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Tailwind", "Vitest"],
    tags: ["Fintech", "Dense UI", "State machine", "AI trust", "Research"],
    thumb: { src: "/images/concepts/ledgerline/01-invoices.jpg", alt: "The Ledgerline payments queue: invoices with states, amounts and actions" },
    links: {
      demo: "https://ledgerline-tawny-nu.vercel.app",
      repo: "https://github.com/alina-kabanets/ledgerline",
    },
    draft: false,
  },
];

export function getConcept(slug: string) {
  return concepts.find((concept) => concept.slug === slug);
}
