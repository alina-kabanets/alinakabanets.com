// Copy for /paper: an independent concept about Paper (paper.design).
// Unlisted: not in the nav, homepage or sitemap, and noindexed.

export const paperPage = {
  disclaimer: "independent concept · not affiliated with Paper",
  title: "I fell for Paper in a day. The next designer should take five minutes.",
  summary:
    "What I love about Paper, where my first hour went sideways, and what I’d build as a design engineer: a Start page that turns the Welcome file into the front door, and lessons you do on the canvas instead of reading about them.",
  byline: "Alina Kabanets · October 2026",
  checked: "Roadmap and build log checked 17 October 2026.",
};

export const loves = [
  {
    title: "Paper Texture",
    body: "I use it everywhere, including on my own portfolio. This card is the real shader, from Paper’s open-source library.",
  },
  {
    title: "The Welcome file",
    body: "It teaches by being the thing you learn in. It should be the front door, not a file you stumble on.",
  },
  {
    title: "Quiet menus",
    body: "Clean, short, with the shortcuts you actually use.",
  },
] as const;

export const menu = [
  { label: "Pen tool", keys: "P" },
  { label: "Copy as React", keys: "⌥R" },
  { label: "Copy as Tailwind", keys: "⌥T" },
  { label: "Comment", keys: "C" },
] as const;

export const friction = [
  {
    tag: "bug",
    title: "Mobile web, Chrome on iOS",
    body: "Scroll to the footer and open the menu: the footer covers it.",
    screenshots: [
      {
        src: "/images/paper/mobile-menu-1.jpg",
        alt: "paper.design in Chrome on iPhone with the menu open: the footer already covers the bottom of the menu, cutting off “changelog”",
        width: 721,
        height: 1567,
      },
      {
        src: "/images/paper/mobile-menu-2.jpg",
        alt: "The same menu a little further down the page: the footer now covers everything below “roadmap”",
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

export const mobileMenuFix = `.mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 50;
  height: 100dvh;
  overflow-y: auto;
}
/* plus: lock body scroll while open; test on iOS Chrome */`;

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
