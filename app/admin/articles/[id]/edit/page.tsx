import { notFound } from "next/navigation";
import ArticleForm from "@/components/ArticleForm";
import { getArticleById } from "@/lib/store";
import Link from "next/link";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticleById(params.id);
  if (!article) notFound();

  return (
    <div>
      <div
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "10px 2.5rem",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 13,
          color: "var(--text-muted)",
        }}
      >
        <Link href="/admin/articles" style={{ color: "var(--text-muted)" }}>
          All Articles
        </Link>
        <span>›</span>
        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>
          {article.title.length > 50
            ? article.title.slice(0, 50) + "..."
            : article.title}
        </span>
        {article.published && (
          <Link
            href={`/story/${article.slug}`}
            target="_blank"
            style={{
              marginLeft: "auto",
              fontSize: 12,
              padding: "4px 10px",
              background: "var(--success-bg)",
              border: "1px solid #a3d9bb",
              borderRadius: "var(--radius)",
              color: "var(--success)",
              fontWeight: 500,
            }}
          >
            View Live →
          </Link>
        )}
      </div>
      <ArticleForm article={article} mode="edit" />
    </div>
  );
}
