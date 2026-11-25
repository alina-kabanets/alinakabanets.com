import Image from "next/image";
import type { Project } from "@/content/projects";
import { DemoPlayer } from "./demo-player";
import { KpiTree } from "./kpi-tree";
import { LandingShowcase } from "./landing-showcase";

// A live demo or before/after when the project has one, otherwise the
// screenshot at full width with the same rounded corners and outline as the demo screens.
export function ProjectCover({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (project.demo) {
    return <DemoPlayer title={project.demo.title} scenes={project.demo.scenes} />;
  }

  if (project.showcase) {
    return <LandingShowcase title={`${project.company} landing page`} showcase={project.showcase} />;
  }

  if (project.diagram === "kpi-tree") {
    return <KpiTree />;
  }

  if (project.cover) {
    return (
      <Image
        src={project.cover.src}
        alt={project.cover.alt}
        width={project.cover.width}
        height={project.cover.height}
        // The case study hero spans 8 of 12 columns; UI text needs the full-size
        // image and a higher quality to stay sharp.
        sizes="(min-width: 1024px) 66vw, 100vw"
        quality={90}
        className="h-auto w-full rounded-lg border border-ink/15"
        priority={priority}
      />
    );
  }

  return (
    <div className="relative aspect-[4/3] bg-tint">
      <span className="absolute bottom-4 left-4 text-sm text-muted">Visuals coming soon</span>
    </div>
  );
}
