import { Ad } from "@/types/ads";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function jsonHeaders() {
  return { Accept: "application/json" };
}

//  READ

export async function getAds(): Promise<Ad[]> {
  const res = await fetch(`${BASE}/api/ads`, {
    headers: jsonHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? json;
}

export async function getAd(id: number): Promise<Ad | null> {
  const res = await fetch(`${BASE}/api/ads/${id}`, {
    headers: jsonHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? json;
}

//  WRITE

export async function createAd(
  formData: FormData,
): Promise<{ ok: boolean; error?: string; data?: Ad }> {
  const res = await fetch(`${BASE}/api/ads`, {
    method: "POST",
    headers: jsonHeaders(), // no Content-Type — browser sets multipart boundary
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) {
    const msg =
      json?.message ??
      (Object.values(json?.errors ?? {}) as string[][])?.[0]?.[0];
    return { ok: false, error: String(msg) };
  }
  return { ok: true, data: json.data ?? json };
}

export async function updateAd(
  id: number,
  formData: FormData,
): Promise<{ ok: boolean; error?: string; data?: Ad }> {
  // Laravel doesn't support multipart PUT — use POST with _method spoofing
  formData.append("_method", "PUT");
  const res = await fetch(`${BASE}/api/ads/${id}`, {
    method: "POST",
    headers: jsonHeaders(),
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) {
    const msg =
      json?.message ??
      (Object.values(json?.errors ?? {}) as string[][])?.[0]?.[0];
    return { ok: false, error: String(msg) };
  }
  return { ok: true, data: json.data ?? json };
}

export async function deleteAd(id: number): Promise<boolean> {
  const res = await fetch(`${BASE}/api/ads/${id}`, {
    method: "DELETE",
    headers: jsonHeaders(),
  });
  return res.ok;
}

export async function toggleAd(
  id: number,
  is_active: boolean,
): Promise<boolean> {
  const fd = new FormData();
  fd.append("is_active", is_active ? "1" : "0");
  fd.append("_method", "PUT");
  const res = await fetch(`${BASE}/api/ads/${id}`, {
    method: "POST",
    headers: jsonHeaders(),
    body: fd,
  });
  return res.ok;
}

// ── HELPERS

export function imageUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/storage/${path}`;
}

export const POSITIONS = [
  { value: "header", label: "Header", desc: "Top of every page" },
  { value: "sidebar_top", label: "Sidebar Top", desc: "Above sidebar content" },
  {
    value: "sidebar_bottom",
    label: "Sidebar Bottom",
    desc: "Below sidebar content",
  },
  { value: "footer", label: "Footer", desc: "Bottom of every page" },
] as const;
