import { NextResponse } from "next/server";
import { getAllArticles, createArticle } from "@/lib/store";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!body.slug?.trim()) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    const article = await createArticle({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt ?? "",
      content: body.content ?? "",
      category: body.category ?? "business",
      author: body.author ?? "Editor",
      coverImage: body.coverImage ?? "",
      tags: body.tags ?? [],
      published: body.published ?? false,
      publishedAt: body.publishedAt ?? "",
      metaTitle: body.metaTitle ?? body.title,
      metaDescription: body.metaDescription ?? body.excerpt ?? "",
    });
    return NextResponse.json(article, { status: 201 });
  } catch (err: any) {
    // SQLite UNIQUE constraint on slug
    if (err?.message?.includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Slug already exists. Choose a different slug." },
        { status: 409 },
      );
    }
    console.error("Create article error:", err);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 },
    );
  }
}
