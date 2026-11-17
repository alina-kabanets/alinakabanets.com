import Link from "next/link";
import { gardenTeaser } from "@/content/garden";
import { profile } from "@/content/profile";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="mt-28 md:mt-44">
      <Container>
        <div className="flex justify-between gap-6 border-t border-line py-5 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <div className="flex gap-6">
            {/* The garden isn't in the header nav; this keeps it findable from every page. */}
            <Link
              href="/garden"
              className="hover:text-ink hover:underline hover:underline-offset-4"
              data-umami-event="garden-open"
              data-umami-event-location="footer"
            >
              {gardenTeaser.footerLink}
            </Link>
            <p>{profile.location}, UK</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
