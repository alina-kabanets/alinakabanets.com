"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { Container } from "./container";

const navItems = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: profile.cv, label: "CV", external: true },
  { href: "/#contact", label: "Contact" },
];

const initials = profile.name
  .split(" ")
  .map((word) => word[0])
  .join("");

function NavLink({
  item,
  className,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  className: string;
  onNavigate?: () => void;
}) {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener"
        className={className}
        data-umami-event="cv-click"
        data-umami-event-location="nav"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // On the homepage the hero already shows the full name in large type, so
  // the header shows initials until that name scrolls out of view.
  const [heroNameVisible, setHeroNameVisible] = useState(true);
  const isHome = usePathname() === "/";
  const short = isHome && heroNameVisible;

  useEffect(() => {
    const heroName = document.getElementById("hero-name");
    if (!isHome || !heroName) return;
    const observer = new IntersectionObserver(([entry]) => setHeroNameVisible(entry.isIntersecting), {
      rootMargin: "-56px 0px 0px 0px",
    });
    observer.observe(heroName);
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="header-fade pointer-events-none sticky top-0 z-40 -mb-6 bg-paper/90 pb-6 backdrop-blur-sm *:pointer-events-auto">
      <Container className="flex h-14 items-center justify-between text-sm">
        <Link href="/" aria-label={profile.name} className="grid font-medium">
          {/* Both labels share one cell and crossfade, so nothing shifts. */}
          <span
            aria-hidden
            className={`col-start-1 row-start-1 transition-opacity duration-300 ${short ? "opacity-100" : "opacity-0"}`}
          >
            {initials}
          </span>
          <span
            aria-hidden
            className={`col-start-1 row-start-1 transition-opacity duration-300 ${short ? "opacity-0" : "opacity-100"}`}
          >
            {profile.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex gap-10">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink item={item} className="hover:underline underline-offset-4" />
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </Container>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-b border-line md:hidden">
          <Container>
            <ul className="flex flex-col pb-6 pt-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <NavLink
                    item={item}
                    className="block py-2 text-3xl tracking-tight"
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
