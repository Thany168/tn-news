import Link from "next/link";

const categoryColors: Record<string, string> = {
  business: "#1E90FF",
  technology: "#0C447C",
  politics: "#993556",
  press_release: "#534AB7",
  sports: "#0F6E56",
  entertainment: "#854F0B",
  lifestyle: "#3B6D11",
};

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`bg-[#1E3A5F] flex items-center justify-center ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3d6b9c"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

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

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/story/${article.slug}`}>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-gray-200 transition-all h-full flex flex-col group">
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-[140px] object-cover group-hover:opacity-95 transition-opacity"
          />
        ) : (
          <ImagePlaceholder className="h-[140px] w-full" />
        )}
        <div className="p-4 flex flex-col flex-1">
          <span
            className="text-[10px] font-semibold tracking-widest uppercase mb-2"
            style={{
              color: categoryColors[article.category] || "#1E90FF",
            }}
          >
            {article.category.replace("_", " ")}
          </span>
          <h3 className="text-[14px] font-semibold text-gray-800 leading-snug mb-2 flex-1">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-[12px] text-gray-500 leading-relaxed mb-3 line-clamp-2">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-auto pt-2 border-t border-gray-50">
            <span>{article.author}</span>
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
