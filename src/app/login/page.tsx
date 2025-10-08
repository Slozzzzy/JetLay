'use client'

import React from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  // --- Google Login Function ---
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`, // redirect after login
        },
      })

      if (error) {
        console.error('❌ Google login error:', error.message)
      } else {
        console.log('✅ Redirecting to Google login...', data)
      }
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Sign in</h1>

      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition"
      >
        <img
          src="https://www.svgrepo.com/show/355037/google.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span className="text-gray-700 font-medium">Sign in with Google</span>
      </button>
    </div>
  )
}
