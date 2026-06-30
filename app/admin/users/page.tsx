"use client";
// app/admin/users/page.tsx
// Only superadmins can see page ng

import { useState, useEffect, FormEvent } from "react";
// import { authOptions } from "@/lib/auth";
interface User {
  id: string;
  username: string;
  role: "superadmin" | "editor";
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"editor" | "superadmin">("editor");
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [creating, setCreating] = useState(false);

  // Reset password modal state
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetting, setResetting] = useState(false);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setCreating(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
        role: newRole,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setCreateSuccess(`User "${newUsername}" created.`);
      setNewUsername("");
      setNewPassword("");
      setNewRole("editor");
      fetchUsers();
    } else {
      setCreateError(data.error);
    }
    setCreating(false);
  }

  async function handleDelete(user: User) {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`))
      return;
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) fetchUsers();
    else alert(data.error);
  }

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    if (!resetTarget) return;
    setResetError("");
    setResetting(true);
    const res = await fetch(`/api/admin/users/${resetTarget.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: resetPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setResetTarget(null);
      setResetPassword("");
    } else {
      setResetError(data.error);
    }
    setResetting(false);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-semibold text-gray-800 mb-1">
        User management
      </h1>
      <p className="text-[13px] text-gray-400 mb-8">
        Create and manage admin accounts. Only superadmins can access this page.
      </p>

      {/* ── Create user ── */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
        <h2 className="text-[15px] font-semibold text-gray-700 mb-4">
          Create new user
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="e.g. reporter1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-gray-500 mb-1.5">
              Role
            </label>
            <select
              value={newRole}
              onChange={(e) =>
                setNewRole(e.target.value as "editor" | "superadmin")
              }
              className="border border-gray-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#1E90FF] bg-white"
            >
              <option value="editor">Editor — can create/edit articles</option>
              <option value="superadmin">
                Superadmin — full access + manage users
              </option>
            </select>
          </div>

          {createError && (
            <p className="text-[13px] text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {createError}
            </p>
          )}
          {createSuccess && (
            <p className="text-[13px] text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              ✓ {createSuccess}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={creating}
              className="bg-[#1E90FF] hover:bg-[#1a7de0] disabled:opacity-50 transition-colors text-white text-[13px] font-medium px-5 py-2 rounded-lg"
            >
              {creating ? "Creating…" : "Create user"}
            </button>
          </div>
        </form>
      </div>

      {/*  User list  */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-[15px] font-semibold text-gray-700">All users</h2>
        </div>

        {loading ? (
          <div className="px-6 py-8 text-[13px] text-gray-400">Loading…</div>
        ) : users.length === 0 ? (
          <div className="px-6 py-8 text-[13px] text-gray-400">
            No users yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-gray-800">
                      {user.username}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        user.role === "superadmin"
                          ? "bg-[#1E90FF]/10 text-[#1E90FF]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Created{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setResetTarget(user);
                      setResetPassword("");
                      setResetError("");
                    }}
                    className="text-[12px] text-gray-400 hover:text-[#1E90FF] border border-gray-200 hover:border-[#1E90FF] px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Reset password
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="text-[12px] text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/*  Reset password modal  */}
      {resetTarget && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-[16px] font-semibold text-gray-800 mb-1">
              Reset password
            </h3>
            <p className="text-[13px] text-gray-400 mb-4">
              Set a new password for <strong>{resetTarget.username}</strong>.
            </p>
            <form
              onSubmit={handleResetPassword}
              className="flex flex-col gap-3"
            >
              <input
                type="password"
                required
                autoFocus
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="New password (min. 6 chars)"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#1E90FF] focus:ring-2 focus:ring-[#1E90FF]/10 transition-all"
              />
              {resetError && (
                <p className="text-[12px] text-red-500">{resetError}</p>
              )}
              <div className="flex gap-2 mt-1">
                <button
                  type="submit"
                  disabled={resetting}
                  className="flex-1 bg-[#1E90FF] hover:bg-[#1a7de0] disabled:opacity-50 text-white text-[13px] font-medium py-2 rounded-lg transition-colors"
                >
                  {resetting ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setResetTarget(null)}
                  className="flex-1 border border-gray-200 text-[13px] text-gray-500 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
