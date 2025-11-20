import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverClient } from "../_utils/clients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const IDLE_MINUTES = 30;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supa = serverClient(() => cookieStore);
  let signInResult;
  try {
    signInResult = await supa.auth.signInWithPassword({ email, password });
  } catch (thrown) {
    // Log full error for debugging (server-side only)
    console.error('signInWithPassword threw an exception', thrown);
    return NextResponse.json({ error: 'Authentication service error' }, { status: 500 });
  }

  const { data, error } = signInResult ?? {};

  if (error) {
    console.error('login error', { email, error });
    // Return the provider error message to the client for easier debugging.
    return NextResponse.json({ error: (error as Error)?.message || "Invalid email or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("last-activity", Date.now().toString(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  res.cookies.set("idle-max-minutes", IDLE_MINUTES.toString(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return res;
}
