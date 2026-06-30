import type { SessionPayload } from "@/lib/session";

interface SidebarFooterProps {
  session: SessionPayload | null;
}

function getInitials(name: string) {
  return name
    .split(/[\s_]+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRole(role?: string) {
  if (!role) return "";
  return role === "superadmin" ? "Super Admin" : "Editor";
}

export function SidebarFooter({ session }: SidebarFooterProps) {
  const username = session?.username ?? "Guest";
  const role = formatRole(session?.role);
  const initials = getInitials(username);

  return (
    <div className="mt-auto border-t border-gray-800 p-2">
      <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer">
        <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-[11px] font-medium text-gray-400 shrink-0">
          {initials}
        </div>
        <div className="flex flex-col items-start min-w-0 flex-1">
          <span className="text-[12px] font-medium text-gray-100 truncate w-full text-left">
            {username}
          </span>
          <span className="text-[11px] text-gray-500">{role}</span>
        </div>
        <i className="ti ti-dots text-base text-gray-600" aria-hidden="true" />
      </button>
    </div>
  );
}
