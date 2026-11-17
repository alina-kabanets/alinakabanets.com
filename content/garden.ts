// Copy and starter plants for /garden: a visitors' garden where people draw a
// plant in crayon and it grows next to everyone else's. Linked from the
// homepage's Garden section.

export const gardenPage = {
  label: "Garden",
  title: "Plant something.",
  intro:
    "Pick up a crayon and draw a plant. It grows here, next to everyone else’s, and gets a little marker with your name.",
  hint: "Hover or tap a plant to watch it grow · drag to wander",
  seedPlanted: "Your seed is planted. It sprouts for everyone once I’ve had a look, usually within a day.",
  sprouting: "sprouting soon",
  sprouted: "Your plant has sprouted. It’s in the garden for everyone now.",
  failed: "That didn’t plant. Please try again in a moment.",
  wateringHint: "Tap a plant to water it. Everyone sees it perk up.",
  resting: "The garden is resting right now, so new plants can’t be added. Have a wander instead.",
};

// The small section on the homepage that leads to the garden.
export const gardenTeaser = {
  label: "Garden",
  title: "Leave something growing.",
  body: "Pick up a crayon, draw a plant and leave it here. It’ll grow next to everyone else’s, with your name on a little wooden marker. Water someone’s while you’re there.",
  link: "Plant something",
};

// A single plant's page and preview card (/garden/p/<id>).
export const gardenShare = {
  label: "Garden",
  eyebrow: "A plant in the garden",
  title: (name: string) => `${name} planted this in my garden.`,
  description: "A crayon plant in Alina Kabanets’s visitors’ garden. Draw one and plant it next to it.",
  planted: (date: string) => `planted ${date}`,
  see: "See the garden and plant yours →",
  share: "Share it",
  shareText: "I planted something in Alina’s garden 🌱",
  copied: "Link copied",
};

// When someone plants without a name, they get a gardener name instead,
// shown as the placeholder so they can keep it or write their own.
export const gardenerNames = {
  adjectives: ["Sleepy", "Brave", "Curious", "Sunny", "Quiet", "Wandering", "Happy", "Gentle", "Busy", "Dreamy", "Lucky", "Shy"],
  plants: ["Fern", "Tulip", "Clover", "Poppy", "Moss", "Daisy", "Sprout", "Acorn", "Bluebell", "Sunflower", "Thistle", "Pea"],
};

// What a plant says when someone waters it (one at random each time).
export const thankYous = ["ahh, thanks!", "slurp 💧", "so refreshing", "thank you!", "mmm, water", "I feel taller"];
export const seedThankYous = ["I’ll sprout soon!", "growing…", "thanks, gardener!"];

// The crayon box. Order is the order in the tray.
export const crayons = [
  { name: "Lime", color: "#93bf45" },
  { name: "Green", color: "#4f9a4a" },
  { name: "Dark green", color: "#2f7a44" },
  { name: "Teal", color: "#2f9c95" },
  { name: "Lemon", color: "#f2d24e" },
  { name: "Yellow", color: "#e8b730" },
  { name: "Orange", color: "#e8913a" },
  { name: "Coral", color: "#f07f6a" },
  { name: "Red", color: "#d9412b" },
  { name: "Pink", color: "#e8669a" },
  { name: "Lilac", color: "#b48fd6" },
  { name: "Purple", color: "#7a52a8" },
  { name: "Sky", color: "#6fb3e0" },
  { name: "Blue", color: "#3f6fc4" },
  { name: "Brown", color: "#8a5a3b" },
  { name: "Charcoal", color: "#2a2a2a" },
] as const;

export type GardenStroke = { d: string; color: string; width: number };

export type StarterPlant = {
  id: string;
  number: number;
  name: string;
  note: string;
  /** Where the plant's base meets the soil, in garden units. */
  x: number;
  /** SVG paths with the base at (0, 0) and the soil along y = 0. */
  strokes: readonly GardenStroke[];
};

