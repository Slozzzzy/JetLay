'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) return <p>Loading user...</p>

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <img
        src={user.user_metadata?.avatar_url}
        alt="avatar"
        className="w-16 h-16 rounded-full"
      />
      <h2 className="text-xl font-semibold">{user.user_metadata?.full_name}</h2>
      <p>{user.email}</p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  )
}
