"use client";

import { useState } from "react";

// Copies the address rather than opening a mail app: a mailto link opens an
// unconfigured Mail app for anyone who reads email in the browser.
export function CopyEmail({
  email,
  label = "Copy",
  copiedLabel = "Copied",
  className = "text-sm text-muted hover:text-ink",
  location,
  icon = false,
}: {
  email: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  location?: string;
  // Show a copy icon (a tick once copied) instead of the text label.
  icon?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={className}
      title={icon ? (copied ? copiedLabel : label) : undefined}
      data-umami-event="email-copy"
      data-umami-event-location={location}
    >
      {icon ? (
        <>
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {copied ? (
              <path d="M3 8.5l3.2 3.2L13 5" />
            ) : (
              <>
                <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                <path d="M10.5 5.5v-1.5a1.5 1.5 0 0 0-1.5-1.5h-5a1.5 1.5 0 0 0-1.5 1.5v5a1.5 1.5 0 0 0 1.5 1.5h1.5" />
              </>
            )}
          </svg>
          <span aria-live="polite" className="sr-only select-none">
            {copied ? copiedLabel : label}
          </span>
        </>
      ) : (
        <span aria-live="polite">{copied ? copiedLabel : label}</span>
      )}
    </button>
  );
}