// The first plants, so the garden isn't empty. They carry gardener names,
// like anyone who plants without giving one. Friends' plants join these
// before launch (TODO(Alina): add theirs, then renumber).
export const starterPlants: readonly StarterPlant[] = [
  {
    id: "sunflower",
    number: 1,
    name: "Sunny Bumblebee",
    note: "sunflower",
    x: 200,
    strokes: [
      { d: "M 0 -2 C -4 -72 6 -132 0 -212", color: "#4f9a4a", width: 6 },
      { d: "M 1 -82 C 30 -102 52 -96 62 -112 C 40 -116 14 -106 1 -82", color: "#4f9a4a", width: 5 },
      { d: "M -1 -132 C -30 -148 -48 -142 -60 -156 C -36 -162 -14 -152 -1 -132", color: "#4f9a4a", width: 5 },
      { d: "M 0 -292 C 14 -276 32 -272 48 -266 C 36 -252 32 -236 36 -218 C 20 -222 6 -216 -4 -204 C -14 -216 -28 -220 -44 -218 C -40 -234 -44 -250 -54 -262 C -38 -268 -20 -274 0 -292", color: "#e8b730", width: 7 },
      { d: "M -16 -248 C -10 -260 10 -262 16 -248 C 22 -234 6 -224 -4 -228 C -14 -230 -20 -238 -16 -248", color: "#8a5a3b", width: 9 },
    ],
  },
  {
    id: "tulips",
    number: 2,
    name: "Shy Bluebell",
    note: "tulips",
    x: 445,
    strokes: [
      { d: "M -25 -2 C -21 -52 -29 -92 -25 -134", color: "#4f9a4a", width: 5 },
      { d: "M -25 -22 C -49 -52 -51 -76 -45 -96 C -35 -72 -27 -52 -25 -22", color: "#4f9a4a", width: 5 },
      { d: "M -45 -132 C -47 -156 -41 -170 -35 -176 L -25 -160 L -15 -176 C -9 -170 -3 -156 -5 -132 C -15 -122 -35 -122 -45 -132", color: "#d9412b", width: 6 },
      { d: "M 25 -2 C 21 -42 29 -72 25 -102", color: "#4f9a4a", width: 5 },
      { d: "M 7 -100 C 5 -122 11 -134 17 -140 L 25 -126 L 33 -140 C 39 -134 45 -122 43 -100 C 35 -92 15 -92 7 -100", color: "#7a52a8", width: 6 },
    ],
  },
  {
    id: "cactus",
    number: 3,
    name: "Brave Thistle",
    note: "cool cactus",
    x: 672,
    strokes: [
      { d: "M -22 -2 C -26 -72 -24 -132 -12 -152 C 4 -162 18 -152 20 -132 C 24 -82 22 -32 22 -2", color: "#3d8a5a", width: 6 },
      { d: "M -22 -62 C -46 -60 -56 -74 -54 -100 C -52 -112 -40 -112 -38 -100 C -36 -86 -32 -80 -22 -80", color: "#3d8a5a", width: 5 },
      { d: "M 22 -82 C 44 -82 50 -94 50 -114 C 50 -126 38 -126 36 -114 C 36 -102 32 -98 22 -98", color: "#3d8a5a", width: 5 },
      { d: "M -22 -122 L 22 -122 M -20 -122 C -20 -108 -2 -108 -2 -122 M 2 -122 C 2 -108 20 -108 20 -122", color: "#222", width: 5 },
      { d: "M -10 -100 C -4 -94 4 -94 10 -100", color: "#222", width: 3 },
      { d: "M 0 -156 C -4 -168 4 -176 10 -168 C 16 -176 24 -168 18 -158", color: "#e8669a", width: 5 },
    ],
  },
  {
    id: "daisies",
    number: 4,
    name: "Dreamy Clover",
    note: "daisies",
    x: 885,
    strokes: [
      { d: "M -5 -2 C -15 -42 5 -72 -9 -112", color: "#4f9a4a", width: 4 },
      { d: "M -9 -130 m -18 0 a 18 18 0 1 0 36 0 a 18 18 0 1 0 -36 0", color: "#bbb", width: 6 },
      { d: "M -9 -130 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0", color: "#e8b730", width: 7 },
      { d: "M 35 -2 C 43 -32 29 -52 39 -80", color: "#4f9a4a", width: 4 },
      { d: "M 39 -96 m -14 0 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0", color: "#bbb", width: 5 },
      { d: "M 39 -96 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0", color: "#e8913a", width: 6 },
      { d: "M -35 -2 C -39 -22 -29 -32 -33 -48", color: "#4f9a4a", width: 4 },
      { d: "M -33 -58 m -10 0 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0", color: "#3f6fc4", width: 5 },
    ],
  },
  {
    id: "fern",
    number: 5,
    name: "Quiet Moss",
    note: "fern",
    x: 1100,
    strokes: [
      { d: "M 0 -2 C -4 -72 10 -152 30 -222", color: "#2f7a44", width: 5 },
      { d: "M 6 -52 C -20 -58 -30 -72 -34 -86 M 10 -92 C -14 -100 -22 -114 -24 -130 M 16 -132 C -6 -142 -12 -156 -12 -172 M 22 -172 C 4 -184 0 -196 2 -210", color: "#2f7a44", width: 4 },
      { d: "M 4 -72 C 28 -80 40 -92 48 -106 M 12 -112 C 34 -122 46 -134 52 -148 M 18 -152 C 38 -162 48 -174 52 -188", color: "#2f7a44", width: 4 },
      { d: "M -40 -2 C -38 -32 -48 -52 -60 -68 M -28 -2 C -24 -36 -16 -52 -4 -62", color: "#6fae4a", width: 4 },
    ],
  },
  {
    id: "apple-tree",
    number: 6,
    name: "Lucky Acorn",
    note: "apple tree",
    x: 1370,
    strokes: [
      { d: "M 0 -2 C -4 -52 4 -92 -2 -152 M -2 -92 C -20 -112 -30 -122 -40 -136 M 0 -112 C 20 -128 30 -140 36 -154", color: "#8a5a3b", width: 7 },
      { d: "M -70 -152 C -90 -182 -70 -222 -40 -216 C -34 -252 20 -262 36 -230 C 70 -232 86 -192 62 -164 C 70 -136 34 -122 14 -138 C -4 -118 -44 -122 -50 -144 C -60 -142 -68 -146 -70 -152", color: "#4f9a4a", width: 6 },
      { d: "M -30 -184 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0 M 22 -206 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0 M 42 -166 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0", color: "#d9412b", width: 7 },
    ],
  },
];
