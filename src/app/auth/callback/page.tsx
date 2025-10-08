'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Callback error:', error)
        router.push('/')
        return
      }

      if (data?.session) {
        console.log('Logged in user:', data.session.user)
        router.push('/') // go back to your main app
      } else {
        router.push('/')
      }
    }

    handleRedirect()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg text-gray-700">Redirecting...</p>
    </div>
  )
}
