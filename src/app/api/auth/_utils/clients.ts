import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";

// 🔹 Client for server-side API routes that need user sessions
// Accept an optional `cookiesStore` (an awaited cookies() result). Passing the
// awaited store avoids calling `cookies()` synchronously inside the
// auth-helpers library (Next.js warns about sync access to dynamic APIs).
export const serverClient = (cookiesStore?: unknown) => {
  // Normalize inputs into a getter that returns the cookie store synchronously.
  // Using the same return shape as Next's `cookies()`.
  type CookieGetter = () => ReturnType<typeof cookies>;

  let cookiesGetter: CookieGetter;

  if (typeof cookiesStore === "function") {
    const fn = cookiesStore as () => unknown;
    cookiesGetter = () => fn() as ReturnType<typeof cookies>;
  } else if (cookiesStore) {
    cookiesGetter = () => cookiesStore as ReturnType<typeof cookies>;
  } else {
    cookiesGetter = (cookies as unknown) as CookieGetter;
  }

  return createRouteHandlerClient({ cookies: cookiesGetter });
};

// 🔹 Admin client for privileged actions (e.g., create/delete users)
export const adminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
