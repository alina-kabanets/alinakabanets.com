import Image from "next/image";
import { profile } from "@/content/profile";
import portrait from "@/public/images/portrait-square.jpg";
import { Container } from "./container";
import { CopyEmail } from "./copy-email";

// The two styles invert on hover. They don't share hover classes: when both
// sets were on one element, the outline's hover text colour won and the
// primary button's label vanished.
const buttonBase = "inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm transition-colors";
const button = `${buttonBase} hover:bg-ink hover:text-paper`;
const buttonPrimary = `${buttonBase} bg-ink text-paper hover:bg-transparent hover:text-ink`;

// Layout after a reference Alina chose, reworked to keep the actions in the
// first view: the hook set huge on the left with the disciplines, pitch and
// actions under it, and on the right the portrait on a tinted block captioned
// with the role and where I've shipped.
export function Hero() {
  // Fills the first screen (less the header) with the content centred, so the
  // work section starts just below the fold.
  return (
    <Container className="grid min-h-[calc(100svh-3.5rem)] grid-cols-12 content-center gap-x-5 py-6 md:py-12">
      {/* The headline is the hook, like a trailer's opening line; the name is
          in the header. */}
      <h1 className="col-span-12 font-display text-[clamp(2.6rem,6.4vw,8rem)] leading-[0.9] font-medium tracking-[-0.05em] text-balance md:col-span-8">
        {profile.hook}
      </h1>

      {/* The portrait sits on a tinted block, captioned with the role and where
          I've shipped.
          On phones it follows the actions, so they stay in the first view. */}
      <div className="relative order-last col-span-12 mt-10 md:order-none md:col-span-4 md:col-start-9 md:row-span-2 md:mt-2 md:mb-4 md:self-end">
        <div aria-hidden className="absolute top-[16%] right-[8%] -bottom-4 left-0 bg-tint" />
        <div className="relative flex items-end justify-between gap-3 pl-5">
          <p className="pb-1">
            <span className="block text-base leading-tight font-medium tracking-[-0.01em]">
              {profile.role}
            </span>
            <span className="mt-0.5 block text-sm leading-snug text-ink/75">
              {profile.shipped}
            </span>
          </p>
          <Image
            src={portrait}
            alt={`${profile.name}, smiling, in round glasses and a camel coat on a London street`}
            placeholder="blur"
            priority
            sizes="(min-width: 768px) 18vw, 50vw"
            className="w-[46%] shrink-0 md:w-[52%]"
          />
        </div>
      </div>

      <div className="col-span-12 mt-10 md:col-span-7 md:mt-[clamp(2.5rem,9vh-1rem,6rem)]">
        {/* The disciplines as small tags, above the pitch. */}
        <ul className="flex flex-wrap gap-2 text-xs">
          {profile.stack.split(" · ").map((item) => (
            <li key={item} className="rounded-full border border-ink/25 px-2.5 py-1">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-[34rem] text-xl leading-[1.2] tracking-[-0.02em] text-balance md:text-2xl">
          {profile.intro}
        </p>

        <p className="mt-5 flex gap-2.5 text-sm">
          <span aria-hidden className="mt-[0.45em] size-2 shrink-0 rounded-full bg-ink" />
          <span>
            {profile.openTo} · {profile.location}, {profile.workMode}
            <br />
            <span className="text-muted">{profile.availability}</span>
          </span>
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
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
    </Container>
  );
}
