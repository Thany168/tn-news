import Link from "next/link";
import {
  categoryColors,
  formatCategory,
  formatShortDate,
} from "../../../lib/news-ui-helpers";
import { ImagePlaceholder } from "./Imageplaceholder ";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  coverImage?: string;
  category: string;
  author: string;
  publishedAt?: string | Date;
}

interface CategorySectionProps {
  category: string;
  articles: Article[];
}

export function CategorySection({ category, articles }: CategorySectionProps) {
  if (articles.length === 0) return null;

  const [lead, ...rest] = articles;
  const supporting = rest.slice(0, 4);
  const color = categoryColors[category] || "#1E90FF";

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: color }}
          />
          <h2 className="text-[19px] font-bold text-gray-900 tracking-tight">
            {formatCategory(category)}
          </h2>
        </div>
        <Link
          href={`/?category=${category}`}
          className="text-[12.5px] font-medium text-[#1E90FF] hover:underline flex items-center gap-1"
        >
          View more
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </Link>
      </div>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-6">
        {/* Lead article */}
        <Link href={`/story/${lead.slug}`}>
          <div className="group">
            <div className="rounded-2xl overflow-hidden mb-4">
              {lead.coverImage ? (
                <img
                  src={lead.coverImage}
                  alt={lead.title}
                  className="w-full h-[220px] object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              ) : (
                <ImagePlaceholder className="w-full h-[220px]" />
              )}
            </div>
            <h3 className="text-[19px] font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#1E90FF] transition-colors">
              {lead.title}
            </h3>
            {lead.excerpt && (
              <p className="text-[14px] text-gray-500 leading-relaxed mb-3 line-clamp-2">
                {lead.excerpt}
              </p>
            )}
            <div className="flex items-center gap-2 text-[12px] text-gray-400">
              <span>{lead.author}</span>
              <span>·</span>
              <span>
                {lead.publishedAt ? formatShortDate(lead.publishedAt) : ""}
              </span>
            </div>
          </div>
        </Link>

        {/* Supporting articles */}
        <div className="flex flex-col divide-y divide-gray-100">
          {supporting.map((article) => (
            <Link key={article.id} href={`/story/${article.slug}`}>
              <div className="grid grid-cols-[84px_1fr] gap-3 py-3.5 first:pt-0 group">
                {article.coverImage ? (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-[84px] h-[64px] object-cover rounded-lg"
                  />
                ) : (
                  <ImagePlaceholder className="w-[84px] h-[64px] rounded-lg" />
                )}
                <div className="flex flex-col justify-center min-w-0">
                  <h4 className="text-[13.5px] font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#1E90FF] transition-colors">
                    {article.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 mt-1">
                    {article.publishedAt
                      ? formatShortDate(article.publishedAt)
                      : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
