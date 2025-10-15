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
  const supa = serverClient(cookieStore);
  const { error } = await supa.auth.signInWithPassword({ email, password });

  if (error) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
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
