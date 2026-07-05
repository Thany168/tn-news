"use client";
import { useState, useEffect, useRef } from "react";
import { FaRegImage } from "react-icons/fa6";
import { MdOutlineTipsAndUpdates, MdDelete } from "react-icons/md";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

interface MediaItem {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size: number;
  created_at: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    setLoading(true);
    const res = await fetch(`${BASE}/api/media`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) setMedia(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }
    setError("");
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${BASE}/api/media/upload`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    setUploading(false);
    if (res.ok) {
      const item = await res.json();
      setMedia((prev) => [item, ...prev]);
    } else {
      const err = await res.json().catch(() => ({}));
      setError(err.message ?? "Upload failed.");
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Delete "${item.original_name}"?`)) return;
    const res = await fetch(`${BASE}/api/media/${item.id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    if (res.ok) setMedia((prev) => prev.filter((m) => m.id !== item.id));
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(item.url);
    setCopied(item.id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div style={{ padding: "2rem 2.5rem", maxWidth: 1100 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            Media Library
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            {media.length} image{media.length !== 1 ? "s" : ""} · Upload then
            copy URL into your article
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          style={{
            background: "var(--accent)",
            color: "white",
            padding: "9px 18px",
            borderRadius: "var(--radius)",
            fontSize: 14,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          + Upload Image
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: "10px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "var(--radius)",
            fontSize: 13,
            color: "#dc2626",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#dc2626",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border-strong)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          textAlign: "center",
          marginBottom: "1.5rem",
          cursor: "pointer",
          background: dragOver ? "var(--accent-bg)" : "var(--surface)",
          transition: "all 0.15s",
        }}
      >
        {uploading ? (
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
            Uploading...
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 28, marginBottom: 8 }}>
              <FaRegImage />
            </div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: "var(--text-secondary)",
                marginBottom: 4,
              }}
            >
              Drag & drop an image here, or click to browse
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              JPEG, PNG, GIF, WebP — max 5MB
            </p>
          </div>
        )}
      </div>

      {/* How to use tip */}
      <div
        style={{
          background: "var(--accent-bg)",
          border: "1px solid var(--accent-border)",
          borderRadius: "var(--radius)",
          padding: "10px 14px",
          fontSize: 13,
          color: "var(--accent-dark)",
          marginBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span>
          <MdOutlineTipsAndUpdates />
        </span>
        <span>
          Upload an image → click <strong>Copy URL</strong> → paste into the{" "}
          <strong>Cover Image URL</strong> field in article form
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--text-muted)",
          }}
        >
          Loading...
        </div>
      ) : media.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            color: "var(--text-muted)",
          }}
        >
          <p style={{ fontSize: 40, marginBottom: 12 }}>
            <FaRegImage />
          </p>
          <p>No images yet. Upload one above.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {media.map((item) => (
            <div
              key={item.id}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Image preview */}
              <div
                style={{
                  height: 150,
                  background: "var(--surface-2)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.url}
                  alt={item.original_name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ padding: "10px 12px" }}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: 2,
                  }}
                >
                  {item.original_name}
                </p>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginBottom: 10,
                  }}
                >
                  {formatSize(item.size)} ·{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => copyUrl(item)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      fontSize: 12,
                      fontWeight: 600,
                      background:
                        copied === item.id
                          ? "var(--success-bg)"
                          : "var(--accent)",
                      color: copied === item.id ? "var(--success)" : "white",
                      border: copied === item.id ? "1px solid #a3d9bb" : "none",
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {copied === item.id ? " Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    style={{
                      padding: "6px 10px",
                      fontSize: 12,
                      background: "transparent",
                      border: "1px solid #fecaca",
                      borderRadius: "var(--radius)",
                      cursor: "pointer",
                      color: "#dc2626",
                    }}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
