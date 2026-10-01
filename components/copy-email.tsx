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
}: {
  email: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  location?: string;
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
      data-umami-event="email-copy"
      data-umami-event-location={location}
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
