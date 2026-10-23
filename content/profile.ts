// Single source of truth for personal details. Both the simple site and the
// future creative version (/studio) read from here.

export const profile = {
  name: "Alina Kabanets",
  role: "Design Engineer",
  // The hero's headline: what I do, not who I am (the name is everywhere else).
  hook: "From the first sketch to the first metric.",
  // Under the hook: who I am, in a line, and where I've shipped.
  intro:
    "Ex-psychologist and photographer. I design products, build them, and then watch what people actually do.",
  shipped: "Shipped in healthcare, creator tools and AI",
  stack: "Product design · React / TypeScript · Funnels & metrics",
  tagline:
    "I design and build products end to end, from user research to shipped code to the numbers that follow.",
  email: "aokabanets@gmail.com",
  location: "London",
  workMode: "hybrid or remote",
  openTo: "Open to design engineer roles",
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
  "I’m a design engineer in London. I take a feature from the user problem and the business goal, through design, to shipped React and TypeScript, and then check whether it worked.",
  "At Deaku, a five-person AI-native startup, I design and build across the web and mobile apps: the main dashboard redesign, the task-management system, the workspace invitation flow and the landing page. I also reviewed how the AI assistant, agent and MCP features behave (76 recommendations, about 90% adopted) and set up the company’s first funnel and KPI tree. The part I find most interesting is how people come to trust an agent: what it shows, what it asks, and when it stops.",
  "Before that I designed two healthcare products and their design system from scratch. I studied psychology and spent eight years as a photographer, and both still show up in my work: an interest in why people act the way they do, and an eye for detail.",
] as const;

// From a reference letter, shown in About.
export const testimonial = {
  quote:
    "Alina owned the design stage of our delivery. Every ticket that needed a UX or UI decision went through her, which in a small team made her one of the people most responsible for how the product feels to our users.",
  name: "Dr Oscar Ferguson",
  role: "CEO & Co-Founder, Deaku",
} as const;

