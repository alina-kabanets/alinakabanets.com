import { getProject, projects } from "@/content/projects";
import { ogSize, renderOgImage } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  return renderOgImage({
    eyebrow: project ? `Case study · ${project.company}, ${project.context}` : "Case study",
    title: project?.title ?? "Case study",
  });
}
