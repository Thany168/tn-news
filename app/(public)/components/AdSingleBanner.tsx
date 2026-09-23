"use client";

import { useEffect, useState } from "react";
import { getAds, imageUrl } from "@/lib/ads";
import { Ad, AdPosition } from "@/types/ads";

export function AdSingleBanner({
  position = "sidebar_top",
}: {
  position?: AdPosition;
}) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getAds().then((ads) => {
      if (!active) return;
      const filtered = ads.filter(
        (a) => a.is_active && a.position === position,
      );
      setAd(filtered[0] ?? ads[0] ?? null); // fallback to any ad if none match position
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [position]);

  if (loading) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl h-[150px] animate-pulse" />
    );
  }

  if (!ad) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center  text-gray-400">
        <span className="text-[10px] font-semibold tracking-widest uppercase mb-1">
          Advertisement
        </span>
      </div>
    );
  }

  // Adjust `ad.image` below if your Ad type uses a different field name
  const img = (
    <img
      src={imageUrl(ad.image)}
      alt={ad.title ?? "Contact to Advertisement"}
      className="w-[350px] h-[90px] object-cover rounded-2xl"
    />
  );

  return ad.target_url ? (
    <a
      href={ad.target_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      {img}
    </a>
  ) : (
    img
  );
}
