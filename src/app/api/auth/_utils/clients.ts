import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// 🔹 Client for server-side API routes that need user sessions
// Accept an optional `cookiesStore` (an awaited cookies() result). Passing the
// awaited store avoids calling `cookies()` synchronously inside the
// auth-helpers library (Next.js warns about sync access to dynamic APIs).
export const serverClient = (cookiesStore?: any) =>
  createRouteHandlerClient({ cookies: cookiesStore ? () => cookiesStore : cookies });

// 🔹 Admin client for privileged actions (e.g., create/delete users)
export const adminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
