import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { deleteUser, adminResetPassword } from "@/lib/auth-store";

// DELETE /api/admin/users/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession(request);
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const result = deleteUser(params.id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

// PATCH /api/admin/users/:id  reset password (superadmin)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession(request);
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { newPassword } = await request.json();
  if (!newPassword) {
    return NextResponse.json(
      { error: "newPassword is required." },
      { status: 400 },
    );
  }

  const result = await adminResetPassword(params.id, newPassword);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
