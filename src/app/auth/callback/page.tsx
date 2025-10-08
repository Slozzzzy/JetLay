'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()
  const params = useSearchParams()
  const event = params.get('event')

  useEffect(() => {
    const handleRedirect = async () => {
      if (event === 'logout') {
        console.log('✅ User logged out')
        router.push('/login')
        return
      }

      const { data, error } = await supabase.auth.getSession()
      if (data?.session) {
        router.push('/profile')
      } else {
        router.push('/login')
      }
    }

    handleRedirect()
  }, [router, event])

  return <p>Loading...</p>
}
