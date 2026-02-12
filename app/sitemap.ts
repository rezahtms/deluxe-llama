import type { MetadataRoute } from "next";
import { buildCanonicalUrl } from "./libs/seo/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: buildCanonicalUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
