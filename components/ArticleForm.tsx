"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Article, Category } from "@/types";
//
import RichTextEditor from "@/components/RichTextEditor";
const CATEGORIES: Category[] = [
  "business",
  "technology",
  "politics",
  "sports",
  "entertainment",
  "press_release",
  "lifestyle",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface Props {
  article?: Article;
  mode: "create" | "edit";
}

export default function ArticleForm({ article, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [slugManual, setSlugManual] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    category: article?.category ?? ("business" as Category),
    author: article?.author ?? "Editor",
    coverImage: article?.coverImage ?? "",
    tags: article?.tags ?? ([] as string[]),
    published: article?.published ?? false,
    publishedAt: article?.publishedAt ?? "",
    metaTitle: article?.metaTitle ?? "",
    metaDescription: article?.metaDescription ?? "",
  });

  useEffect(() => {
    if (!slugManual && form.title)
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
  }, [form.title, slugManual]);

  useEffect(() => {
    if (!form.metaTitle || form.metaTitle === article?.title)
      setForm((f) => ({ ...f, metaTitle: f.title }));
  }, [form.title]);

  useEffect(() => {
    if (!form.metaDescription || form.metaDescription === article?.excerpt)
      setForm((f) => ({ ...f, metaDescription: f.excerpt }));
  }, [form.excerpt]);

  function set(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addTag() {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    set(
      "tags",
      form.tags.filter((t) => t !== tag),
    );
  }

  async function handleSubmit(publishNow?: boolean) {
    setError("");
    setSuccess("");
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);
    const payload = {
      ...form,
      published: publishNow !== undefined ? publishNow : form.published,
      publishedAt:
        (publishNow || form.published) && !form.publishedAt
          ? new Date().toISOString()
          : form.publishedAt,
    };
    const url =
      mode === "edit" ? `/api/articles/${article?.id}` : "/api/articles";
    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSaving(false);
        return;
      }

      setSuccess(mode === "create" ? "Article created!" : "Article updated!");
      setTimeout(() => setSuccess(""), 3000);
      router.push(`/admin/articles/${data.id}/edit`);
      router.refresh();
    } catch {
      setError("Network error — could not reach the server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this article? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/articles/${article?.id}`, { method: "DELETE" });
    router.push("/admin/articles");
    router.refresh();
  }

  const input =
    "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors placeholder:text-gray-400";
  const label =
    "block text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1.5";
  const card = "bg-white border border-gray-100 rounded-xl p-5";

  return (
    <div className="p-8 max-w-[1060px]">
      {/* Error / success banners */}
      {error && (
        <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <span className="mt-0.5 shrink-0">---</span>
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-400 hover:text-red-600 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="mb-5 flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-medium tracking-tight text-gray-900">
            {mode === "create" ? "New article" : "Edit article"}
          </h1>
          {mode === "edit" && article && (
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              /story/{article.slug}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {mode === "edit" && article && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          )}
          <button
            onClick={() => setPreview(!preview)}
            className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {preview ? "Hide preview" : "Preview"}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : form.published ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
        {/* Left */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div className={card}>
            <label className={label}>Title *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Enter article title..."
              className={`${input} text-lg font-medium`}
            />
          </div>

          {/* Slug */}
          <div className={card}>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`${label} mb-0`}>URL slug *</label>
              <button
                onClick={() => setSlugManual(!slugManual)}
                className={`text-[11px] font-medium px-2 py-0.5 rounded border transition-colors ${slugManual ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-gray-50 border-gray-200 text-gray-500"}`}
              >
                {slugManual ? "Manual" : "Auto"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 shrink-0">/story/</span>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugManual(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="article-slug-here"
                className={`${input} font-mono text-xs`}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Full URL:{" "}
              <span className="text-blue-500 font-mono">
                https://yourdomain.com/story/{form.slug || "article-slug"}
              </span>
            </p>
          </div>

          {/* Excerpt */}
          <div className={card}>
            <label className={label}>Excerpt / summary</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              placeholder="Short summary shown in article cards and SEO description..."
              rows={3}
              className={input}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              {form.excerpt.length} / 160 characters recommended for SEO
            </p>
          </div>

          {/* Content */}
          {/* <div className={card}>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`${label} mb-0`}>
                Article content (HTML) *
              </label>
              <span className="text-xs text-gray-400">Supports HTML tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {[
                { label: "B", tag: "strong" },
                { label: "I", tag: "em" },
                { label: "H2", tag: "h2" },
                { label: "H3", tag: "h3" },
                { label: "P", tag: "p" },
                { label: "Link", tag: "a" },
                { label: "Quote", tag: "blockquote" },
                { label: "UL", tag: "ul" },
              ].map(({ label: l, tag }) => (
                <button
                  key={tag}
                  onClick={() => {
                    const wrapped =
                      tag === "a"
                        ? `<a href="URL">${l}</a>`
                        : tag === "ul"
                          ? `<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>`
                          : `<${tag}>text</${tag}>`;
                    set("content", form.content + "\n" + wrapped);
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-gray-500 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                >
                  {l}
                </button>
              ))}
            </div>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              placeholder={
                "<p>Start writing your article content here...</p>\n\n<p>You can use HTML tags for formatting.</p>"
              }
              rows={18}
              className={`${input} font-mono text-xs leading-relaxed`}
            />
          </div> */}
          <div className={card}>
            <div className="flex items-center justify-between mb-3">
              <label className={`${label} mb-0`}>Article content *</label>
              <span className="text-xs text-gray-400">Rich text editor</span>
            </div>
            <RichTextEditor
              value={form.content}
              onChange={(html: any) => set("content", html)}
            />
          </div>

          {/* Preview */}
          {preview && form.content && (
            <div className="bg-white border border-blue-100 rounded-xl p-8">
              <p className="text-[10px] font-medium uppercase tracking-widest text-blue-400 mb-4">
                Content preview
              </p>
              <h1 className="text-3xl font-bold leading-snug mb-3">
                {form.title}
              </h1>
              {form.excerpt && (
                <p className="text-base text-gray-500 border-l-2 border-blue-400 pl-3 mb-6">
                  {form.excerpt}
                </p>
              )}
              <div
                className="prose prose-gray max-w-none text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: form.content }}
              />
            </div>
          )}

          {/* SEO */}
          <div className={card}>
            <p className="text-sm font-medium text-gray-900 mb-4">
              SEO and meta tags
            </p>
            <div className="mb-4">
              <label className={label}>Meta title</label>
              <input
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                placeholder="SEO title (auto-filled from title)"
                className={input}
              />
              <p
                className={`text-xs mt-1 ${form.metaTitle.length > 60 ? "text-red-500" : "text-gray-400"}`}
              >
                {form.metaTitle.length}/60 characters
              </p>
            </div>
            <div className="mb-4">
              <label className={label}>Meta description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                placeholder="SEO description (auto-filled from excerpt)"
                rows={2}
                className={input}
              />
              <p
                className={`text-xs mt-1 ${form.metaDescription.length > 160 ? "text-red-500" : "text-gray-400"}`}
              >
                {form.metaDescription.length}/160 characters
              </p>
            </div>
            {(form.metaTitle || form.title) && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-3">
                  Google preview
                </p>
                <p className="text-[17px] text-blue-700 leading-snug mb-0.5">
                  {form.metaTitle || form.title || "Article title"}
                </p>
                <p className="text-xs text-green-700 mb-1">
                  https://yourdomain.com/story/{form.slug || "slug"}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {(
                    form.metaDescription ||
                    form.excerpt ||
                    "Article description will appear here..."
                  ).slice(0, 155)}
                  {(form.metaDescription || form.excerpt).length > 155
                    ? "..."
                    : ""}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-4 sticky top-4">
          {/* Publish */}
          <div className={card}>
            <p className="text-sm font-medium text-gray-900 mb-3">
              Publish settings
            </p>
            <div
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg border mb-4 ${form.published ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}
            >
              <span
                className={`text-sm font-medium ${form.published ? "text-emerald-700" : "text-amber-700"}`}
              >
                {form.published ? " Published" : "○ Draft"}
              </span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => {
                    set("published", e.target.checked);
                    if (e.target.checked && !form.publishedAt)
                      set("publishedAt", new Date().toISOString());
                  }}
                  className="cursor-pointer"
                />
                <span className="text-xs text-gray-500">Live</span>
              </label>
            </div>
            <div className="mb-4">
              <label className={label}>Publish date</label>
              <input
                type="datetime-local"
                value={form.publishedAt ? form.publishedAt.slice(0, 16) : ""}
                onChange={(e) =>
                  set(
                    "publishedAt",
                    e.target.value
                      ? new Date(e.target.value).toISOString()
                      : "",
                  )
                }
                className={input}
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSubmit(true)}
                disabled={saving}
                className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : form.published
                    ? "Update article"
                    : "Publish now"}
              </button>
              <button
                onClick={() => handleSubmit(false)}
                disabled={saving}
                className="w-full py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
              >
                Save as draft
              </button>
            </div>
          </div>

          {/* Category */}
          <div className={card}>
            <label className={label}>Category *</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value as Category)}
              className={input}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .replace("_", " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className={card}>
            <label className={label}>Author</label>
            <input
              value={form.author}
              onChange={(e) => set("author", e.target.value)}
              placeholder="Author name"
              className={input}
            />
          </div>

          {/* Cover image */}
          <div className={card}>
            <label className={label}>Cover image URL</label>
            <input
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={input}
            />
            {form.coverImage && (
              <div className="mt-3 rounded-lg overflow-hidden max-h-36">
                <img
                  src={form.coverImage}
                  alt="Cover preview"
                  className="w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className={card}>
            <label className={label}>Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
                placeholder="Add tag and press Enter"
                className={`${input} flex-1`}
              />
              <button
                onClick={addTag}
                className="px-3 py-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-600 rounded-full"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-blue-400 hover:text-blue-600 leading-none"
                  >
                    ×
                  </button>
                </span>
              ))}
              {form.tags.length === 0 && (
                <span className="text-xs text-gray-400">No tags yet</span>
              )}
            </div>
          </div>

          {/* Article info */}
          {mode === "edit" && article && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-400 space-y-1">
              <p>Created: {new Date(article.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(article.updatedAt).toLocaleString()}</p>
              <p className="font-mono pt-1 text-gray-300">ID: {article.id}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
