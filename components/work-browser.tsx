"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/content/projects";
import { Container } from "./container";

type View = "grid" | "index";

const number = (index: number) => String(index + 1).padStart(2, "0");

// Covers are rendered on the server and passed in as elements.
export function WorkBrowser({
  projects,
  covers,
}: {
  projects: Project[];
  covers: React.ReactNode[];
}) {
  const [view, setView] = useState<View>("grid");

  return (
    <section id="work" aria-labelledby="work-heading" className="mt-28 md:mt-44">
      <Container>
        <div className="flex items-baseline justify-between border-t border-line pt-4 md:pt-5">
          <h2 id="work-heading" className="text-sm">
            Selected work <span className="text-muted">({String(projects.length).padStart(2, "0")})</span>
          </h2>
          <div role="group" aria-label="Layout" className="flex gap-4 text-sm">
            {(["grid", "index"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={view === option}
                onClick={() => setView(option)}
                className="capitalize text-muted aria-pressed:text-ink aria-pressed:underline underline-offset-4"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {view === "grid" ? (
          <ul className="mt-8 grid gap-x-5 gap-y-16 md:mt-12 md:grid-cols-2">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link
                  href={`/work/${project.slug}`}
                  className="group block"
                  data-umami-event="case-study-open"
                  data-umami-event-project={project.slug}
                  data-umami-event-view="grid"
                >
                  {covers[index]}
                  <div className="mt-4 flex items-baseline justify-between gap-6 text-sm">
                    <span>
                      {number(index)} · {project.company}, {project.context}
                    </span>
                    <span className="shrink-0 text-muted">{project.year}</span>
                  </div>
                  <h3 className="mt-3 text-2xl leading-tight tracking-[-0.02em] text-balance group-hover:underline underline-offset-4 decoration-1 md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-base">{project.headline}</p>
                  <p className="mt-3 text-sm text-muted">
                    {project.role} — {project.tags.join(" · ")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <table className="mt-8 w-full text-left text-sm md:mt-12">
            <thead className="text-muted">
              <tr>
                <th scope="col" className="w-12 pb-3 font-normal">No.</th>
                <th scope="col" className="pb-3 font-normal">Project</th>
                <th scope="col" className="hidden pb-3 font-normal md:table-cell">Role</th>
                <th scope="col" className="hidden pb-3 font-normal lg:table-cell">Result</th>
                <th scope="col" className="pb-3 text-right font-normal">Year</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.slug} className="border-t border-line align-top">
                  <td className="py-4">{number(index)}</td>
                  <td className="py-4 pr-6">
                    <Link
                      href={`/work/${project.slug}`}
                      className="link"
                      data-umami-event="case-study-open"
                      data-umami-event-project={project.slug}
                      data-umami-event-view="index"
                    >
                      {project.title}
                    </Link>
                    <span className="block text-muted">{project.company}</span>
                  </td>
                  <td className="hidden py-4 pr-6 md:table-cell">{project.role}</td>
                  <td className="hidden py-4 pr-6 lg:table-cell">{project.headline}</td>
                  <td className="py-4 text-right text-muted">{project.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Container>
    </section>
  );
}
