'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseUrlClient } from '@/lib/supabaseClient'

function CallbackCore() {
  const router = useRouter()
  const searchParams = useSearchParams();

  useEffect(() => {
    (async () => {
      // ----- 1) Read type from URL hash (Supabase puts it here) -----
      let typeFromHash: string | null = null;

      if (typeof window !== 'undefined') {
        const rawHash = window.location.hash || '';      // "#access_token=...&type=signup"
        const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
        const hashParams = new URLSearchParams(hash);
        typeFromHash = hashParams.get('type');           // "signup" | "recovery" | null
      }

      const type = typeFromHash ?? searchParams.get('type'); // fallback to query just in case
      const source = searchParams.get('source');
      const next = searchParams.get('next') ?? '/';

      // ----- 2) Password reset: we WANT a session for /auth/createnew-password -----
      if (type === 'recovery') {
        // This will parse the hash and store the session
        await supabaseUrlClient.auth.getSession();
        router.replace('/auth/createnew-password');
        return;
      }

      // ----- 3) Google OAuth: we WANT a session and then go to `next` -----
      if (source === 'google') {
        await supabaseUrlClient.auth.getSession();
        router.replace(next);
        return;
      }

      // ----- 4) Email verification (signup confirm): we do NOT want auto-login -----
      if (type === 'signup') {
        try {
          // Supabase already parsed the hash when the client was created,
          // so clear any session it created.
          await supabaseUrlClient.auth.signOut();
        } catch (e) {
          console.error('Signout after signup verification failed:', e);
        }

        // Send user to login screen – page.tsx will pick ?screen=welcomeBack
        router.replace('/?screen=welcomeBack');
        return;
      }

      // ----- 5) Fallback: just go to login -----
      router.replace('/?screen=welcomeBack');
    })();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-700">Redirecting...</p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-700">Redirecting...</p>
      </div>
    }>
      <CallbackCore />
    </Suspense>
  )
}
