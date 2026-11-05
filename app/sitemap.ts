import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { getPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...projects
      .filter((project) => !project.draft)
      .map((project) => ({
        url: `${siteUrl}/work/${project.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...getPosts()
      .filter((post) => !post.draft)
      .map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.date,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  ];
}
