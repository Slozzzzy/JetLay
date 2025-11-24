import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Default client: no auto parsing → prevents auto-login everywhere
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',     
    detectSessionInUrl: false, // <<< IMPORTANT: no auto-login from URL
  },
});

// Special client: only for callback / reset pages where we WANT parsing
export const supabaseUrlClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'implicit',
    detectSessionInUrl: true,
  },
});
