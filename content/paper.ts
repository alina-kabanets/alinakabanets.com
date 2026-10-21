// Copy for /paper: an independent concept about Paper (paper.design).
// Unlisted: not in the nav, homepage or sitemap, and noindexed.

export const paperPage = {
  disclaimer: "independent concept · not affiliated with Paper",
  title: "I fell for Paper in a day. The next designer should take five minutes.",
  summary:
    "What I love about Paper, where my first hour went sideways, and what I’d build as a design engineer: a front door that teaches by doing, a canvas where you work with agents by pointing instead of describing, and a loop that keeps design and code in step.",
  byline: "Alina Kabanets · October 2026",
  checked: "Roadmap and build log checked 21 October 2026.",
};

export const loves = [
  {
    title: "Paper texture",
    body: "I use it everywhere, including on my own portfolio. This card is the real shader, from Paper’s open-source library.",
  },
  {
    title: "The Welcome file",
    body: "It teaches by being the thing you learn in. It should be the front door, not a file you stumble on.",
  },
  {
    title: "A promise",
    body: "Paper connects your teams, agents, code, and data on a single design space. Finally, a continuous loop from Paper to code and back.",
  },
] as const;


export const friction = [
  {
    tag: "bug",
    title: "Mobile web, Chrome on iOS",
    body: "Scroll down a long page and open the menu: its lower half disappears.",
    screenshots: [
      {
        src: "/images/paper/mobile-menu-1.jpg",
        alt: "paper.design in Chrome on iPhone with the menu open: the bottom of the menu has disappeared and the footer shows through, cutting off “changelog”",
        width: 721,
        height: 1567,
      },
      {
        src: "/images/paper/mobile-menu-2.jpg",
        alt: "The same menu a little further down the page: everything below “roadmap” has disappeared, showing the footer",
        width: 721,
        height: 1567,
      },
      {
        src: "/images/paper/mobile-menu-3.jpg",
        alt: "Further still: only the top of “home” shows above the footer",
        width: 721,
        height: 1567,
      },
    ],
  },
  {
    tag: "onboarding",
    title: "Sign-up to desktop",
    body: "A “Connect agents” hint leads to a setup dialog that needs the desktop app. Once installed, the app opens on a dashboard with no next step, and the web version stays disabled and never updates. I finished by asking an agent how to connect, and found the Welcome file again by trial and error.",
    screenshots: [
      {
        src: "/images/paper/desktop-handoff-1.jpg",
        alt: "A “Connect agents with Paper MCP” hint in the web app, with “Set up agents” and “Maybe later”",
        width: 536,
        height: 346,
      },
      {
        src: "/images/paper/desktop-handoff-2.jpg",
        alt: "The “Connect your agent” dialog over the Welcome file. Step 1 says you need the Paper Desktop app to use the MCP server",
        width: 1389,
        height: 1009,
      },
      {
        src: "/images/paper/desktop-handoff-3.jpg",
        alt: "Paper Desktop after installing: a Recents dashboard showing Scratchpad and Welcome to Paper, with no next step",
        width: 1281,
        height: 723,
      },
    ],
  },
  {
    tag: "wayfinding",
    title: "Files says “No files yet”",
    body: "My files were in Recents, but Files stayed empty. They only showed up there much later.",
    screenshots: [
      {
        src: "/images/paper/files-empty.jpg",
        alt: "Paper Desktop’s Files view saying “No files yet”",
        width: 1286,
        height: 725,
      },
    ],
  },
  {
    tag: "activation",
    title: "Learn is one more grey item",
    body: "The most important place for getting started looks like everything else in the sidebar. Its only signal is a small blue dot, which reads as “something new”, not “start here”.",
    screenshots: [
      {
        src: "/images/paper/learn-sidebar.jpg",
        alt: "Paper Desktop’s sidebar: Recents is selected, and Learn sits below it in the same grey text with a small blue dot",
        width: 490,
        height: 1382,
      },
    ],
    highlight: true,
  },
] as const;

export const startNotes = [
  { key: "A", title: "Start is always the first tab", body: "The Welcome file and your next lesson, one click from anywhere." },
  { key: "B", title: "Watch 100 seconds, then do it", body: "Short videos that play inside Paper, each ending in “Try it on canvas”." },
  { key: "C", title: "The agent is docked", body: "Connected and visible, not a hint that sends you to another app." },
  { key: "D", title: "All files means all files", body: "Recents becomes a sort order, so Files is never empty when you have files." },
] as const;

export const lessons = [
  { title: "Connect your agent", done: true },
  { title: "Tokens from your codebase", done: true },
  { title: "Real flex layout, by hand", current: true },
  { title: "Shaders" },
  { title: "Snapshot" },
  { title: "Design to code with an agent" },
] as const;

export const canvasNotes = [
  { key: "E", title: "A notepad, not a modal", body: "The steps sit beside your work, so you never lose the canvas." },
  { key: "F", title: "It ticks itself", body: "Each step checks the real canvas state. Try it above." },
  { key: "G", title: "Hints point at the real UI", body: "Not at a screenshot of it." },
  { key: "H", title: "Finishing saves the file", body: "The practice file lands in All files and the next lesson is queued." },
] as const;

