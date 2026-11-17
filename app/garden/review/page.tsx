import type { Metadata } from "next";
import { Container } from "@/components/container";
import { GardenReview } from "@/components/garden/review";

// Private: Alina approves new plants here. Nothing on this page works without
// the password, but keep it out of search and links anyway.
export const metadata: Metadata = {
  title: "Garden review",
  robots: { index: false, follow: false },
};

export default function GardenReviewPage() {
  return (
    <Container className="pt-14 pb-24 md:pt-20">
      <h1 className="text-3xl font-medium tracking-tight">Garden review</h1>
      <p className="mt-2 text-base text-muted">New plants wait here until you approve them.</p>
      <GardenReview />
    </Container>
  );
}
