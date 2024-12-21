"use client"

import { AuthProvider } from '@/app/context/AuthContext'
import GamesList from './games/page'

export default function Page() {
  return (
    <AuthProvider>
      <GamesList />
    </AuthProvider>
  )
}
