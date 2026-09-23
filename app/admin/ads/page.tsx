import Link from "next/link";
import { getAds, imageUrl, deleteAd, toggleAd, POSITIONS } from "@/lib/ads";
import AdsActions from "./AdsActions";

export const dynamic = "force-dynamic";

const positionBadge: Record<string, string> = {
  header: "bg-blue-50 text-blue-700",
  sidebar_top: "bg-violet-50 text-violet-700",
  sidebar_bottom: "bg-amber-50 text-amber-700",
  footer: "bg-gray-100 text-gray-600",
};

export default async function AdsPage() {
  const ads = await getAds();

  const byPosition = POSITIONS.map((p) => ({
    ...p,
    ads: ads.filter((a) => a.position === p.value),
  }));

  return (
    <div className="max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Advertisements
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {ads.length} ad{ads.length !== 1 ? "s" : ""} · manage banners across
            your site
          </p>
        </div>
        <Link
          href="/admin/ads/create"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <span className="text-lg leading-none">+</span>
          New Ads
        </Link>
      </div>

      {/* Empty state */}
      {ads.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl py-20 text-center">
          <p className="text-gray-400 font-medium mb-3">No ads yet</p>
          <Link
            href="/admin/ads/create"
            className="text-sm text-blue-600 hover:underline"
          >
            Create your first ads +
          </Link>
        </div>
      )}

      {/* Ads grouped by position */}
      {ads.length > 0 && (
        <div className="flex flex-col gap-8 w-100 ">
          {byPosition
            .filter((p) => p.ads.length > 0)
            .map((group) => (
              <div key={group.value}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${positionBadge[group.value]}`}
                  >
                    {group.label}
                  </span>
                  <span className="text-xs text-gray-400">{group.desc}</span>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm overflow overflow-x-auto">
                  {/* Table header */}
                  <div className="grid grid-cols-[80px_1fr_160px_100px_120px] px-5 py-3 bg-gray-50 border-b border-gray-100 text-[11px] font-semibold uppercase tracking-wider text-gray-400   ">
                    <div>Image</div>
                    <div>Title / URL</div>
                    <div>Position</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>

                  {group.ads.map((ad, i) => (
                    <div
                      key={ad.id}
                      className={`grid grid-cols-[80px_1fr_160px_100px_120px] px-5 py-4 items-center gap-3  ${
                        i < group.ads.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      {/* Image */}
                      <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {ad.image ? (
                          <img
                            src={imageUrl(ad.image)}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                            No img
                          </div>
                        )}
                      </div>

                      {/* Title + URL */}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">
                          {ad.title}
                        </p>
                        <a
                          href={ad.target_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          <span className="hidden sm:inline text-xs">
                            {ad.target_url.length > 30
                              ? `${ad.target_url.slice(0, 30)}...`
                              : ad.target_url}
                          </span>
                        </a>
                      </div>

                      {/* Position */}
                      <span
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-full w-fit ${positionBadge[ad.position]}`}
                      >
                        {POSITIONS.find((p) => p.value === ad.position)?.label}
                      </span>

                      {/* Status */}
                      <div>
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                            ad.is_active
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {ad.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>

                      {/* Actions */}
                      <AdsActions ad={ad} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
