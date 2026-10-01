import type { Metadata } from "next";
import Image from "next/image";
import { CopyEmail } from "@/components/copy-email";
import { Hero } from "@/components/hero";
import { ProjectCover } from "@/components/project-cover";
import { Section } from "@/components/section";
import { WorkBrowser } from "@/components/work-browser";
import { about, photographs, principles, profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: profile.location, addressCountry: "GB" },
  sameAs: [profile.links.linkedin, profile.links.github],
  knowsAbout: ["React", "TypeScript", "Next.js", "Product design", "UX for AI agents"],
};

const contactLinks = [
  { href: profile.links.linkedin, label: "LinkedIn", event: "linkedin-click" },
  { href: profile.links.github, label: "GitHub", event: "github-click" },
  { href: profile.cv, label: "CV (PDF)", event: "cv-click" },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />

      <Hero />

      <WorkBrowser
        projects={projects}
        covers={projects.map((project, index) => (
          <ProjectCover key={project.slug} project={project} priority={index === 0} />
        ))}
      />

      <Section id="how-i-work" label="How I work">
        <ol className="grid gap-10 sm:grid-cols-2 sm:gap-x-5">
          {principles.map((principle, index) => (
            <li key={principle.title}>
              <p className="text-sm text-muted">{String(index + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 text-2xl tracking-[-0.02em]">{principle.title}</h3>
              <p className="mt-3 text-sm leading-relaxed">{principle.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="about" label="About">
        <figure>
          <ul className="grid grid-cols-5 gap-2">
            {photographs.map((photo) => (
              <li key={photo.src} className="relative aspect-square bg-tint">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 10vw, 20vw" className="object-cover" />
              </li>
            ))}
          </ul>
          <figcaption className="mt-3 text-sm text-muted">Self-portraits, 2025</figcaption>
        </figure>

        <div className="mt-12 max-w-[38rem] space-y-5 text-base leading-relaxed md:text-lg">
          {about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section id="contact" label="Contact">
        <p className="text-2xl leading-[1.15] tracking-[-0.02em] text-balance md:text-[2.5rem]">
          Let’s build something people can trust.
        </p>

        <div className="mt-10 flex items-baseline gap-5 border-t border-line pt-4">
          <a
            href={`mailto:${profile.email}`}
            className="link text-lg md:text-xl"
            data-umami-event="email-click"
            data-umami-event-location="contact"
          >
            {profile.email}
          </a>
          <CopyEmail email={profile.email} location="contact" />
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4">
          {contactLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener"
                className="link"
                data-umami-event={link.event}
                data-umami-event-location="contact"
              >
                {link.label} <span aria-hidden>↗</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-sm leading-relaxed">
          {profile.openTo} · {profile.location}, {profile.workMode}
          <br />
          <span className="text-muted">
            {profile.availability}. {profile.rightToWork}.
          </span>
        </p>
      </Section>
    </>
  );
}
