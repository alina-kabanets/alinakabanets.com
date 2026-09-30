import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="pt-10 md:pt-16">
      <p className="text-sm text-muted">404</p>
      <h1 className="mt-4 text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.045em]">
        This page doesn’t exist.
      </h1>
      <p className="mt-10 flex gap-6">
        <Link href="/" className="link">
          Home
        </Link>
        <Link href="/#work" className="link">
          Selected work
        </Link>
      </p>
    </Container>
  );
}
