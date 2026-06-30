"use client";

interface TickerProps {
  headlines: { slug: string; title: string }[];
}

export function BreakingTicker({ headlines }: TickerProps) {
  if (headlines.length === 0) return null;

  // Duplicate the list so the scroll loops seamlessly
  const loop = [...headlines, ...headlines];

  return (
    <div className="bg-[#1E3A5F] border-b border-black/10">
      <div className="max-w-[1280px] mx-auto flex items-stretch h-10">
        <div className="flex items-center gap-2 bg-[#1E90FF] px-4 shrink-0 z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="text-[11px] font-bold tracking-widest text-white uppercase">
            Breaking
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden flex items-center">
          <div className="flex items-center gap-10 whitespace-nowrap animate-[ticker_38s_linear_infinite] hover:[animation-play-state:paused]">
            {loop.map((item, i) => (
              <a
                key={`${item.slug}-${i}`}
                href={`/story/${item.slug}`}
                className="text-[13px] text-[#cfe3fb] hover:text-white transition-colors"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[ticker_38s_linear_infinite\\] { animation: none; }
        }
      `}</style>
    </div>
  );
}
