export function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-br from-[#1E3A5F] to-[#0f2138] flex items-center justify-center ${className}`}
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
