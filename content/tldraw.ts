// Copy for /tldraw: an independent concept about tldraw (tldraw.com and the
// tldraw SDK). Unlisted: not in the nav, homepage or sitemap, and noindexed.
// Same shape as content/paper.ts.

import type { Friction } from "@/components/paper/lost-timeline";
import type { IdeaSheet } from "@/components/paper/ideas-sheet";

export const tldrawPage = {
  disclaimer: "independent concept · not affiliated with tldraw",
  // TODO(Alina): title in your own words.
  title: "tldraw is the canvas everyone builds on. Getting started should feel like drawing.",
  summary:
    "Where my first hour with tldraw went sideways, and what I’d build as a design engineer: a front door that teaches by doing, a canvas where you work with agents by pointing instead of describing, and one path from a board on tldraw.com to an app built on the SDK.",
  byline: "Alina Kabanets · November 2026",
  checked: "Blog, releases and starter kits checked 4 November 2026.",
};

// My first hour, in order. Screenshots in public/images/tldraw/.
export const friction: readonly Friction[] = [
  {
    tag: "activation",
    title: "A blank canvas",
    body: "It opens empty: a toolbar, a style panel and “Get a license for production”. Nothing says what tldraw can do beyond drawing, or where to start.",
    highlight: true,
    screenshots: [
      {
        src: "/images/tldraw/blank-canvas.jpg",
        alt: "An empty tldraw canvas: the toolbar at the bottom, colour and style panel at the top right, and “Get a license for production” in the corner",
        width: 1568,
        height: 850,
      },
    ],
  },
  {
    tag: "onboarding",
    title: "Make Real wants API keys",
    body: "I pay for an AI subscription, but Make Real asks for a separate API key for each provider. Every field says “risky but cool”, and nothing says what the risk is.",
    screenshots: [
      {
        src: "/images/tldraw/make-real-keys-1.jpg",
        alt: "Make Real’s Settings dialog over the canvas: provider, model, system prompt, and OpenAI, Anthropic and Google API key fields",
        width: 1567,
        height: 882,
      },
      {
        src: "/images/tldraw/make-real-keys-2.jpg",
        alt: "Close-up of the dialog: each API key field has the placeholder “risky but cool”, and the OpenAI one is in red",
        width: 490,
        height: 732,
      },
    ],
  },
];

export const timelineEnds = {
  start: { title: "TODO · where you started (tldraw.com, the docs, npm create tldraw?)" },
  end: { title: "TODO · the moment it clicked", body: "Everything below is about getting people there faster." },
};

export const startNotes = [
  { key: "A", title: "Start is a board, not a page", body: "The first thing you open is a canvas that teaches: the next lesson, one click from anywhere." },
  { key: "B", title: "Watch 30 seconds, then do it", body: "Each lesson opens with a short tldraw flash animation, then hands you the pen: “Try it on the board”." },
  { key: "C", title: "Your agent is on the board", body: "ChatGPT, Codex or Claude shows up as a collaborator with a cursor, not as a setting in another app." },
  { key: "D", title: "One road from app to SDK", body: "The last lesson ends in npm create tldraw, with the board you just made as the starting point." },
] as const;

export const lessons = [
  { title: "Draw anything, tidy it up", done: true },
  { title: "Arrows that stick", done: true },
  { title: "Point with a comment", current: true },
  { title: "Bring in your agent" },
  { title: "Animate it with flash" },
  { title: "Build your own canvas with the SDK" },
] as const;

export const canvasNotes = [
  { key: "E", title: "A sticky, not a modal", body: "The steps are a note on the board, so you never leave the canvas to learn it." },
  { key: "F", title: "It ticks itself", body: "Each step checks the real editor state. Try it above." },
  { key: "G", title: "Hints point at the real UI", body: "The toolbar button glows, not a screenshot of it." },
  { key: "H", title: "Finishing saves the board", body: "The practice board lands in your files and the next lesson is queued." },
] as const;

