import Image from "next/image";
import { profile } from "@/content/profile";
import portrait from "@/public/images/portrait.jpg";
import { Container } from "./container";

const button =
  "inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm transition-colors hover:bg-ink hover:text-paper";

// Follows the Liam Bennett reference: oversized name, a small portrait that
// starts at the middle column and sits on the rule, text below the rule.
export function Hero() {
  return (
    <Container className="pt-10 md:pt-14">
      <h1 className="font-display text-[clamp(3.25rem,12.5vw,11.5rem)] leading-[0.88] tracking-[-0.05em]">
        {profile.name}
      </h1>

      <div className="mt-10 grid grid-cols-12 gap-x-5 md:mt-8">
        <Image
          src={portrait}
          alt={`${profile.name}, a black-and-white self-portrait with motion blur`}
          placeholder="blur"
          priority
          sizes="(min-width: 768px) 200px, 45vw"
          className="col-span-6 col-start-7 w-full max-w-[200px] md:col-span-3 md:col-start-7"
        />
      </div>

      <div className="grid grid-cols-12 gap-x-5 gap-y-8 border-t border-line pt-4 md:pt-5">
        <p className="col-span-12 text-sm md:col-span-6">
          {profile.role}
          <br />
          <span className="text-muted">{profile.stack}</span>
        </p>

        <div className="col-span-12 md:col-span-6">
          <p className="text-2xl leading-[1.15] tracking-[-0.02em] text-balance md:text-[2.25rem]">
            {profile.tagline}
          </p>
          <p className="mt-3 text-sm text-muted">
            {profile.loop.map((step, index) => (
              <span key={step}>
                {index > 0 && (
                  // Drawn rather than typed: the font's arrow glyph is too long at this size.
                  <svg
                    aria-hidden
                    viewBox="0 0 12 10"
                    className="mx-1.5 inline-block h-[0.6em] w-[0.72em] -translate-y-px"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M0 5h11M7 1l4 4-4 4" />
                  </svg>
                )}
                {index > 0 && <span className="sr-only">, then </span>}
                {step}
              </span>
            ))}
          </p>

          <p className="mt-4 flex gap-2.5 text-sm">
            <span aria-hidden className="mt-[0.45em] size-2 shrink-0 rounded-full bg-ink" />
            <span>
              {profile.openTo} · {profile.location}, {profile.workMode}
              <br />
              <span className="text-muted">{profile.availability}</span>
            </span>
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a href="#work" className={`${button} bg-ink text-paper hover:bg-transparent hover:text-ink`}>
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
            <a
              href={`mailto:${profile.email}`}
              className={button}
              data-umami-event="email-click"
              data-umami-event-location="hero"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
