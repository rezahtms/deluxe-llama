import type { MetadataRoute } from "next";
import { buildCanonicalUrl } from "./libs/seo/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: buildCanonicalUrl("/sitemap.xml"),
    host: buildCanonicalUrl("/"),
  };
}
