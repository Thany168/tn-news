// lib/session.ts
// Signs a small JWT and stores it in an httpOnly cookie.
// No external auth library needed — just jose (already in Next.js).

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var is not set.");
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  username: string;
  role: "superadmin" | "editor";
}

//  sign

export async function createSession(
  payload: SessionPayload,
  response: NextResponse,
) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

//  verify (server components / middleware)

export async function getSession(
  req?: NextRequest,
): Promise<SessionPayload | null> {
  try {
    let token: string | undefined;

    if (req) {
      // middleware context
      token = req.cookies.get(COOKIE_NAME)?.value;
    } else {
      // server component context
      token = (await cookies()).get(COOKIE_NAME)?.value;
    }

    if (!token) return null;
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

//  clear

export function clearSession(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
    path: "/",
  });
}
