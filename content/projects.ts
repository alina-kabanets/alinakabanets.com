export type Project = {
  slug: string;
  title: string;
  company: string;
  context: string;
  role: string;
  year: string;
  headline: string;
  tags: string[];
  summary: {
    role: string;
    team: string;
    timeline: string;
    tools: string[];
    results: string[];
  };
  cover?: { src: string; alt: string };
  // Drafts are reachable but hidden from search engines and the sitemap.
  draft: boolean;
};

// Order matters: the first project is the strongest and shows first.
export const projects: Project[] = [
  {
    slug: "vigorant-healthcare-mvps",
    title: "Two healthcare MVPs, designed from scratch",
    company: "Vigorant",
    context: "US healthcare SaaS",
    role: "Lead designer + front-end",
    year: "2025–26",
    headline: "Standalone Forms product won the company’s first paying client",
    tags: ["Research", "Information architecture", "Design system", "RBAC", "Figma", "React"],
    summary: {
      role: "Lead UX/UI designer and front-end contributor",
      team: "Lead developer, supporting designer (mentored by me)",
      timeline: "Oct 2025 – Mar 2026 · contract",
      tools: ["Figma", "Design system", "React", "TypeScript"],
      results: [
        "Patient portal and admin portal designed and shipped in ~4 months",
        "Standalone Forms product secured the company’s first paying client",
        "One permissions matrix that engineers implemented without rework",
      ],
    },
    draft: true,
  },
  {
    slug: "deaku-landing-page",
    title: "Rebuilding a landing page for conversion",
    company: "Deaku",
    context: "AI-native creator workspace",
    role: "Design, build + measurement, lead",
    year: "2026",
    headline: "A 20-screen feature tour became one focused, mobile-first page",
    tags: ["UX strategy", "Figma", "Next.js", "Funnel metrics", "KPI tree"],
    summary: {
      role: "Led design, front-end build and measurement",
      team: "Five-person startup; three stakeholders",
      timeline: "2026",
      tools: ["Figma", "Next.js", "TypeScript", "Claude Code"],
      results: [
        "20-screen feature tour restructured into one mobile-first page",
        "Three stakeholders’ input aligned into one shipped design",
        "Company’s first funnel: six metrics from visit to free-to-paid, linked to revenue",
      ],
    },
    draft: true,
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}
