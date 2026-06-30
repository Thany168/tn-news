// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUsers, createUser } from "@/lib/auth-store";

// GET /api/admin/users — list all users (superadmin only)
export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  return NextResponse.json(getUsers());
}

// POST /api/admin/users — create a new user (superadmin only)
export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { username, password, role } = await request.json();
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  const result = await createUser(username, password, role ?? "editor");
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
