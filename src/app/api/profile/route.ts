import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { serverClient } from "../auth/_utils/clients";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supa = serverClient(cookieStore);

    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data, error } = await supa.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (error) {
      console.error('profile fetch error', error);
      return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
    }

    return NextResponse.json({ profile: data ?? null }, { status: 200 });
  } catch (err) {
    console.error('profile route error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const updates = body || {};

    const cookieStore = await cookies();
    const supa = serverClient(cookieStore as any);

    const { data: { user } } = await supa.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { data, error } = await supa.from('profiles').update(updates).eq('id', user.id).select().maybeSingle();
    if (error) {
      console.error('profile update error', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ profile: data ?? null }, { status: 200 });
  } catch (err) {
    console.error('profile PATCH error', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
