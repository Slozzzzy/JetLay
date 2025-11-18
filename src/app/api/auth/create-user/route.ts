import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Paaword Policy
const PASSWORD_REGEX =
  /^(?=.{8,}$)(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).*$/;

// Supabase admin client (server-only)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password } = await req.json();

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

    // Split full name into first/last
    const [first_name, ...rest] = fullName.trim().split(" ");
    const last_name = rest.join(" ");

    // Create user with Supabase Admin API
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name,
        last_name,
        full_name: fullName,
        avatar_url: "",
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
