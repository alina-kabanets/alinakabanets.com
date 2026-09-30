type Screen = { src: string; alt: string; label: string; width: number; height: number };

export type DemoScene = {
  tag: string;
  caption: string;
  patient: Screen;
  admin: Screen;
};

type Video = { mp4: string; webm: string; poster: string; width: number; height: number };

export type Showcase = {
  before: { src: string; alt: string; width: number; height: number; caption: string };
  after: { desktop: Video; alt: string; caption: string };
};

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
  // Landscape UI screenshot, cropped to the UI (no baked-in frame or corners).
  cover?: { src: string; alt: string; width: number; height: number };
  // Scene-by-scene product demo; replaces the static cover when present.
  // Phone screens should be full-length exports: the player scrolls them.
  demo?: { title: string; scenes: DemoScene[] };
  // Before/after of a page: a long static export vs screen recordings.
  showcase?: Showcase;
  link?: { href: string; label: string };
  // Drafts are reachable but hidden from search engines and the sitemap.
  draft: boolean;
};

// Order matters: the first project is the strongest and shows first.
export const projects: Project[] = [
  {
    slug: "vigorant-healthcare-mvps",
    title: "Two healthcare MVPs, designed from scratch",
    company: "Vigorant",
    context: "Borna Care, US healthcare SaaS",
    role: "Lead product designer + front-end",
    year: "2025–26",
    headline: "Standalone Forms product won Borna’s first paying client",
    tags: ["Research", "Information architecture", "Design system", "RBAC", "Figma", "React"],
    summary: {
      role: "Lead product designer (UX/UI), front-end contributor",
      team: "Founder, product manager, back-end/DevOps and front-end developers, supporting designer (mentored by me)",
      timeline: "Nov 2025 – Feb 2026 to MVP · contract Oct 2025 – Mar 2026",
      tools: ["Figma", "Design system", "React", "TypeScript"],
      results: [
        "Patient portal and admin portal designed and shipped in ~4 months",
        "Standalone Forms product won Borna’s first paying client",
        "One permissions matrix that engineers implemented without rework",
        "60+ bugs caught and documented before launch",
      ],
    },
    cover: {
      src: "/images/work/vigorant-patient-dashboard.png",
      width: 3834,
      height: 2190,
      alt: "Vigorant patient portal dashboard with appointments, forms, payments and a calendar",
    },
    demo: {
      title: "Borna Care, product demo",
      scenes: [
        {
          tag: "11pm, patient books",
          caption:
            "Sarah opens Borna Care at 11pm and books her dental appointment without calling anyone. She picks her service, doctor and time slot in under two minutes.",
          patient: {
            src: "/images/work/borna/1-patient-booking.png",
            width: 499,
            height: 1568,
            alt: "Patient app: choosing a service, doctor and time slot",
            label: "Patient, booking",
          },
          admin: {
            src: "/images/work/borna/1-admin-dashboard.png",
            width: 1472,
            height: 1568,
            alt: "Admin dashboard with services, forms, pending users and today’s appointments",
            label: "Admin, clinic dashboard",
          },
        },
        {
          tag: "Booking confirmed instantly",
          caption:
            "Appointment confirmed. Sarah sees every detail on her confirmation screen, and the clinic gets a new-booking notification automatically. No phone calls.",
          patient: {
            src: "/images/work/borna/2-patient-confirmation.png",
            width: 860,
            height: 3488,
            alt: "Patient app: appointment confirmation with doctor, map and visit details",
            label: "Patient, confirmation",
          },
          admin: {
            src: "/images/work/borna/2-admin-notifications.png",
            width: 1568,
            height: 1011,
            alt: "Admin notifications list showing the new booking",
            label: "Admin, new booking",
          },
        },
        {
          tag: "Intake before the visit",
          caption:
            "Before the visit, Sarah completes her intake form on her phone. The clinic sees every submitted and pending form in one overview.",
          patient: {
            src: "/images/work/borna/3-patient-intake-form.png",
            width: 780,
            height: 5656,
            alt: "Patient app: multi-section intake form",
            label: "Patient, intake form",
          },
          admin: {
            src: "/images/work/borna/3-admin-forms.png",
            width: 1568,
            height: 1011,
            alt: "Admin forms overview with submitted and pending patient forms",
            label: "Admin, forms overview",
          },
        },
        {
          tag: "Paid by link",
          caption:
            "After the visit, the admin sends a payment request in four steps. Sarah gets a secure link by email or SMS and pays from her phone.",
          patient: {
            src: "/images/work/borna/4-patient-payment.webp",
            width: 245,
            height: 1080,
            alt: "Patient app: payment request with a pay now button",
            label: "Patient, payment",
          },
          admin: {
            src: "/images/work/borna/4-admin-payment-request.png",
            width: 1567,
            height: 1035,
            alt: "Admin: creating a payment request for a patient",
            label: "Admin, payment request",
          },
        },
      ],
    },
    link: { href: "https://borna.ai/", label: "borna.ai" },
    draft: false,
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
    showcase: {
      before: {
        src: "/images/work/deaku/before-feature-tour.jpg",
        width: 1200,
        height: 11527,
        alt: "The previous Deaku landing page: a long feature tour with around twenty product sections",
        caption: "A 20-screen feature tour. Every feature got a section, so none of them stood out.",
      },
      after: {
        desktop: {
          mp4: "/images/work/deaku/after-desktop.mp4",
          webm: "/images/work/deaku/after-desktop.webm",
          poster: "/images/work/deaku/after-desktop-poster.jpg",
          width: 1440,
          height: 900,
        },
        alt: "Screen recording scrolling through the redesigned Deaku landing page",
        caption: "One focused page: the problem, the workflow in seven stages, then one call to action.",
      },
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
