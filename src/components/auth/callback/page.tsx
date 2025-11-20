'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

function CallbackCore() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    (async () => {
      const code = params.get('code')
      // Decide redirect after exchange:
      // - If the exchange produced a session, send user to dashboard (root '/').
      // - On error or no session, fall back to the login page.
      let next = params.get('next') ?? null;
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('Exchange code error:', error)
          next = next ?? '/auth/login'
        } else {
          // Exchange succeeded — prefer explicit next param, otherwise go to app root
          next = next ?? '/'
        }
      } else {
        next = next ?? '/auth/login'
      }

      router.replace(next)
    })()
  }, [params, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-700">Redirecting...</p>
    </div>
  )
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
