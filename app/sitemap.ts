import type { MetadataRoute } from "next";
import { STAGE_PAGES } from "@/lib/stages/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/start`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...STAGE_PAGES.map((stage) => ({
      url: `${SITE_URL}/start/${stage.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
