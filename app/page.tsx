"use client"

import { AuthProvider } from '@/context/AuthContext'
import GamesList from '@/pages/games'

export default function Page() {
  return (
    <AuthProvider>
      <GamesList />
    </AuthProvider>
  )
}
