// // app/api/admin/users/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { getSession } from "@/lib/session";
// import { getUsers, createUser } from "@/lib/auth-store";

// // GET /api/admin/users — list all users (superadmin only)
// export async function GET(request: NextRequest) {
//   const session = await getSession(request);
//   if (!session || session.role !== "superadmin") {
//     return NextResponse.json({ error: "Forbidden." }, { status: 403 });
//   }
//   return NextResponse.json(getUsers());
// }

// // POST /api/admin/users — create a new user (superadmin only)
// export async function POST(request: NextRequest) {
//   const session = await getSession(request);
//   if (!session || session.role !== "superadmin") {
//     return NextResponse.json({ error: "Forbidden." }, { status: 403 });
//   }

//   const { username, password, role } = await request.json();
//   if (!username || !password) {
//     return NextResponse.json(
//       { error: "Username and password are required." },
//       { status: 400 },
//     );
//   }

//   const result = await createUser(username, password, role ?? "editor");
//   if (!result.ok) {
//     return NextResponse.json({ error: result.error }, { status: 400 });
//   }
//   return NextResponse.json({ ok: true }, { status: 201 });
// }

import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function laravelHeaders() {
  return { "Content-Type": "application/json", Accept: "application/json" };
}

// GET /api/admin/users
export async function GET() {
  const res = await fetch(`${BASE}/api/admin-users`, {
    headers: laravelHeaders(),
    cache: "no-store",
  });
  const data = await res.json();

  // Map created_at → createdAt for frontend
  const users = Array.isArray(data)
    ? data.map((u: any) => ({ ...u, createdAt: u.created_at }))
    : [];

  return NextResponse.json(users);
}

// POST /api/admin/users — create user
export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${BASE}/api/admin-users`, {
    method: "POST",
    headers: laravelHeaders(),
    body: JSON.stringify({
      username: body.username,
      password: body.password,
      role: body.role ?? "editor",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    // Laravel validation errors come in data.errors or data.message
    const errorMsg =
      data?.errors?.username?.[0] ?? data?.message ?? "Failed to create user.";
    return NextResponse.json({ error: errorMsg }, { status: res.status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
