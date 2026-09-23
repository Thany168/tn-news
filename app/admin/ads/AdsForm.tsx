"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createAd, updateAd, imageUrl, POSITIONS } from "@/lib/ads";
import { Ad, AdPosition } from "@/types/ads";

interface Props {
  ad?: Ad; // if present = edit mode
}

export default function AdsForm({ ad }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!ad;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState<string>(ad ? imageUrl(ad.image) : "");

  const [form, setForm] = useState({
    title: ad?.title ?? "",
    target_url: ad?.target_url ?? "",
    position: ad?.position ?? ("header" as AdPosition),
    is_active: ad?.is_active ?? true,
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) return setError("Title is required.");
    if (!form.target_url.trim()) return setError("Target URL is required.");
    if (!isEdit && !fileRef.current?.files?.[0])
      return setError("Please select an image.");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("target_url", form.target_url);
    fd.append("position", form.position);
    fd.append("is_active", form.is_active ? "1" : "0");
    if (fileRef.current?.files?.[0]) {
      fd.append("image", fileRef.current.files[0]);
    }

    setSaving(true);
    const result = isEdit ? await updateAd(ad!.id, fd) : await createAd(fd);
    setSaving(false);

    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }

    setSuccess(isEdit ? "Ad updated!" : "Ad created!");
    setTimeout(() => {
      router.push("/admin/ads");
      router.refresh();
    }, 800);
  }

  const input =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-gray-400";
  const label =
    "block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5";

  return (
    <div className="max-w-[840px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          {isEdit ? "Edit Ad" : "New Ads"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {isEdit
            ? `Editing "${ad!.title}"`
            : "Create a new advertisement banner"}
        </p>
      </div>

      {/* Banners */}
      {error && (
        <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <span className="shrink-0 mt-0.5">⚠️</span>
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-300 hover:text-red-500 text-lg leading-none"
          >
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="mb-5 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700 flex items-center gap-2">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Title */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <label className={label}>Title *</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="e.g. Summer Sale Banner"
            className={input}
          />
        </div>

        {/* Image upload */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <label className={label}>Banner Image {!isEdit && "*"}</label>

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            className="relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-blue-300 transition-colors group"
            style={{ minHeight: 160 }}
          >
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-64 object-contain bg-gray-50"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Click to change image
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <span className="text-3xl mb-2">🖼️</span>
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs mt-1">JPEG, PNG, GIF, WebP — max 5MB</p>
              </div>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />

          {isEdit && (
            <p className="text-xs text-gray-400 mt-2">
              Leave empty to keep the current image.
            </p>
          )}
        </div>

        {/* Target URL */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <label className={label}>Target URL *</label>
          <input
            type="url"
            value={form.target_url}
            onChange={(e) => set("target_url", e.target.value)}
            placeholder="https://example.com/landing-page"
            className={input}
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Where users go when they click the ad.
          </p>
        </div>

        {/* Position */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <label className={label}>Position *</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {POSITIONS.map((pos) => (
              <button
                key={pos.value}
                type="button"
                onClick={() => set("position", pos.value as AdPosition)}
                className={`flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                  form.position === pos.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <span
                  className={`text-sm font-medium ${form.position === pos.value ? "text-blue-700" : "text-gray-700"}`}
                >
                  {pos.label}
                </span>
                <span className="text-xs text-gray-400">{pos.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <label className={label}>Status</label>
          <div
            className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors ${
              form.is_active
                ? "border-emerald-200 bg-emerald-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div>
              <p
                className={`text-sm font-medium ${form.is_active ? "text-emerald-700" : "text-gray-500"}`}
              >
                {form.is_active
                  ? " Active — showing to visitors"
                  : " Inactive — hidden from site"}
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => set("is_active", !form.is_active)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                  form.is_active ? "bg-emerald-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    form.is_active ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-xl transition-all disabled:opacity-60 shadow-sm"
          >
            {saving ? "Saving…" : isEdit ? "Update Ad" : "Create Ad"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/ads")}
            className="px-6 py-3 text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
