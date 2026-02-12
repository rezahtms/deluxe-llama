import type { Metadata } from "next";
import DndBoard from "./components/ui/board/DndBoard";
import { buildCanonicalUrl, siteConfig } from "./libs/seo/site-config";

export const metadata: Metadata = {
  title: "Board",
  description: siteConfig.description,
  alternates: {
    canonical: buildCanonicalUrl("/"),
  },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    url: buildCanonicalUrl("/"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: siteConfig.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: siteConfig.description,
    url: buildCanonicalUrl("/"),
  };

  return (
    <section aria-labelledby="board-section-title">
      <h2 id="board-section-title" className="sr-only">
        Project board
      </h2>
      <DndBoard />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
