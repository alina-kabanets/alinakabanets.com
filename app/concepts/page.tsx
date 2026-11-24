import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";
import { StackTags } from "@/components/stack-tags";
import { concepts } from "@/content/concepts";

export const metadata: Metadata = {
  title: "Concepts",
  description:
    "Product design and engineering concepts by Alina Kabanets: self-initiated and anonymised work, from research to a working, tested build. Fintech and other dense, high-stakes interfaces.",
  alternates: { canonical: "/concepts" },
};

export default function ConceptsPage() {
  const published = concepts.filter((concept) => !concept.draft);
  return (
    <Container className="pt-10 md:pt-16">
      <header className="grid grid-cols-12 gap-x-5">
        <p className="col-span-12 text-sm md:col-span-4">Concepts</p>
        <div className="col-span-12 md:col-span-8">
          <h1 className="text-[clamp(2rem,3.4vw,3.25rem)] leading-[1.02] font-medium tracking-[-0.035em] text-balance">
            Problems I took end to end, outside client work
          </h1>
          <p className="mt-5 max-w-[38rem] text-lg leading-snug">
            Self-initiated or anonymised projects. Each one goes from research to a working build, so the design and
            the code can both be judged.
          </p>
        </div>
      </header>

      <ul className="mt-16 border-t border-line">
        {published.map((concept) => (
          <li key={concept.slug} className="border-b border-line">
            <Link
              href={`/concepts/${concept.slug}`}
              className="group grid grid-cols-12 gap-x-5 gap-y-6 py-8"
              data-umami-event="concept-open"
              data-umami-event-concept={concept.slug}
            >
              <div className="col-span-12 md:col-span-4">
                <p className="text-sm text-muted">
                  {concept.context} · {concept.year}
                </p>
                <h2 className="mt-3 text-2xl leading-[1.15] tracking-[-0.02em] text-balance group-hover:underline underline-offset-4 decoration-1 md:text-[2rem]">
                  {concept.title}
                </h2>
                <p className="mt-4 max-w-[28rem] leading-snug">{concept.headline}</p>
                <StackTags items={concept.stack} className="mt-5" />
              </div>
              <div className="col-span-12 md:col-span-8">
                <Image
                  src={concept.thumb.src}
                  alt={concept.thumb.alt}
                  width={2880}
                  height={1800}
                  quality={90}
                  sizes="(min-width: 768px) 66vw, 100vw"
                  className="h-auto w-full rounded-lg border border-ink/15"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
