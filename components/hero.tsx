import { profile } from "@/content/profile";
import { Container } from "./container";

const button =
  "inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm transition-colors hover:bg-ink hover:text-paper";

export function Hero() {
  return (
    <Container className="pt-10 md:pt-16">
      <h1 className="text-[clamp(3.25rem,12.5vw,11.5rem)] leading-[0.88] font-medium tracking-[-0.05em]">
        {profile.name}
      </h1>

      <div className="mt-16 grid grid-cols-12 gap-x-5 gap-y-8 md:mt-28">
        <p className="col-span-12 text-sm md:col-span-6">
          {profile.role}
          <br />
          <span className="text-muted">{profile.stack}</span>
        </p>

        <div className="col-span-12 md:col-span-6">
          <p className="text-2xl leading-[1.15] tracking-[-0.02em] text-balance md:text-[2.5rem]">
            {profile.tagline}
          </p>

          <p className="mt-8 flex gap-2.5 text-sm">
            <span aria-hidden className="mt-[0.45em] size-2 shrink-0 rounded-full bg-ink" />
            <span>
              {profile.openTo} · {profile.location}, {profile.workMode}
              <br />
              <span className="text-muted">{profile.availability}</span>
            </span>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
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
