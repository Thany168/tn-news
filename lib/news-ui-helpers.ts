// lib/news-ui-helpers.ts
// Shared helpers for the dashboard UI — purely presentational, no data logic.

export const categoryColors: Record<string, string> = {
  business: "#1E90FF",
  technology: "#0C447C",
  politics: "#993556",
  press_release: "#534AB7",
  sports: "#0F6E56",
  entertainment: "#854F0B",
  lifestyle: "#3B6D11",
};

export const allCategories = [
  "politics",
  "business",
  "technology",
  "sports",
  "entertainment",
  "lifestyle",
];

export function formatCategory(cat: string) {
  return cat.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatLongDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: string | Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
