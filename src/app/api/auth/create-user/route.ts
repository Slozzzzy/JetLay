import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PASSWORD_REGEX } from "../_utils/password";

// Supabase public client (for normal auth flows: signUp -> sends email)
const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Supabase admin client (server-only)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Accept either `fullName` (single field) or `firstName`/`lastName` (client may send these)
    const body = await req.json();
    const { fullName, firstName, lastName, email, password } = body as {
      fullName?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    };

    // Resolve a combined full name from whichever shape the client provided
    const resolvedFullName = fullName ?? [firstName, lastName].filter(Boolean).join(' ') ?? '';

    // Input validation
    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character (!@#$%^&*).",
        },
        { status: 400 }
      );
    }

    // Split the resolved full name into first/last (fall back to nulls)
    const nameParts = resolvedFullName.trim().split(/\s+/).filter(Boolean);
    const first_name = nameParts.length > 0 ? nameParts[0] : null;
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;

    // Create user with Supabase Admin API
    const { data, error } = await supabasePublic.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/login`,
        data: {
          first_name,
          last_name,
          full_name: resolvedFullName,
          avatar_url: "",
        },
      },
    });

    if (error) {
      console.error("Supabase createUser error:", JSON.stringify(error, null, 2));
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Ensure a corresponding `profiles` row exists for this user.
    // Some projects rely on DB triggers, but creating it here guarantees the
    // profile will exist after account creation (important for email/password flows).
    try {
      await supabaseAdmin.from('profiles').insert({
        id: data.user?.id,
        first_name: first_name ?? null,
        last_name: last_name ?? null,
        full_name: resolvedFullName ?? null,
        avatar_url: '',
        phone: null,
        birth_date: null,
      });
    } catch (insertErr) {
      console.warn('Failed to create profiles row for new user:', insertErr);
      // Not fatal for the signup — return success but log the issue.
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user_id: data.user?.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create user route error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
