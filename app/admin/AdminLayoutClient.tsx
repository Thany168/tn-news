"use client";
import { useState } from "react";
import { Sidebar } from "./components/admin/sidebar";
import type { SessionPayload } from "@/lib/session";

interface Props {
  children: React.ReactNode;
  session: SessionPayload | null;
}

export default function AdminLayoutClient({ children, session }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Dark overlay — mobile only */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-30 transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0 lg:flex lg:shrink-0
        ${open ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <Sidebar session={session} onClose={() => setOpen(false)} />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar — hidden on desktop */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-800">
            TN News Admin
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gray-50 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
