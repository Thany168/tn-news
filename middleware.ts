// middleware.ts (project root)
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const session = await getSession(request);

    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Editors cannot see the dashboard root — send them to Articles instead.
    const isExactDashboardRoot =
      pathname === "/admin" || pathname === "/admin/";
    if (isExactDashboardRoot && session.role !== "superadmin") {
      return NextResponse.redirect(new URL("/admin/articles", request.url));
    }

    // Editors also cannot access user management.
    if (pathname.startsWith("/admin/users") && session.role !== "superadmin") {
      return NextResponse.redirect(new URL("/admin/articles", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
