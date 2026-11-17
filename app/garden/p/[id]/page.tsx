import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { PlantPreview } from "@/components/garden/plant-preview";
import { gardenShare } from "@/content/garden";
import { getPlant } from "@/lib/garden-store";

// One visitor's plant, with its own link and preview card so people can share
// it. Only approved plants have a page. Rendered on first visit, then cached.
export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };

async function approved(id: string) {
  if (!/^[a-f0-9]{12}$/.test(id)) return null;
  const plant = await getPlant(id).catch(() => null);
  return plant?.status === "approved" ? plant : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plant = await approved((await params).id);
  if (!plant) return { title: "Garden" };
  const title = gardenShare.title(plant.name);
  return {
    title,
    description: gardenShare.description,
    alternates: { canonical: `/garden/p/${plant.id}` },
    // Visitors' drawings are shared by link, not offered to search engines.
    robots: { index: false, follow: true },
    openGraph: { type: "website", url: `/garden/p/${plant.id}`, title, description: gardenShare.description },
  };
}

export default async function PlantPage({ params }: Props) {
  const plant = await approved((await params).id);
  if (!plant) notFound();
  const date = new Date(plant.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Container className="pt-14 pb-24 md:pt-20">
      <div className="grid grid-cols-12 gap-x-5">
        <p className="col-span-12 mb-6 text-sm text-muted md:col-span-6 md:mb-0">{gardenShare.label}</p>
        <div className="col-span-12 md:col-span-6">
          <h1 className="text-4xl font-medium tracking-tight md:text-5xl">{gardenShare.title(plant.name)}</h1>
          <p className="mt-4 text-base text-muted">
            {plant.note ? `“${plant.note}” · ` : ""}
            {gardenShare.planted(date)}
          </p>
          <PlantPreview strokes={plant.strokes} className="mt-10 h-[22rem] w-full max-w-[34rem]" />
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-lg">
            <Link href="/garden" className="link" data-umami-event="garden-open" data-umami-event-location="plant-page">
              {gardenShare.see}
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
