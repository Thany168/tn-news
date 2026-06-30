import Link from "next/link";
import { allCategories, formatCategory } from "../../../lib/news-ui-helpers";
import { ImagePlaceholder } from "../components/Imageplaceholder ";

interface Article {
  id: string;
  slug: string;
  title: string;
  coverImage?: string;
  category: string;
}

interface SidebarProps {
  trending: Article[];
  mostRead: Article[];
  editorsPicks: Article[];
  activeCategory?: string;
}

function WidgetCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="text-[11px] font-bold tracking-[0.12em] text-[#1E90FF] uppercase mb-4 pb-2.5 border-b-2 border-[#1E90FF] inline-block">
        {title}
      </div>
      {children}
    </div>
  );
}

export function NewsSidebar({
  trending,
  mostRead,
  editorsPicks,
  activeCategory,
}: SidebarProps) {
  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-5 self-start">
      {/* Search */}
      <div className="lg:hidden bg-white border border-gray-100 rounded-2xl p-2 flex items-center gap-2 shadow-sm">
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
          placeholder="Search news..."
          className="flex-1 text-[13px] outline-none placeholder:text-gray-400"
        />
      </div>
      {/* Advertisement placeholder */}
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center py-10 text-gray-400">
        <span className="text-[10px] font-semibold tracking-widest uppercase mb-1">
          Advertisement
        </span>
        <span className="text-[12px]">728 × 90</span>
      </div>
      {/* Trending */}
      {trending.length > 0 && (
        <WidgetCard title="Trending now">
          <div className="flex flex-col divide-y divide-gray-50">
            {trending.slice(0, 5).map((article, i) => (
              <Link key={article.id} href={`/story/${article.slug}`}>
                <div className="flex items-center gap-3 py-3 group">
                  <span className="text-[22px] font-bold text-gray-200 leading-none min-w-[28px] group-hover:text-[#1E90FF]/30 transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <ImagePlaceholder className="w-12 h-12 rounded-lg shrink-0" />
                  )}
                  <p className="text-[13px] font-medium text-gray-700 leading-snug group-hover:text-[#1E90FF] transition-colors">
                    {article.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </WidgetCard>
      )}

      {/* Most read */}
      {mostRead.length > 0 && (
        <WidgetCard title="Most read">
          <div className="flex flex-col divide-y divide-gray-50">
            {mostRead.slice(0, 5).map((article, i) => (
              <Link key={article.id} href={`/story/${article.slug}`}>
                <div className="flex items-start gap-3 py-2.5 group">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-300 mt-0.5 shrink-0"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <p className="text-[13px] text-gray-600 leading-snug group-hover:text-[#1E90FF] transition-colors">
                    {article.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </WidgetCard>
      )}

      {/* Editor's picks */}
      {editorsPicks.length > 0 && (
        <WidgetCard title="Editor's picks">
          <div className="flex flex-col gap-3">
            {editorsPicks.slice(0, 3).map((article) => (
              <Link key={article.id} href={`/story/${article.slug}`}>
                <div className="grid grid-cols-[64px_1fr] gap-3 group">
                  {article.coverImage ? (
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <ImagePlaceholder className="w-16 h-16 rounded-lg" />
                  )}
                  <div className="flex flex-col justify-center">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-[#1E90FF] mb-1">
                      {formatCategory(article.category)}
                    </span>
                    <p className="text-[12.5px] font-medium text-gray-700 leading-snug group-hover:text-[#1E90FF] transition-colors">
                      {article.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </WidgetCard>
      )}

      {/* Popular topics */}
      <WidgetCard title="Popular topics">
        <div className="flex flex-wrap gap-2 mt-1">
          {allCategories.map((cat) => (
            <Link key={cat} href={`/?category=${cat}`}>
              <span
                className={`text-[12px] px-3 py-1.5 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? "bg-[#1E90FF] text-white border-[#1E90FF]"
                    : "border-gray-200 text-gray-500 hover:border-[#1E90FF] hover:text-[#1E90FF]"
                }`}
              >
                {formatCategory(cat)}
              </span>
            </Link>
          ))}
        </div>
      </WidgetCard>

      {/* Weather widget */}
      <div className="bg-gradient-to-br from-[#1E90FF] to-[#0C447C] rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[12px] font-medium text-white/80">
            Phnom Penh
          </span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-[34px] font-bold leading-none">32°</span>
          <span className="text-[12px] text-white/80 mb-1">Sunny</span>
        </div>
        <p className="text-[11px] text-white/70 mt-2">
          Updated just now · Feels like 36°
        </p>
      </div>

      {/* Newsletter */}
      <div className="bg-[#1E3A5F] rounded-2xl p-5">
        <p className="text-[14px] font-semibold text-white mb-1">
          Stay informed
        </p>
        <p className="text-[12px] text-[#90bef5] mb-4 leading-relaxed">
          Get the day&apos;s top Cambodia headlines delivered to your inbox
          every morning.
        </p>
        <input
          type="email"
          placeholder="your@email.com"
          className="w-full text-[13px] bg-white/10 border border-white/20 rounded-lg px-3 py-2.5 text-white placeholder:text-[#6a90bf] outline-none focus:border-[#1E90FF] transition-colors mb-2"
        />
        <button className="w-full bg-[#1E90FF] hover:bg-[#1a7de0] active:scale-[0.98] transition-all text-white text-[13px] font-semibold py-2.5 rounded-lg">
          Subscribe
        </button>
      </div>
    </aside>
  );
}
