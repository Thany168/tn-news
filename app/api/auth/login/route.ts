import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/session";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 },
    );
  }

  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Incorrect username or password." },
      { status: 401 },
    );
  }

  const data = await res.json();

  // Create JWT session cookie — session.ts stays exactly the same
  const response = NextResponse.json({
    ok: true,
    role: data.user.role,
  });

  await createSession(
    {
      userId: String(data.user.id),
      username: data.user.username,
      role: data.user.role,
      token: data.token,
    },
    response,
  );
  return response;
}
