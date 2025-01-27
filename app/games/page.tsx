'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { getAllGames } from '@/app/service/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CalendarIcon, CheckIcon, PlayIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Game, RunsByInning } from '@/app/store/gameStore'
import NewGame from './new/page'
import { GameCard } from './gameCard'
import { Header } from '@/components/header'

export default function GamesList() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchGames = async () => {
      if (user) {
        const fetchedGames = ((await getAllGames()) as Game[]).map(
          (game: any) => {
            return {
              ...game,
              id: game._id,
            }
          }
        )
        setGames(fetchedGames)
      }
    }
    fetchGames()
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <CalendarIcon className="w-5 h-5 text-blue-500" />
      case 'in_progress':
        return <PlayIcon className="w-5 h-5 text-green-500" />
      case 'finished':
        return <CheckIcon className="w-5 h-5 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className='h-screen w-screen bg-black'>
      <Header />
      <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">My Games</h1>
        <NewGame />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game: Game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
    </div>
  )
}
