// // import { NextRequest, NextResponse } from "next/server";

// // export async function POST(request: NextRequest) {
// //   const { password } = await request.json();

// //   const adminSecret = process.env.ADMIN_SECRET;

// //   if (!adminSecret) {
// //     return NextResponse.json(
// //       { error: "Server misconfiguration: ADMIN_SECRET not set." },
// //       { status: 500 },
// //     );
// //   }

// //   if (password !== adminSecret) {
// //     return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
// //   }

// //   const response = NextResponse.json({ ok: true });

// //   // Set secure httpOnly cookie — valid for 7 days
// //   response.cookies.set("admin_token", adminSecret, {
// //     httpOnly: true,
// //     secure: process.env.NODE_ENV === "production",
// //     sameSite: "lax",
// //     maxAge: 60 * 60 * 24 * 7, // 7 days
// //     path: "/",
// //   });

// //   return response;
// // }

// // app/api/auth/login/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { verifyUser, seedDefaultAdmin } from "@/lib/auth-store";
// import { createSession } from "@/lib/session";

// export async function POST(request: NextRequest) {
//   await seedDefaultAdmin(); // no-op if users already exist

//   const { username, password } = await request.json();

//   if (!username || !password) {
//     return NextResponse.json(
//       { error: "Username and password are required." },
//       { status: 400 },
//     );
//   }

//   const user = await verifyUser(username, password);

//   if (!user) {
//     return NextResponse.json(
//       { error: "Incorrect username or password." },
//       { status: 401 },
//     );
//   }

//   const response = NextResponse.json({ ok: true, role: user.role });
//   await createSession(
//     { userId: user.id, username: user.username, role: user.role },
//     response,
//   );
//   return response;
// }

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

  const user = await res.json();

  // Create JWT session cookie — session.ts stays exactly the same
  const response = NextResponse.json({ ok: true, role: user.role });
  await createSession(
    {
      userId: String(user.id),
      username: user.username,
      role: user.role,
    },
    response,
  );
  return response;
}
