"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { Container } from "./container";

const navItems = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: profile.cv, label: "CV", external: true },
  { href: "/#contact", label: "Contact" },
];

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

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-sm">
      <Container className="flex h-14 items-center justify-between text-sm">
        <Link href="/" className="font-medium">
          {profile.name}
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
