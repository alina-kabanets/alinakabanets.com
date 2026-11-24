// Outbound links in a case study or concept hero: plain underlined text with
// an arrow, the same everywhere. Each click is tracked as its own event.
export type HeroLink = { href: string; label: string; event: string; data?: Record<string, string> };

export function HeroLinks({ links, className = "" }: { links: HeroLink[]; className?: string }) {
  if (links.length === 0) return null;
  return (
    <p className={`flex flex-wrap gap-x-6 gap-y-2 text-sm ${className}`}>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener"
          className="link"
          data-umami-event={link.event}
          {...Object.fromEntries(Object.entries(link.data ?? {}).map(([key, value]) => [`data-umami-event-${key}`, value]))}
        >
          {link.label} <span aria-hidden>↗</span>
        </a>
      ))}
    </p>
  );
}
