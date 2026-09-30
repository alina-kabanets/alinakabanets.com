// Single source of truth for personal details. Both the simple site and the
// future creative version (/studio) read from here.

export const profile = {
  name: "Alina Kabanets",
  role: "Product Engineer",
  stack: "React / TypeScript",
  tagline:
    "I design and build products end to end, from user research to shipped code to the numbers that follow.",
  email: "aokabanets@gmail.com",
  location: "London",
  workMode: "hybrid or remote",
  openTo: "Open to product engineer roles",
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
    title: "Understand",
    body: "Start from the user problem and the business goal. Research, flows and success criteria come before pixels.",
  },
  {
    title: "Build",
    body: "Design in Figma, prototype in code, then ship production React and TypeScript. I own both the decision and the implementation.",
  },
  {
    title: "Measure",
    body: "Agree what success looks like up front, instrument it, and check after launch. Then iterate on what the numbers say.",
  },
] as const;

export const about = [
  "I’m a product engineer in London. I design and build front-end products in React and TypeScript, and I care most about the moment someone decides whether to trust what’s on the screen.",
  "At Deaku, a five-person AI-native startup, I shape how the assistant, agent and MCP features behave: what they show, what they ask, and when they stop. Before that I designed two healthcare products from scratch for a US SaaS company, including their design system.",
  "I studied psychology and spent eight years as a photographer before moving into product. Both still show up in my work: an interest in why people act the way they do, and an eye for detail and patience with craft.",
] as const;

// Self-portrait series shown in About, in display order.
export const photographs: { src: string; alt: string }[] = [
  { src: "/images/photography/8T2A4489.jpg", alt: "Black-and-white self-portrait, eyes lowered behind glasses" },
  { src: "/images/photography/8T2A4232.jpg", alt: "Self-portrait in a cream cardigan, head turning in motion blur" },
  { src: "/images/photography/8T2A4574.jpg", alt: "Self-portrait in glasses, smiling over the shoulder in motion blur" },
  { src: "/images/photography/8T2A4416.jpg", alt: "Self-portrait with a hand raised to the face, blurred in motion" },
  { src: "/images/photography/8T2A4263.jpg", alt: "Self-portrait in glasses and a knit cardigan, face dissolving in motion" },
];
