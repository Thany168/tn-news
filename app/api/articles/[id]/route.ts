import { NextResponse } from "next/server";
import { getArticleById, updateArticle, deleteArticle } from "@/lib/store";

type Ctx = { params: { id: string } };

export async function GET(_: Request, { params }: Ctx) {
  const article = await getArticleById(params.id);
  if (!article)
    return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(request: Request, { params }: Ctx) {
  const body = await request.json();
  try {
    const article = await updateArticle(params.id, {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      category: body.category,
      author: body.author,
      coverImage: body.coverImage,
      tags: body.tags,
      published: body.published,
      publishedAt: body.publishedAt,
      metaTitle: body.metaTitle,
      metaDescription: body.metaDescription,
    });
    if (!article)
      return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(article);
  } catch (err: any) {
    if (err?.message?.includes("UNIQUE")) {
      return NextResponse.json(
        { error: "Slug already exists." },
        { status: 409 },
      );
    }
    console.error("Update article error:", err);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  const ok = await deleteArticle(params.id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ message: "deleted" });
}
