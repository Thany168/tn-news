"use client";
import { NavLink, NavSection, Divider } from "./sidebar-nav-link";
import { SidebarFooter } from "./sidebar-footer";
import Image from "next/image";
import logo from "../../../../public/logo.jpg";
import { LogoutButton } from "../../LogoutButton";
import type { SessionPayload } from "@/lib/session";

interface SidebarProps {
  session: SessionPayload | null;
  onClose?: () => void;
}

export function Sidebar({ session, onClose }: SidebarProps) {
  return (
    <aside className="w-60 h-full shrink-0 bg-gray-900 flex flex-col">
      {/* Mobile close button — hidden on desktop */}
      <div className="lg:hidden flex justify-end px-3 pt-3">
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-5">
        <div className="w-8 h-8 rounded-sm bg-blue-500 flex items-center justify-center shrink-0">
          <Image src={logo} alt="Logo" width={200} height={100} priority />
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-gray-50 leading-tight">
            TN News
          </span>
          <span className="text-[11px] text-gray-500 mt-px">Cambodia News</span>
        </div>
      </div>

      <Divider />

      <NavSection label="Main" />
      <nav className="flex flex-col gap-px">
        <NavLink href="/admin" icon="layout-dashboard">
          Dashboard
        </NavLink>
        <NavLink href="/admin/articles" icon="file-text">
          New Articles
        </NavLink>
        <NavLink href="/admin/media" icon="">
          Image
        </NavLink>
      </nav>

      <Divider />

      <NavSection label="Manage" />
      <nav className="flex flex-col gap-px">
        {session?.role === "superadmin" && (
          <NavLink href="/admin/users" icon="users">
            Users
          </NavLink>
        )}
      </nav>

      <SidebarFooter session={session} />
      <LogoutButton />
    </aside>
  );
}