export const agentNotes = [
  {
    key: "I",
    title: "Select, then comment",
    body: "The selection is the brief. Pin a comment to the shapes you mean, @mention the agent, and it answers in the thread and changes only that part.",
  },
  {
    key: "J",
    title: "Agents are collaborators",
    body: "A name, a cursor and a colour, like any person on the board. You can see where it is working, follow it, or pause it.",
  },
  {
    key: "K",
    title: "Talk in the chat, see it on the canvas",
    body: "Every prompt lands as a visible change on the board, so you stay the one drawing and the agent does the legwork.",
  },
  {
    key: "L",
    title: "Undo per agent",
    body: "Each agent’s changes are their own history. Roll back one agent without losing what you or the others did.",
  },
] as const;

// Ideas, one notepad sheet per theme. "buildsOn" names the shipped tldraw
// feature or post each idea extends, from tldraw.dev/blog, /releases and
// /starter-kits. "starred" marks the three I would start with.
export const ideaSheets: readonly IdeaSheet[] = [
  {
    title: "From a rough idea to a working canvas",
    ideas: [
      {
        title: "Tell it what you’re building",
        body: "npm create tldraw asks one question, “what are you making?”, and composes the starter kits to match: a workflow builder with multiplayer, an agent with comments. The first run is your app, not a demo.",
        buildsOn: "Starter kits · create tldraw",
      },
      {
        title: "From paper to tldraw",
        starred: true,
        body: "Photograph a pencil sketch, and it lands on the board as real tldraw shapes and arrows, not an image. Then an agent takes it from there.",
        buildsOn: "Make Real",
      },
      {
        title: "Think the flow through first",
        body: "An agent skill that asks the questions a good product designer would: which steps, which screens, which edge cases. It lays the flow out on the board as frames and arrows you can rearrange before anything is built.",
      },
    ],
  },
  {
    title: "Working with agents on the canvas",
    ideas: [
      {
        title: "A design-native terminal",
        body: "The agent’s terminal, docked in tldraw instead of in another window. It speaks canvas: what it read shows as a thumbnail, shapes and components as pills you can click to find on the board, questions come with buttons, and your selection is attached to the next prompt.",
        buildsOn: "tldraw for ChatGPT and Codex · Sep 2026",
      },
      {
        title: "Point, don’t describe",
        starred: true,
        body: "Comments become the way you talk to agents everywhere, not just in the SDK. Select shapes, comment, @mention the agent. It replies in the thread, and resolving the thread accepts the change.",
        buildsOn: "Commenting · SDK 5.3 · “Agents can’t point”",
      },
      {
        title: "Agents work on a branch page",
        body: "Agent changes land on a draft copy of the page, and you merge what you like, a bit like a branch in code. The main board stays safe, even with three agents on it.",
      },
      {
        title: "An agent kit for your own shapes",
        body: "Custom shapes come with a short description agents can read, so the agent in your app knows your shapes as well as the built-in ones, without extra prompting.",
        buildsOn: "Agent starter kit",
      },
    ],
  },
  {
    title: "One SDK, for people and agents",
    ideas: [
      {
        title: "Docs that coding agents get right",
        starred: true,
        body: "Every example as a small, typed recipe with a test, published in a form agents read well, plus a check that flags outdated APIs in generated code. Most people now meet the SDK through an agent; it should know v5, not v2.",
        buildsOn: "“20 things I wish AI chatbots knew about tldraw” · Jun 2026",
      },
      {
        title: "Custom shapes from a sentence",
        body: "“A kanban card with a status and an owner” becomes a ShapeUtil, a tool and a test, added to your project and shown live on the board.",
      },
      {
        title: "The examples are the onboarding",
        body: "The examples gallery becomes a path: each one is a lesson with a goal, a running canvas and the next step, instead of a list to search.",
      },
    ],
  },
  {
    title: "tldraw.com and the SDK, in step",
    ideas: [
      {
        title: "“How is this built?”",
        body: "Anything on tldraw.com, like comments or arrows, can show the SDK example behind it. People who love the app find the SDK by using it.",
      },
      {
        title: "Lessons made in flash",
        body: "The short lesson videos are tldraw flash animations, so they look like the board, cost little to make, and anyone on the team can update one when the UI changes.",
        buildsOn: "tldraw flash · Sep 2026",
      },
    ],
  },
];

export const sources = [
  { label: "tldraw.dev/blog", href: "https://tldraw.dev/blog" },
  { label: "tldraw.dev/releases", href: "https://tldraw.dev/releases" },
  { label: "tldraw.dev/starter-kits", href: "https://tldraw.dev/starter-kits/overview" },
] as const;
