import { NavLink, NavSection, Divider } from "./sidebar-nav-link";
import { SidebarFooter } from "./sidebar-footer";
import Image from "next/image";
import logo from "../../../../public/logo.jpg";
import { LogoutButton } from "../../LogoutButton";
// import Link from "next/link";
import type { SessionPayload } from "@/lib/session";
interface SidebarProps {
  session: SessionPayload | null;
}
export function Sidebar({ session }: SidebarProps) {
  return (
    <aside className="w-60 shrink-0 bg-gray-900 flex flex-col">
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
        {/* <NavLink href="/admin/authors" icon="users">
          Authors
        </NavLink> */}
        {/* <NavLink href="/admin/categories" icon="tag">
          Categories
        </NavLink> */}
        {session?.role === "superadmin" && (
          <NavLink href="/admin/users" icon="users">
            Users
          </NavLink>
        )}
        {/* <NavLink href="/admin/settings" icon="settings">
          Settings
        </NavLink> */}
      </nav>

      <SidebarFooter session={session} />
      <LogoutButton />
    </aside>
  );
}
