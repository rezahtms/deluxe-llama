const FALLBACK_BASE_URL = "https://deluxe-llama.vercel.app";

const normalizeBaseUrl = (value: string): string => value.replace(/\/+$/, "");

const envBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

export const siteConfig = {
  name: "deluxe-llama",
  title: "Task Management Board",
  description: "Kanban-style task management tool for planning and tracking work.",
  locale: "en_US",
  baseUrl: normalizeBaseUrl(envBaseUrl || FALLBACK_BASE_URL),
};

export const buildCanonicalUrl = (path = "/"): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${siteConfig.baseUrl}/`).toString();
};
