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
          <ul className="mt-8 md:mt-12">
            {projects.map((project, index) => (
              <li
                key={project.slug}
                className="group relative grid grid-cols-12 gap-x-5 gap-y-6 border-line py-16 first:pt-0 not-first:border-t md:py-32"
              >
                {/* Details stay in view while the demo plays beside them; on large
                    screens an empty column separates the two. */}
                <div className="col-span-12 md:col-span-4 md:self-start md:sticky md:top-20 lg:col-span-3">
                  <p className="text-sm">
                    {number(index)} · {project.company}
                  </p>
                  <p className="mt-1 text-sm text-muted">{project.year}</p>
                  <p className="text-sm text-muted">{project.context}</p>
                  <h3 className="mt-6 text-2xl leading-tight tracking-[-0.02em] text-balance md:text-3xl">
                    {/* Stretched link: the whole row is clickable, while the
                        demo's controls stay separate buttons above it. */}
                    <Link
                      href={`/work/${project.slug}`}
                      className="decoration-1 underline-offset-4 group-hover:underline after:absolute after:inset-0"
                      data-umami-event="case-study-open"
                      data-umami-event-project={project.slug}
                      data-umami-event-view="grid"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-base">{project.headline}</p>
                  <p className="mt-4 text-sm text-muted">{project.role}</p>
                  <p className="mt-1 text-sm text-muted">{project.tags.join(" · ")}</p>
                  <p className="mt-6 text-sm">
                    Read case study <span aria-hidden>→</span>
                  </p>
                </div>
                <div className="col-span-12 md:col-span-8 lg:col-start-5">{covers[index]}</div>
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
