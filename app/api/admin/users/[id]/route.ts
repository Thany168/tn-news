// import { NextRequest, NextResponse } from "next/server";
// import { getSession } from "@/lib/session";
// import { deleteUser, adminResetPassword } from "@/lib/auth-store";

// // DELETE /api/admin/users/:id
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   const session = await getSession(request);
//   if (!session || session.role !== "superadmin") {
//     return NextResponse.json({ error: "Forbidden." }, { status: 403 });
//   }

//   const result = deleteUser(params.id);
//   if (!result.ok) {
//     return NextResponse.json({ error: result.error }, { status: 400 });
//   }
//   return NextResponse.json({ ok: true });
// }

// // PATCH /api/admin/users/:id  reset password (superadmin)
// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//   const session = await getSession(request);
//   if (!session || session.role !== "superadmin") {
//     return NextResponse.json({ error: "Forbidden." }, { status: 403 });
//   }

//   const { newPassword } = await request.json();
//   if (!newPassword) {
//     return NextResponse.json(
//       { error: "newPassword is required." },
//       { status: 400 },
//     );
//   }

//   const result = await adminResetPassword(params.id, newPassword);
//   if (!result.ok) {
//     return NextResponse.json({ error: result.error }, { status: 400 });
//   }
//   return NextResponse.json({ ok: true });
// }

import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function laravelHeaders() {
  return { "Content-Type": "application/json", Accept: "application/json" };
}

type Ctx = { params: { id: string } };

// DELETE /api/admin/users/:id
export async function DELETE(_: NextRequest, { params }: Ctx) {
  const res = await fetch(`${BASE}/api/admin-users/${params.id}`, {
    method: "DELETE",
    headers: laravelHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: data.message ?? "Failed to delete user." },
      { status: res.status },
    );
  }

  return NextResponse.json({ ok: true });
}

// PATCH /api/admin/users/:id — reset password
export async function PATCH(request: NextRequest, { params }: Ctx) {
  const { newPassword } = await request.json();

  if (!newPassword) {
    return NextResponse.json(
      { error: "newPassword is required." },
      { status: 400 },
    );
  }

  const res = await fetch(`${BASE}/api/admin-users/${params.id}`, {
    method: "PATCH",
    headers: laravelHeaders(),
    body: JSON.stringify({ password: newPassword }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      { error: data.message ?? "Failed to reset password." },
      { status: res.status },
    );
  }

  return NextResponse.json({ ok: true });
}
