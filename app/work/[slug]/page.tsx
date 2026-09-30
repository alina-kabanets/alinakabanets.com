import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ProjectCover } from "@/components/project-cover";
import { profile } from "@/content/profile";
import { getNextProject, getProject, projects } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};

  const description = `${project.company} case study: ${project.headline}.`;
  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { type: "article", title: project.title, description },
    robots: project.draft ? { index: false, follow: true } : undefined,
  };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = getNextProject(project.slug);
  const { summary } = project;

  return (
    <article>
      <Container className="pt-10 md:pt-16">
        <Link href="/#work" className="text-sm link">
          ← All work
        </Link>

        <p className="mt-12 text-sm md:mt-20">
          Case study {String(index + 1).padStart(2, "0")} · {project.company}, {project.context}
        </p>
        <h1 className="mt-4 max-w-[16ch] text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance">
          {project.title}
        </h1>

        <div className={`mt-12 md:mt-20 ${project.demo || project.showcase ? "mx-auto max-w-[1100px]" : ""}`}>
          <ProjectCover project={project} priority />
        </div>

        {/* Summary box: someone who reads only this should still get it. */}
        <section aria-label="Summary" className="mt-10 grid grid-cols-12 gap-x-5 gap-y-8 border-t border-line pt-5">
          <dl className="col-span-12 grid grid-cols-2 gap-x-5 gap-y-6 text-sm md:col-span-6">
            {[
              ["Role", summary.role],
              ["Team", summary.team],
              ["Timeline", summary.timeline],
              ["Tools", summary.tools.join(", ")],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-muted">{term}</dt>
                <dd className="mt-1">{detail}</dd>
              </div>
            ))}
            {project.link && (
              <div>
                <dt className="text-muted">Live</dt>
                <dd className="mt-1">
                  <a
                    href={project.link.href}
                    target="_blank"
                    rel="noopener"
                    className="link"
                    data-umami-event="live-site-click"
                    data-umami-event-project={project.slug}
                  >
                    {project.link.label} <span aria-hidden>↗</span>
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <div className="col-span-12 md:col-span-6">
            <h2 className="text-sm text-muted">Key results</h2>
            <ul className="mt-3 space-y-3 text-lg leading-snug md:text-xl">
              {summary.results.map((result) => (
                <li key={result}>{result}</li>
              ))}
            </ul>
          </div>
        </section>

        {project.draft && (
          <section aria-label="Status" className="mt-28 grid grid-cols-12 gap-x-5 border-t border-line pt-5 md:mt-44">
            <p className="col-span-12 text-sm md:col-span-6">In progress</p>
            <div className="col-span-12 mt-6 md:col-span-6 md:mt-0">
              <p className="text-2xl leading-[1.15] tracking-[-0.02em] text-balance md:text-[2.5rem]">
                The full write-up is on its way.
              </p>
              <p className="mt-6 max-w-[34rem] leading-relaxed">
                In the meantime I’m happy to walk you through this project, including the research, the decisions
                and what I’d do differently.
              </p>
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(`${project.company} case study`)}`}
                className="mt-8 inline-flex h-11 items-center rounded-full border border-ink bg-ink px-5 text-sm text-paper transition-colors hover:bg-transparent hover:text-ink"
                data-umami-event="email-click"
                data-umami-event-location="case-study"
                data-umami-event-project={project.slug}
              >
                Ask for a walkthrough
              </a>
            </div>
          </section>
        )}

        {next.slug !== project.slug && (
          <nav aria-label="Next project" className="mt-28 border-t border-line pt-5 md:mt-44">
            <p className="text-sm text-muted">Next project</p>
            <Link
              href={`/work/${next.slug}`}
              className="mt-3 block text-3xl tracking-[-0.03em] text-balance hover:underline underline-offset-4 decoration-1 md:text-5xl"
              data-umami-event="case-study-open"
              data-umami-event-project={next.slug}
              data-umami-event-view="next"
            >
              {next.title} →
            </Link>
          </nav>
        )}
      </Container>
    </article>
  );
}
