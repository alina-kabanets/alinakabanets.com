import Image from "next/image";
import type { Project } from "@/content/projects";

export function ProjectCover({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-tint">
      {project.cover ? (
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
        />
      ) : (
        <span className="absolute bottom-4 left-4 text-sm text-muted">Visuals coming soon</span>
      )}
    </div>
  );
}
