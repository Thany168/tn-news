import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/store";

const BASE_URL = "https://tn-news-psi.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getPublishedArticles();

  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/story/${article.slug}`,
    lastModified: article.updatedAt ? new Date(article.updatedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      changeFrequency: "daily",
      priority: 1,
    },
    ...articleUrls,
  ];
}
