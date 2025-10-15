import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverClient } from "../_utils/clients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  const cookieStore = await cookies();
  const supa = serverClient(cookieStore);
  await supa.auth.signOut();

  const res = NextResponse.json({ ok: true });
  res.cookies.set("last-activity", "", { path: "/", maxAge: 0 });
  res.cookies.set("idle-max-minutes", "", { path: "/", maxAge: 0 });
  return res;
}
