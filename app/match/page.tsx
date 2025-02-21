'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { getAllGames } from '@/app/service/api'
import { useRouter } from 'next/navigation'
import { Game } from '@/app/store/gameStore'
import { IFootballMatch } from '@/matchStore/interfaces'
import CreateFootballMatchModal from '@/components/MatchComponents/create-football-match-modal'
import { MatchCard } from '@/components/MatchComponents/MatchCard'
import { PopoverCreateGame } from '../games/popoverCreate'

interface getAllGamesResponse {
  games: Game[]
  matches: IFootballMatch[]
}

export default function MatchList() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [matches, setMatches] = useState<IFootballMatch[]>([])

  const handleCreateMatch = (newMatch: IFootballMatch) => {
    setMatches([...matches, newMatch])
  }

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchGames = async () => {
      if (user) {
        let response = (await getAllGames(user._id)) as getAllGamesResponse
        const fetchedGames = response.games.map((game: any) => {
          return {
            ...game,
            id: game._id,
          }
        })

        if (response.games.length > 0) {
          setGames(fetchedGames)
        }

        if (response.matches.length > 0) {
          setMatches(response.matches)
        }
      }
    }
    fetchGames()
  }, [user])
  const [openGame, setOpenGame] = useState(false)
  const [openMatch, setOpenMatch] = useState(false)

  return (
    <div className="h-full w-full">
      <div className="container mx-auto px-4 py-4 font-['Roboto_Condensed']">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis partidos de Fútbol</h1>
          <div className="hidden md:flex gap-4">
            <CreateFootballMatchModal open={openMatch} onCreateMatch={handleCreateMatch} />
          </div>
          <div className="flex md:hidden">
            <PopoverCreateGame
              setOpenGame={setOpenGame}
              setOpenMatch={setOpenMatch}
            />
          </div>
        </div>
        <div className="flex flex-col overflow-y-auto h-[75vh]">
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((match, index) => (
              <MatchCard key={index} match={match} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
