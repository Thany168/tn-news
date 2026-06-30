"use client";
// app/login/page.tsx

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push(from);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Login failed.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-[32px] font-semibold tracking-tight text-[#1E3A5F]">
            Login Form
          </span>
          <p className="text-[13px] text-gray-400 mt-2">Admin portal</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h1 className="text-[18px] font-semibold text-gray-800 mb-1">
            Sign in
          </h1>
          <p className="text-[13px] text-gray-400 mb-6">
            Enter your credentials to access the admin panel.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-[12px] font-medium text-gray-600 mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                autoFocus
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-gray-800 outline-none focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/10 transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-[12px] font-medium text-gray-600 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[14px] text-gray-800 outline-none focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/10 transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-[#1E90FF] hover:bg-[#1a7de0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white text-[14px] font-medium py-2.5 rounded-lg mt-1"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-gray-400 mt-5">
          <a href="/" className="hover:text-[#1E90FF] transition-colors">
            Back to TN News
          </a>
        </p>
      </div>
    </div>
  );
}
