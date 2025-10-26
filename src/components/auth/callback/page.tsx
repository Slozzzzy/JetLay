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
      const next = params.get('next') ?? '/'
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) console.error('Exchange code error:', error)
      }
      router.replace(next) // or '/'
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
