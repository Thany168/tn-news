import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearSession(response);
  // Clear the admin cookie
  // response.cookies.set("admin_token", "", {
  //   httpOnly: true,
  //   maxAge: 0,
  //   path: "/",
  // });

  return response;
}
