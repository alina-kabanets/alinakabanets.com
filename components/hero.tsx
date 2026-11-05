import Image from "next/image";
import { profile } from "@/content/profile";
import portrait from "@/public/images/portrait-square.jpg";
import { Container } from "./container";
import { CopyEmail } from "./copy-email";
import layout from "@/content/hero-layout.json";
import { HeroCanvas } from "./hero-canvas";
import { StackTags } from "./stack-tags";

// The two styles invert on hover. They don't share hover classes: when both
// sets were on one element, the outline's hover text colour won and the
// primary button's label vanished.
const buttonBase = "inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm transition-colors";
const button = `${buttonBase} hover:bg-ink hover:text-paper`;
const buttonPrimary = `${buttonBase} bg-ink text-paper hover:bg-transparent hover:text-ink`;

// The hero's pieces, each placed where content/hero-layout.json says (set
// `editable` on HeroCanvas to rearrange them on the dev server). What I do, a
// small portrait, the proof beside it, the stack, a playful line, the open-to
// line and the actions. On phones they stack in this order.
export function Hero() {
  const blocks = [
    {
      id: "headline",
      label: "Headline",
      node: (
        <h1 className="font-display font-medium">
          <span className="block text-[clamp(2.4rem,4.7vw,5.75rem)] leading-[0.95] tracking-[-0.045em]">
            {profile.hookLead}
          </span>
          <span className="mt-2 block text-[clamp(1.5rem,2.5vw,2.75rem)] leading-[1.05] tracking-[-0.03em] text-balance md:mt-3">
            {profile.hookRest}
          </span>
        </h1>
      ),
    },
    {
      id: "portrait",
      label: "Portrait",
      phone: "max-md:w-20 max-md:shrink-0",
      node: (
        <Image
          src={portrait}
          alt={`${profile.name}, smiling, in round glasses and a camel coat on a London street`}
          placeholder="blur"
          priority
          sizes="256px"
          className="w-20 md:w-full"
        />
      ),
    },
    {
      id: "proof",
      label: "Proof",
      phone: "max-md:flex-1 max-md:self-end",
      node: (
        <p className="max-w-[16rem] text-sm leading-snug md:max-w-none md:text-right">
          <span className="font-medium">{profile.proof.claim}</span>
          <span className="mt-1 block text-ink/70">{profile.proof.source}</span>
        </p>
      ),
    },
    {
      // Tags, intro, open-to line and buttons flow together as one block, so
      // longer wrapping on smaller screens or zoom can never make them overlap.
      id: "details",
      label: "Details",
      node: (
        <div>
          <StackTags items={profile.stack.split(" · ")} className="text-sm md:text-base" pill="border-ink px-3 md:px-3.5" />
          <p className="mt-6 max-w-[36rem] text-lg leading-[1.25] tracking-[-0.01em] text-balance md:mt-12 md:text-xl">
            {profile.intro}
          </p>
          <p className="mt-5 flex items-center gap-2.5 text-sm">
            <span aria-hidden className="size-2 shrink-0 rounded-full bg-ink" />
            {profile.openTo} · {profile.location}, {profile.workMode}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="#work" className={buttonPrimary}>
              See work
            </a>
            <a
              href={profile.cv}
              target="_blank"
              rel="noopener"
              className={button}
              data-umami-event="cv-click"
              data-umami-event-location="hero"
            >
              CV
            </a>
            <CopyEmail
              email={profile.email}
              label="Email"
              copiedLabel={`Copied: ${profile.email}`}
              className={button}
              location="hero"
            />
          </div>
        </div>
      ),
    },
  ];

  // Fills the first screen (less the header); the work starts below the fold.
  return (
    <Container className="@container py-8 md:h-[calc(100svh-3.5rem)] md:py-0">
      <HeroCanvas blocks={blocks} saved={layout} editable={false} />
    </Container>
  );
}
