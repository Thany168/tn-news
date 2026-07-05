import { Article } from "@/types";

const BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://news-api-production-5937.up.railway.app/api";

function h(): HeadersInit {
  return { "Content-Type": "application/json", Accept: "application/json" };
}
function toArticle(d: any): Article {
  return {
    id: String(d.id ?? ""),
    title: d.title ?? "",
    slug: d.slug ?? "",
    excerpt: d.excerpt ?? "",
    content: d.content ?? "",
    category: d.category ?? "business",
    author: d.author ?? "",
    coverImage: d.cover_image ?? d.coverImage ?? "",
    tags: Array.isArray(d.tags) ? d.tags : JSON.parse(d.tags || "[]"),
    published: Boolean(d.published),
    publishedAt: d.published_at ?? d.publishedAt ?? "",
    metaTitle: d.meta_title ?? d.metaTitle ?? "",
    metaDescription: d.meta_description ?? d.metaDescription ?? "",
    createdAt: d.created_at ?? d.createdAt ?? "",
    updatedAt: d.updated_at ?? d.updatedAt ?? "",
  };
}

function unwrapList(json: any): any[] {
  return Array.isArray(json) ? json : (json.data ?? []);
}

function unwrapOne(json: any): any {
  return json.data ?? json;
}

function toSnake(obj: Record<string, any>): Record<string, any> {
  return {
    title: obj.title,
    slug: obj.slug,
    excerpt: obj.excerpt ?? "",
    content: obj.content ?? "",
    category: obj.category ?? "business",
    author: obj.author ?? "Editor",
    cover_image: obj.coverImage ?? "",
    tags: obj.tags ?? [],
    published: obj.published ?? false,
    published_at: obj.publishedAt ?? null,
    meta_title: obj.metaTitle ?? "",
    meta_description: obj.metaDescription ?? "",
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const res = await fetch(`${BASE}/api/articles`, {
    headers: h(),
    next: { revalidate: 0 },
  });
  if (!res.ok) return [];
  return unwrapList(await res.json()).map(toArticle);
}

export async function getPublishedArticles(): Promise<Article[]> {
  const res = await fetch(`${BASE}/api/articles/published`, {
    headers: h(),
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const all = await getAllArticles();
    return all.filter((a) => a.published);
  }
  return unwrapList(await res.json()).map(toArticle);
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  const res = await fetch(`${BASE}/api/articles/${id}`, {
    headers: h(),
    next: { revalidate: 0 },
  });
  if (!res.ok) return undefined;
  return toArticle(unwrapOne(await res.json()));
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  const res = await fetch(`${BASE}/api/articles/slug/${slug}`, {
    headers: h(),
    next: { revalidate: 0 },
  });
  if (!res.ok) return undefined;
  return toArticle(unwrapOne(await res.json()));
}

export async function createArticle(
  data: Omit<Article, "id" | "createdAt" | "updatedAt">,
): Promise<Article> {
  const res = await fetch(`${BASE}/api/articles`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify(toSnake(data)),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `API error ${res.status}`);
  }
  return toArticle(unwrapOne(await res.json()));
}

export async function updateArticle(
  id: string,
  data: Partial<Article>,
): Promise<Article | null> {
  const res = await fetch(`${BASE}/api/articles/${id}`, {
    method: "PUT",
    headers: h(),
    body: JSON.stringify(toSnake(data as Record<string, unknown>)),
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `API error ${res.status}`);
  }
  return toArticle(unwrapOne(await res.json()));
}

export async function deleteArticle(id: string): Promise<boolean> {
  const res = await fetch(`${BASE}/api/articles/${id}`, {
    method: "DELETE",
    headers: h(),
  });
  return res.ok;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
