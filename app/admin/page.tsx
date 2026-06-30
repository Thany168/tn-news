import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllArticles } from "@/lib/store";
import { getSession } from "@/lib/session";
import {
  FileText,
  CheckCircle,
  PenLine,
  TrendingUp,
  Laptop,
  Globe,
  HeartPulse,
  ArrowRight,
  Plus,
  Users,
  Sparkles,
} from "lucide-react";

const CATEGORY_META: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    className: string;
    dot: string;
  }
> = {
  business: {
    label: "Business",
    icon: <TrendingUp size={14} />,
    className: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-400",
  },
  technology: {
    label: "Technology",
    icon: <Laptop size={14} />,
    className: "bg-blue-50 text-blue-600",
    dot: "bg-blue-400",
  },
  world: {
    label: "World",
    icon: <Globe size={14} />,
    className: "bg-amber-50 text-amber-600",
    dot: "bg-amber-400",
  },
  health: {
    label: "Health",
    icon: <HeartPulse size={14} />,
    className: "bg-red-50 text-red-500",
    dot: "bg-red-400",
  },
};

export default async function AdminDashboard() {
  // Final safety net — middleware already blocks editors, but a server-side
  // check here means this page is never wrong even if rendered directly.
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    redirect("/admin/articles");
  }

  const articles = await getAllArticles();
  const published = articles.filter((a) => a.published);
  const drafts = articles.filter((a) => !a.published);
  const pubRate = articles.length
    ? Math.round((published.length / articles.length) * 100)
    : 0;

  const catCount = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category] = (acc[a.category] || 0) + 1;
    return acc;
  }, {});

  const sortedCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(...Object.values(catCount), 1);

  const authorCounts = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.author] = (acc[a.author] || 0) + 1;
    return acc;
  }, {});
  const topAuthor =
    Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  // Published this week — gives the "+3 today" style stat real meaning
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const publishedToday = published.filter(
    (a) => new Date(a.updatedAt ?? a.createdAt).getTime() >= oneDayAgo,
  ).length;
  const publishedThisWeek = published.filter(
    (a) => new Date(a.updatedAt ?? a.createdAt).getTime() >= oneWeekAgo,
  ).length;

  const lastPublished = published
    .map((a) => new Date(a.updatedAt ?? a.createdAt))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="p-8 max-w-[1080px]">
      {/* Masthead */}
      <div className="flex items-start justify-between pb-6 mb-8 border-b border-gray-100">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-blue-500 mb-1.5 flex items-center gap-1.5">
            <Sparkles size={11} />
            TN News &mdash; CMS
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Newsroom dashboard
          </h1>
          <p className="text-[13px] text-gray-400 mt-1">
            {today} · Welcome back, {session.username}
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-all shadow-sm"
        >
          <Plus size={15} /> New article
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={<FileText size={15} />}
          iconClass="bg-blue-50 text-blue-600"
          label="Total articles"
          value={articles.length}
          trend={publishedToday > 0 ? `+${publishedToday} today` : undefined}
        />
        <StatCard
          icon={<CheckCircle size={15} />}
          iconClass="bg-emerald-50 text-emerald-600"
          label="Published"
          value={published.length}
          trend={`${pubRate}%`}
        />
        <StatCard
          icon={<PenLine size={15} />}
          iconClass="bg-amber-50 text-amber-600"
          label="Drafts"
          value={drafts.length}
        />
        <StatCard
          icon={<Users size={15} />}
          iconClass="bg-violet-50 text-violet-600"
          label="This week"
          value={publishedThisWeek}
          trend="published"
        />
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Article list */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />
              Latest articles
            </h2>
            <Link
              href="/admin/articles"
              className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
            {articles.slice(0, 8).map((a, i, arr) => (
              <Link
                key={a.id}
                href={`/admin/articles/${a.id}/edit`}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  i < arr.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                    a.published
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {a.published ? "Live" : "Draft"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 truncate">{a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                    <span>
                      {CATEGORY_META[a.category]?.label ?? a.category}
                    </span>
                    <span>·</span>
                    <span>{a.author}</span>
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {new Date(a.updatedAt ?? a.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" },
                  )}
                </span>
              </Link>
            ))}

            {articles.length === 0 && (
              <div className="py-14 text-center">
                <FileText className="mx-auto mb-3 text-gray-300" size={32} />
                <p className="text-sm text-gray-400 mb-3">No articles yet</p>
                <Link
                  href="/admin/articles/new"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Create your first article
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Categories */}
          <div>
            <h2 className="text-sm font-medium text-gray-900 mb-3">
              By category
            </h2>
            <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
              {sortedCats.map(([cat, count]) => {
                const meta = CATEGORY_META[cat];
                const pct = Math.round((count / maxCat) * 100);
                return (
                  <div
                    key={cat}
                    className="flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-100 last:border-0"
                  >
                    <div
                      className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                        meta?.className ?? "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {meta?.icon}
                    </div>
                    <span className="text-sm text-gray-600 flex-1 capitalize">
                      {meta?.label ?? cat}
                    </span>
                    <div className="w-14 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-1 rounded-full ${meta?.dot ?? "bg-gray-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 w-4 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
              {sortedCats.length === 0 && (
                <p className="p-6 text-center text-sm text-gray-400">
                  No data yet
                </p>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div>
            <h2 className="text-sm font-medium text-gray-900 mb-3">
              Quick stats
            </h2>
            <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
              <div className="divide-y divide-gray-100">
                <div className="flex justify-between items-center px-4 py-2.5 text-sm">
                  <span className="text-gray-400">Top category</span>
                  <span className="font-medium text-gray-700">
                    {sortedCats[0]
                      ? (CATEGORY_META[sortedCats[0][0]]?.label ??
                        sortedCats[0][0])
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 text-sm">
                  <span className="text-gray-400">Top author</span>
                  <span className="font-medium text-gray-700">{topAuthor}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 text-sm">
                  <span className="text-gray-400">Last published</span>
                  <span className="font-medium text-gray-700">
                    {lastPublished
                      ? lastPublished.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Publication rate bar */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span className="uppercase tracking-wider">
                    Publication rate
                  </span>
                  <span className="font-medium text-gray-600">{pubRate}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-blue-500 rounded-full transition-all"
                    style={{ width: `${pubRate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {published.length} of {articles.length} published
                </p>
              </div>
            </div>
          </div>

          {/* Manage users — superadmin shortcut */}
          <Link
            href="/admin/users"
            className="flex items-center justify-between border border-gray-100 rounded-xl bg-white px-4 py-3 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users size={14} />
              </div>
              <span className="text-sm text-gray-700">Manage users</span>
            </div>
            <ArrowRight
              size={14}
              className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  iconClass,
  label,
  value,
  trend,
}: {
  icon: React.ReactNode;
  iconClass: string;
  label: string;
  value: number;
  trend?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconClass}`}
        >
          {icon}
        </div>
        {trend && (
          <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-medium text-gray-900 leading-none">
          {value}
        </p>
        <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}
