'use client'

import { useState } from 'react'
import { useTeamsStore, Player } from '@/app/store/teamsStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, Shield } from 'lucide-react'
import { LineupManager } from './LineupManager'
import { BenchManager } from './BenchManager'
import { AddPlayer } from './addPlayer'

interface RosterManagerProps {
  teamIndex: number
}

export function RosterManager({ teamIndex }: RosterManagerProps) {
  const { teams } = useTeamsStore()
  const team = teams[teamIndex]

  const [editingPlayer, setEditingPlayer] = useState<{ player: Player; index: number; location: 'lineup' | 'bench' } | null>(null)

  const handleEditPlayer = (player: Player, index: number, location: 'lineup' | 'bench') => {
    setEditingPlayer({ player, index, location })
  }

  const handleCloseDialog = () => {
    setEditingPlayer(null)
  }

  const availableBenchPlayers = team.bench.filter(p => !p.isSubstituted)

  return (
    <Card className="w-full bg-[#1a1625] border-[#2d2b3b] text-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Roster Manager - {team.name}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Gestiona el lineup activo y los jugadores en banca
            </CardDescription>
          </div>
          <AddPlayer
            teamIndex={teamIndex}
            editingPlayer={editingPlayer}
            onClose={handleCloseDialog}
            trigger={
              <Button className="bg-[#4c3f82] hover:bg-[#5a4b99]">
                <UserPlus className="h-4 w-4 mr-2" />
                Agregar Jugador
              </Button>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lineup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#2d2b3b]">
            <TabsTrigger value="lineup" className="data-[state=active]:bg-[#4c3f82]">
              <Users className="h-4 w-4 mr-2" />
              Lineup Activo ({team.lineup.length}/{team.lineup.some(p => p.position === 'DH') ? 10 : 9})
            </TabsTrigger>
            <TabsTrigger value="bench" className="data-[state=active]:bg-[#4c3f82]">
              <Users className="h-4 w-4 mr-2" />
              Banca ({availableBenchPlayers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lineup" className="space-y-4 mt-4">
            <LineupManager 
              teamIndex={teamIndex} 
              onEditPlayer={(player, index) => handleEditPlayer(player, index, 'lineup')}
            />
          </TabsContent>

          <TabsContent value="bench" className="space-y-4 mt-4">
            <BenchManager 
              teamIndex={teamIndex}
              onEditPlayer={(player, index) => handleEditPlayer(player, index, 'bench')}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
