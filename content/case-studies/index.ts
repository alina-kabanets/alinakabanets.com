import type { ComponentType } from "react";
import DeakuLandingCaseStudy from "./deaku-landing-page";
import VigorantCaseStudy from "./vigorant-healthcare-mvps";

// Full write-ups by project slug. Kept apart from projects.ts so the
// homepage (and its client components) never pull case study content in.
export const caseStudies: Record<string, ComponentType> = {
  "vigorant-healthcare-mvps": VigorantCaseStudy,
  "deaku-landing-page": DeakuLandingCaseStudy,
};
