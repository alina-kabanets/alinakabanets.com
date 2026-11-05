import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import portrait from "@/public/images/portrait-square.jpg";
import { CopyEmail } from "./copy-email";

// Who wrote this, for readers who land on a post from a link: the portrait,
// what I do, and the way to my work and to me.
export function AuthorCard() {
  return (
    <aside aria-label="About the author" className="flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-start">
      <Image src={portrait} alt={profile.name} sizes="96px" className="size-20 shrink-0 md:size-24" />
      <div>
        <p className="text-sm text-muted">Written by</p>
        <p className="mt-1 text-xl leading-snug tracking-[-0.01em]">
          {profile.name}, {profile.hookLead.toLowerCase()} {profile.hookRest}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/#work"
            className="inline-flex h-11 items-center rounded-full border border-ink bg-ink px-5 text-sm text-paper transition-colors hover:bg-transparent hover:text-ink"
            data-umami-event="blog-to-work"
          >
            See my work
          </Link>
          <CopyEmail
            email={profile.email}
            label="Email"
            copiedLabel={`Copied: ${profile.email}`}
            className="inline-flex h-11 items-center rounded-full border border-ink px-5 text-sm transition-colors hover:bg-ink hover:text-paper"
            location="blog"
          />
        </div>
      </div>
    </aside>
  );
}
