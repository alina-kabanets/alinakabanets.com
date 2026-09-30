import { profile } from "@/content/profile";
import { Container } from "./container";

export function SiteFooter() {
  return (
    <footer className="mt-28 md:mt-44">
      <Container>
        <div className="flex justify-between border-t border-line py-5 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p>{profile.location}</p>
        </div>
      </Container>
    </footer>
  );
}
