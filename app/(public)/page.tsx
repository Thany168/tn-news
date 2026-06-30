import Link from "next/link";
import { getPublishedArticles } from "@/lib/store";
import { BreakingTicker } from "./components/Breakingticker";
import { NewsSidebar } from "./components/Newssidebar";
import { CategorySection } from "./components/Categorysection ";
import { ImagePlaceholder } from "./components/Imageplaceholder ";
import {
  categoryColors,
  allCategories,
  formatCategory,
  formatLongDate,
  formatShortDate,
} from "@/lib/news-ui-helpers";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const allArticles = await getPublishedArticles();

  const activeCategory = searchParams.category ?? "";
  const articles = activeCategory
    ? allArticles.filter((a) => a.category === activeCategory)
    : allArticles;

  const featured = articles[0];
  const heroSide = articles.slice(1, 4);
  const topStories = articles.slice(4, 10);
  const latestNews = articles.slice(0, 8);

  // Sidebar data — derived from existing articles, no new backend needed
  const trending = allArticles.slice(0, 5);
  const mostRead = [...allArticles].reverse().slice(0, 5);
  const editorsPicks = allArticles.slice(0, 3);

  const categorized = allCategories
    .map((cat) => ({
      category: cat,
      items: allArticles.filter((a) => a.category === cat),
    }))
    .filter((c) => c.items.length > 0);

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* ── Breaking ticker ── */}
      <BreakingTicker
        headlines={allArticles.slice(0, 6).map((a) => ({
          slug: a.slug,
          title: a.title,
        }))}
      />

      {/* ── Search bar strip ── */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 w-full max-w-[420px]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search news, topics, or authors..."
              className="flex-1 text-[13.5px] outline-none bg-transparent placeholder:text-gray-400"
            />
          </div>
          <span className="hidden md:block text-[12.5px] text-gray-400 whitespace-nowrap">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-6 py-8">
        {/* ── Category pills ── */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Link
            href="/"
            className={`text-[12.5px] font-medium px-4 py-1.5 rounded-full border transition-colors ${
              !activeCategory
                ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                : "border-gray-200 text-gray-500 hover:border-[#1E90FF] hover:text-[#1E90FF]"
            }`}
          >
            All
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${cat}`}
              className={`text-[12.5px] font-medium px-4 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                  : "border-gray-200 text-gray-500 hover:border-[#1E90FF] hover:text-[#1E90FF]"
              }`}
            >
              {formatCategory(cat)}
            </Link>
          ))}
        </div>

        {/* ── Active filter banner ── */}
        {activeCategory && (
          <div className="mb-6 flex items-center gap-3">
            <span className="text-[13.5px] text-gray-500">
              Showing{" "}
              <strong className="text-gray-800">
                {formatCategory(activeCategory)}
              </strong>{" "}
              — {articles.length} article{articles.length !== 1 ? "s" : ""}
            </span>
            <Link
              href="/"
              className="text-[12.5px] text-[#1E90FF] hover:underline"
            >
              Clear filter
            </Link>
          </div>
        )}

        {/* ── Empty state ── */}
        {articles.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-xl font-medium mb-3 text-gray-600">
              {activeCategory
                ? `No articles in "${formatCategory(activeCategory)}" yet`
                : "No articles yet"}
            </p>
            <Link
              href={activeCategory ? "/" : "/admin/articles/new"}
              className="text-[#1E90FF] hover:underline text-[14px]"
            >
              {activeCategory
                ? "Back to all articles"
                : "Create your first article"}
            </Link>
          </div>
        )}

        {/* ── Main 2-col layout: content + sticky sidebar ── */}
        {articles.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
            <div>
              {/* ── HERO ── */}
              {featured && (
                <section className="mb-12">
                  <div className="grid md:grid-cols-[1.7fr_1fr] gap-5">
                    <Link href={`/story/${featured.slug}`}>
                      <div className="group rounded-2xl overflow-hidden border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                        {featured.coverImage ? (
                          <img
                            src={featured.coverImage}
                            alt={featured.title}
                            className="w-full h-[300px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        ) : (
                          <ImagePlaceholder className="w-full h-[300px]" />
                        )}
                        <div className="p-7 bg-white">
                          <span
                            className="text-[11px] font-bold tracking-widest uppercase"
                            style={{
                              color:
                                categoryColors[featured.category] || "#1E90FF",
                            }}
                          >
                            {formatCategory(featured.category)}
                          </span>
                          <h1 className="text-[26px] font-bold leading-[1.2] tracking-tight text-gray-900 mt-2 mb-3 group-hover:text-[#1E90FF] transition-colors">
                            {featured.title}
                          </h1>
                          {featured.excerpt && (
                            <p className="text-[14.5px] text-gray-500 leading-relaxed mb-4 line-clamp-2">
                              {featured.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-[12.5px] text-gray-400">
                            <span className="font-medium text-gray-600">
                              {featured.author}
                            </span>
                            <span>·</span>
                            <span>
                              {featured.publishedAt
                                ? formatLongDate(featured.publishedAt)
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Hero side stack */}
                    <div className="flex flex-col gap-3">
                      {heroSide.map((article) => (
                        <Link key={article.id} href={`/story/${article.slug}`}>
                          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-shadow grid grid-cols-[92px_1fr]">
                            {article.coverImage ? (
                              <img
                                src={article.coverImage}
                                alt={article.title}
                                className="w-full h-full object-cover min-h-[92px]"
                              />
                            ) : (
                              <ImagePlaceholder className="min-h-[92px] w-full" />
                            )}
                            <div className="p-3 flex flex-col justify-between">
                              <div>
                                <span
                                  className="text-[9.5px] font-bold tracking-widest uppercase"
                                  style={{
                                    color:
                                      categoryColors[article.category] ||
                                      "#1E90FF",
                                  }}
                                >
                                  {formatCategory(article.category)}
                                </span>
                                <p className="text-[13px] font-semibold text-gray-800 leading-snug mt-1 line-clamp-3">
                                  {article.title}
                                </p>
                              </div>
                              <p className="text-[10.5px] text-gray-400 mt-1.5">
                                {article.publishedAt
                                  ? formatShortDate(article.publishedAt)
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ── TOP STORIES GRID ── */}
              {topStories.length > 0 && (
                <section className="mb-12">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[19px] font-bold text-gray-900 tracking-tight">
                      Top stories
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {topStories.map((article) => (
                      <Link key={article.id} href={`/story/${article.slug}`}>
                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden h-full flex flex-col group hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300">
                          {article.coverImage ? (
                            <img
                              src={article.coverImage}
                              alt={article.title}
                              className="w-full h-[150px] object-cover"
                            />
                          ) : (
                            <ImagePlaceholder className="h-[150px] w-full" />
                          )}
                          <div className="p-4 flex flex-col flex-1">
                            <span
                              className="text-[10px] font-bold tracking-widest uppercase mb-2"
                              style={{
                                color:
                                  categoryColors[article.category] || "#1E90FF",
                              }}
                            >
                              {formatCategory(article.category)}
                            </span>
                            <h3 className="text-[14.5px] font-bold text-gray-800 leading-snug mb-2 flex-1 group-hover:text-[#1E90FF] transition-colors">
                              {article.title}
                            </h3>
                            {article.excerpt && (
                              <p className="text-[12.5px] text-gray-500 leading-relaxed mb-3 line-clamp-2">
                                {article.excerpt}
                              </p>
                            )}
                            <div className="flex items-center justify-between text-[11.5px] text-gray-400 mt-auto pt-2 border-t border-gray-50">
                              <span>{article.author}</span>
                              <span>
                                {article.publishedAt
                                  ? formatShortDate(article.publishedAt)
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* ── LATEST NEWS (timeline) ── */}
              {latestNews.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-[19px] font-bold text-gray-900 tracking-tight mb-5">
                    Latest news
                  </h2>
                  <div className="relative pl-6 border-l-2 border-gray-100">
                    {latestNews.map((article) => (
                      <Link key={article.id} href={`/story/${article.slug}`}>
                        <div className="relative pb-6 last:pb-0 group">
                          <span
                            className="absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white"
                            style={{
                              background:
                                categoryColors[article.category] || "#1E90FF",
                            }}
                          />
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11.5px] font-semibold text-gray-400">
                              {article.publishedAt
                                ? new Date(
                                    article.publishedAt,
                                  ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })
                                : ""}
                            </span>
                            <span className="text-gray-200">·</span>
                            <span
                              className="text-[10.5px] font-bold tracking-widest uppercase"
                              style={{
                                color:
                                  categoryColors[article.category] || "#1E90FF",
                              }}
                            >
                              {formatCategory(article.category)}
                            </span>
                          </div>
                          <h3 className="text-[14.5px] font-semibold text-gray-800 leading-snug mb-1 group-hover:text-[#1E90FF] transition-colors">
                            {article.title}
                          </h3>
                          <span className="text-[12px] text-gray-400">
                            By {article.author}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* ── CATEGORY SECTIONS ── */}
              {!activeCategory &&
                categorized.map(({ category, items }) => (
                  <CategorySection
                    key={category}
                    category={category}
                    articles={items}
                  />
                ))}
            </div>

            {/* ── SIDEBAR ── */}
            <NewsSidebar
              trending={trending}
              mostRead={mostRead}
              editorsPicks={editorsPicks}
              activeCategory={activeCategory}
            />
          </div>
        )}
      </main>
    </div>
  );
}
