// Single source of truth for personal details. Both the simple site and the
// future creative version (/studio) read from here.

export const profile = {
  name: "Alina Kabanets",
  role: "Product & Design Engineer",
  stack: "Product design · React / TypeScript · Funnels & metrics",
  tagline:
    "I design and build products end to end, from user research to shipped code to the numbers that follow.",
  // Small supporting line in the hero.
  loop: ["User problem + business goal", "design", "shipped code", "measured"],
  email: "aokabanets@gmail.com",
  location: "London",
  workMode: "hybrid or remote",
  openTo: "Open to product and design engineer roles",
  availability:
    "Available now for 3 days a week, or full-time with 1 month’s notice",
  rightToWork: "Fully authorised to work in the UK",
  cv: "/alina-kabanets-cv.pdf",
  links: {
    linkedin: "https://www.linkedin.com/in/alina-kabanets/",
    github: "https://github.com/alina-kabanets",
  },
} as const;

export const principles = [
  {
    title: "Problem + goal",
    body: "Start from the user’s pain points and the business goal. Research, flows and success criteria come before pixels.",
  },
  {
    title: "Design",
    body: "Structure first, then interaction and visual design, in Figma or straight in code against a design system.",
  },
  {
    title: "Shipped code",
    body: "Production React and TypeScript, on web and React Native. I work agent-first, with a multi-agent Claude Code setup.",
  },
  {
    title: "Measured",
    body: "Agree what success looks like up front, instrument it, and check after launch. The next change starts from the numbers.",
  },
] as const;

export const about = [
  "I’m a product and design engineer in London. I take a feature from the user problem and the business goal, through design, to shipped React and TypeScript, and then check what it changed.",
  "At Deaku, a five-person AI-native startup, I own the design stage: every ticket that needs a UX or UI decision comes through me before engineering starts. I’ve designed and built more than 80 features and fixes across the web and mobile apps, including the landing page redesign, reviewed how the AI assistant, agent and MCP features behave (76 recommendations, about 90% adopted), and set up the company’s first funnel and KPI tree. The part I find most interesting is how people come to trust an agent: what it shows, what it asks, and when it stops.",
  "Before that I designed two healthcare products and their design system from scratch. I studied psychology and spent eight years as a photographer, and both still show up in my work: an interest in why people act the way they do, and an eye for detail.",
] as const;

// From a reference letter, shown in About.
export const testimonial = {
  quote:
    "Alina owned the design stage of our delivery. Every ticket that needed a UX or UI decision went through her, which in a small team made her one of the people most responsible for how the product feels to our users.",
  name: "Dr Oscar Ferguson",
  role: "CEO & Co-Founder, Deaku",
} as const;

// Self-portrait series shown in About, in display order.
export const photographs: { src: string; alt: string }[] = [
  { src: "/images/photography/8T2A4489.jpg", alt: "Black-and-white self-portrait, eyes lowered behind glasses" },
  { src: "/images/photography/8T2A4232.jpg", alt: "Self-portrait in a cream cardigan, head turning in motion blur" },
  { src: "/images/photography/8T2A4574.jpg", alt: "Self-portrait in glasses, smiling over the shoulder in motion blur" },
  { src: "/images/photography/8T2A4416.jpg", alt: "Self-portrait with a hand raised to the face, blurred in motion" },
  { src: "/images/photography/8T2A4263.jpg", alt: "Self-portrait in glasses and a knit cardigan, face dissolving in motion" },
];