export const agentNotes = [
  {
    key: "I",
    title: "Select, then ask",
    body: "The agent already knows the canvas. Make the selection the whole brief: highlight any part, say what should change, and only that part changes, in place.",
  },
  {
    key: "J",
    title: "Remix, taken further",
    body: "Not variations of one element, but whole directions on your own tokens: add references and a one-line brief, get six side by side, then combine and push the one that’s right.",
  },
  {
    key: "K",
    title: "Talk in the sidebar, see it on the canvas",
    body: "Every prompt lands as a visible change in the file, so you stay the designer and the agent does the legwork.",
  },
  {
    key: "L",
    title: "On your system, not a generic one",
    body: "Variants use your tokens and components, so the one you pick is already close to shippable.",
  },
] as const;

// Ideas for closing the loop between Paper and code, one notepad sheet per
// theme. "buildsOn" names the shipped, in-progress or planned Paper feature
// each idea extends, from paper.design/build-log and /roadmap. "starred"
// marks the three I would start with.
export const ideaSheets = [
  {
    title: "From a rough idea to a first screen",
    ideas: [
      {
        title: "Sketch it, and let agents take it from there",
        body: "A loose sketching mode on the canvas: boxes, arrows, scribbled notes. Agents read the sketch as the brief and turn it into real layout, so you can think with a pen before you think in components.",
        buildsOn: "Pen tool and vector editing · in progress",
      },
      {
        title: "From paper to Paper",
        starred: true,
        body: "Photograph a pencil sketch from your notebook, and it lands on the canvas as an editable wireframe, ready for an agent to build on.",
        buildsOn: "Paper Snapshot · done",
      },
      {
        title: "Think the flow through first",
        body: "An agent skill that asks the questions a good product designer would: which steps, which screens, which edge cases. It starts from a library of common flows (sign-up, checkout, onboarding) and lays the screens out on the canvas.",
      },
    ],
  },
  {
    title: "Working with agents in Paper",
    ideas: [
      {
        title: "A design-native terminal",
        body: "The agent’s terminal, docked in Paper instead of in another window. It speaks design: what it read shows as a thumbnail, components as pills you can click to find on the canvas, questions come with buttons, and your selection is attached to the next prompt.",
        buildsOn: "In-app agent setup · Sep 2026",
      },
      {
        title: "Agents work on a draft page",
        body: "Agent changes land on a draft copy, and you merge what you like into the real artboards, a bit like a branch in code. The main file stays safe.",
      },
      {
        title: "Paper as a tool factory",
        starred: true,
        body: "Lessons and hints on building your own tools with agents: a texture generator, a pattern maker, a custom effect, whatever the design needs. Build it once in Paper, and the whole team and its agents can use it.",
        buildsOn: "Script and prompt engine · planned",
      },
    ],
  },
  {
    title: "One system, for people and agents",
    ideas: [
      {
        title: "Codebase components as the source of truth",
        starred: true,
        body: "A live place in Paper for every component in the codebase. Designers browse it to pick what fits, and change a component when they need something new, so the change goes back to code. Agents building in code are pointed at it, so they reuse what exists instead of inventing new styles.",
        buildsOn: "Use your code components · in progress",
      },
      {
        title: "A library of perfected designs",
        body: "A shelf of the screens and patterns the team is proudest of. Agents use it as their reference for taste and say which one they followed, like “based on: Checkout v3”, so new work looks like your best work, not the average of the internet.",
      },
      {
        title: "Rules agents follow",
        body: "Short notes on why things are the way they are, like “we never use pure black” or “one primary button per screen”, plus a good and a bad example pinned to each component. Agents read them before they build, and say which rule they applied.",
      },
      {
        title: "Design review against the library",
        body: "Before anything gets built, the agent flags any colour, spacing or component in a design that isn’t in your system.",
        buildsOn: "Tokens · June 2026",
      },
    ],
  },
  {
    title: "Design and code in step",
    ideas: [
      {
        title: "A sync label on each artboard",
        body: "“In sync”, “design is ahead” or “code is ahead”, linked to the code file. When a developer changes the component, the artboard says so and offers to update.",
      },
      {
        title: "Move in from Figma, properly",
        body: "Pasting objects already works. Next: whole files with their pages and names, Figma variables as Paper tokens, and components that arrive as your real code components, using the links Figma’s Code Connect already keeps. Plus a short report of anything that didn’t carry over.",
        buildsOn: "Figma copy and paste · May 2026",
      },
    ],
  },
] as const;

export const roadmap = [
  ["Mobile menu", "Not listed", "A bug. Not in the roadmap or the build log."],
  ["Desktop handoff", "Partly", "One-click agent setup shipped in Sept 2026. Nothing covers download to first file."],
  ["Files and Recents", "Adjacent", "Folders and cross-folder search shipped. The empty Files view isn’t mentioned."],
  ["Start page with lessons", "Not listed", "The Welcome file gained a roadmap section in Sept 2025."],
  ["Video in Paper", "Enablers", "Videos render on the canvas since Sept 2026. Lottie, Rive and YouTube embeds are planned."],
  ["Docked agent pane", "Planned", "“Script and prompt engine” is planned; a canvas-aware assistant is done."],
] as const;

export const sources = [
  { label: "paper.design/roadmap", href: "https://paper.design/roadmap" },
  { label: "paper.design/build-log", href: "https://paper.design/build-log" },
] as const;
