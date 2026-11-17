import type { Metadata } from "next";
import { Container } from "@/components/container";
import { GardenLoader } from "@/components/garden/garden-loader";
import { gardenPage } from "@/content/garden";

export const metadata: Metadata = {
  title: "Garden",
  description: gardenPage.intro,
  alternates: { canonical: "/garden" },
};

export default function GardenPage() {
  return (
    <div className="pb-16">
      <Container>
        <div className="grid grid-cols-12 gap-x-5 pt-14 md:pt-20">
          <p className="col-span-12 mb-6 text-sm text-muted md:col-span-6 md:mb-0">{gardenPage.label}</p>
          <div className="col-span-12 md:col-span-6">
            <h1 className="text-4xl font-medium tracking-tight md:text-5xl">{gardenPage.title}</h1>
            <p className="mt-4 max-w-[34em] text-base leading-relaxed text-muted">{gardenPage.intro}</p>
          </div>
        </div>
      </Container>
      <GardenLoader />
    </div>
  );
}
