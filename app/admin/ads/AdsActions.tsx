"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteAd, toggleAd } from "@/lib/ads";
import { Ad } from "@/types/ads";

export default function AdsActions({ ad }: { ad: Ad }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await toggleAd(ad.id, !ad.is_active);
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${ad.title}"? This cannot be undone.`)) return;
    setLoading(true);
    await deleteAd(ad.id);
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Toggle active */}
      <button
        onClick={handleToggle}
        disabled={loading}
        title={ad.is_active ? "Deactivate" : "Activate"}
        className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors disabled:opacity-50 ${
          ad.is_active
            ? "border-amber-200 text-amber-600 hover:bg-amber-50"
            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
        }`}
      >
        {ad.is_active ? "Pause" : "Run"}
      </button>

      {/* Edit */}
      <Link
        href={`/admin/ads/${ad.id}/edit`}
        className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 font-medium transition-colors"
      >
        Edit
      </Link>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-xs px-2.5 py-1.5 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 font-medium transition-colors disabled:opacity-50"
      >
        Del
      </button>
    </div>
  );
}
