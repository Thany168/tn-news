import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/store";

export default async function ArticlesListPage() {
  const articles = await getAllArticles();

  return (
    <div className="p-8 max-w-[1280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            All Articles
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {articles.length} articles total
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all active:scale-95"
        >
          <span className="text-lg leading-none">+</span>
          New Article
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[80px_1fr_180px_140px_110px_120px] bg-gray-50 border-b border-gray-100 px-6 py-4 text-xs font-medium uppercase tracking-wider text-gray-500">
          <div>Image</div>
          <div>Title</div>
          <div>Category</div>
          <div>Author</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Empty State */}
        {articles.length === 0 && (
          <div className="py-20 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              ---
            </div>
            <p className="text-gray-400 font-medium">No articles yet</p>
            <Link
              href="/admin/articles/new"
              className="mt-3 inline-block text-blue-600 hover:underline text-sm font-medium"
            >
              Create your first article →
            </Link>
          </div>
        )}

        {/* Table Rows */}
        {articles.map((article, i) => (
          <div
            key={article.id}
            className={`grid grid-cols-[80px_1fr_180px_140px_110px_120px] px-6 py-4 items-center hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group`}
          >
            {/* Image */}
            <div className="relative w-14 h-10 bg-gray-100  overflow-hidden flex-shrink-0">
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">
                  IMG
                </div>
              )}
            </div>

            {/* Title + Slug */}
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate pr-4 group-hover:text-blue-600 transition-colors">
                {article.title}
              </p>
              <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">
                /story/{article.slug}
              </p>
            </div>

            {/* Category */}
            <div>
              <span className="inline-block text-[11px] font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
                {article.category.replace("_", " ")}
              </span>
            </div>

            {/* Author */}
            <p className="text-sm text-gray-600">{article.author}</p>

            {/* Status */}
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                  article.published
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {article.published ? "Published" : "Draft"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="text-xs font-medium px-4 py-2 rounded-lg border border-gray-200 hover:bg-white hover:border-gray-300 transition-colors"
              >
                Edit
              </Link>
              {article.published && (
                <Link
                  href={`/story/${article.slug}`}
                  target="_blank"
                  className="text-xs font-medium px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
