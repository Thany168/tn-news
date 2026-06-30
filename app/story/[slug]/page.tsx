import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getPublishedArticles } from "@/lib/store";
import Image from "next/image";
import logo from "../../../public/logo.jpg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Not Found" };

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function StoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticleBySlug(params.slug);
  if (!article || !article.published) notFound();

  const catColor: Record<string, string> = {
    business: "#1a6b45",
    technology: "#1a4f8a",
    politics: "#6b1a1a",
    press_release: "#5c3d8a",
    sports: "#0f6e56",
    entertainment: "#8a5c0a",
    lifestyle: "#5c4a1a",
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Header />

      <main className="max-w-[760px] mx-auto px-6 py-10 pb-16">
        {/* Category + meta */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-[11px] font-bold tracking-[0.06em]"
            style={{
              color: catColor[article.category] || "var(--text-secondary)",
            }}
          >
            {article.category.replace("_", " ").toUpperCase()}
          </span>
          <span className="text-sm text-[var(--text-muted)]">·</span>
          <span className="text-sm text-[var(--text-muted)]">
            {article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-[34px] font-extrabold leading-tight tracking-[-0.03em] mb-4">
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-[18px] text-[var(--text-secondary)] leading-[1.7] border-l-3 border-[var(--accent)] pl-4 mb-8">
          {article.excerpt}
        </p>

        {/* Author + share */}
        <div className="flex items-center justify-between py-4 border-t border-b border-[var(--border)] mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--accent-bg)] flex items-center justify-center text-sm font-semibold text-[var(--accent-dark)]">
              {article.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">{article.author}</div>
              <div className="text-xs text-[var(--text-muted)]">
                Staff Reporter
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {["Facebook", "Twitter", "LinkedIn"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs px-3 py-1 border border-[var(--border-strong)] rounded-md text-[var(--text-secondary)] font-medium hover:bg-[var(--surface-2)] transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Cover image */}
        {article.coverImage && (
          <div className="rounded-[var(--radius-lg)] overflow-hidden mb-8 max-h-[450px]">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="article-content prose prose-neutral dark:prose-invert max-w-none text-[17px] leading-[1.85]"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-10 pt-5 border-t border-[var(--border)]">
            <div className="text-xs font-semibold text-[var(--text-muted)] mb-3 tracking-[0.05em] uppercase">
              TAGS
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 bg-[var(--surface-2)] border border-[var(--border)] rounded-full text-[var(--text-secondary)]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Slug display */}
        <div className="mt-8 p-3 bg-[var(--surface-2)] rounded-md text-xs text-[var(--text-muted)] font-mono">
          /story/{article.slug}
        </div>
      </main>
      <Footer />
    </div>
  );
}
