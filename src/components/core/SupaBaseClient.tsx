import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = ((): ReturnType<typeof createClient> => {
  if (typeof window === "undefined") {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    });
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      storage: window.localStorage,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
  });
})();
