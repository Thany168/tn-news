"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 mx-2 rounded-md text-[13px] transition-colors ${
        isActive
          ? "bg-blue-600 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
      }`}
    >
      <i className={`ti ti-${icon} text-base`} aria-hidden="true" />
      {children}
    </Link>
  );
}

export function NavSection({ label }: { label: string }) {
  return (
    <p className="px-5 mb-1.5 text-[10px] font-medium tracking-widest uppercase text-gray-600">
      {label}
    </p>
  );
}

export function Divider() {
  return <hr className="my-4 mx-5 border-t border-gray-800" />;
}
