import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function laravelHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET /api/admin/users
export async function GET(request: NextRequest) {
  const session = await getSession(request);

  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const res = await fetch(`${BASE}/api/admin-users`, {
    headers: laravelHeaders(session.token),
    cache: "no-store",
  });

  const data = await res.json();

  const users = Array.isArray(data)
    ? data.map((u: any) => ({ ...u, createdAt: u.created_at }))
    : [];

  return NextResponse.json(users);
}

// POST /api/admin/users — create user
export async function POST(request: NextRequest) {
  const session = await getSession(request);

  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await request.json();

  const res = await fetch(`${BASE}/api/admin-users`, {
    method: "POST",
    headers: laravelHeaders(session.token),
    body: JSON.stringify({
      username: body.username,
      password: body.password,
      role: body.role ?? "editor",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg =
      data?.errors?.username?.[0] ?? data?.message ?? "Failed to create user.";

    return NextResponse.json({ error: errorMsg }, { status: res.status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
