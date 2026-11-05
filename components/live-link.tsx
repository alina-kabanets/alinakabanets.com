import type { Project } from "@/content/projects";

// "Check it live": a button to the real product, where there is a public one.
export function LiveLink({ project, className = "" }: { project: Project; className?: string }) {
  if (!project.link) return null;
  return (
    <a
      href={project.link.href}
      target="_blank"
      rel="noopener"
      className={`inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm text-paper transition-colors hover:bg-ink/80 ${className}`}
      data-umami-event="live-site-click"
      data-umami-event-project={project.slug}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-paper" />
      Check it live · {project.link.label} <span aria-hidden>↗</span>
    </a>
  );
}
