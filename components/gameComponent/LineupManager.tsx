'use client'

import { useTeamsStore, Player } from '@/app/store/teamsStore'
import { useGameStore } from '@/app/store/gameStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Pencil, Trash2, CheckCircle2, AlertCircle } from 'lucide-react'

interface LineupManagerProps {
  teamIndex: number
  onEditPlayer: (player: Player, index: number) => void
}

export function LineupManager({ teamIndex, onEditPlayer }: LineupManagerProps) {
  const { teams, updatePlayer, submitLineup, canPlayerBeSubstituted } = useTeamsStore()
  const { isDHEnabled } = useGameStore()
  const team = teams[teamIndex]

  const handleDeletePlayer = async (index: number) => {
    await updatePlayer(teamIndex, index, null)
  }

  const isLineupComplete = () => {
    const requiredPlayers = isDHEnabled ? 10 : 9
    return team.lineup.length === requiredPlayers
  }

  return (
    <div className="space-y-4">
      {!isLineupComplete() && (
        <Alert className="bg-[#2d2b3b] border-yellow-500/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Necesitas {isDHEnabled ? 10 : 9} jugadores en el lineup. 
            Actualmente tienes {team.lineup.length}.
          </AlertDescription>
        </Alert>
      )}

      {team.lineup.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No hay jugadores en el lineup</p>
          <p className="text-sm">Agrega jugadores para comenzar</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {team.lineup.map((player, index) => {
              const isCurrentBatter = index === team.currentBatter
              const canSubstitute = canPlayerBeSubstituted(teamIndex, player._id!)

              return (
                <Card key={player._id || index} className={`p-4 bg-[#2d2b3b] border-[#3d3b4b] ${isCurrentBatter ? 'border-l-4 border-l-green-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <Badge variant="outline" className="font-mono mb-1">
                          #{player.number}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {player.battingOrder > 0 ? player.battingOrder : '-'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {player.name}
                          {isCurrentBatter && (
                            <Badge variant="default" className="bg-green-600 text-xs">
                              Bateando
                            </Badge>
                          )}
                          {player.isSubstituted && (
                            <Badge variant="secondary" className="text-xs">
                              Sustituido
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-400">
                          {player.position} • Orden defensivo: {player.defensiveOrder}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEditPlayer(player, index)}
                        disabled={player.isSubstituted}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePlayer(index)}
                        disabled={player.isSubstituted}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      )}

      {isLineupComplete() && !team.lineupSubmitted && (
        <Button 
          onClick={() => submitLineup(teamIndex)} 
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Confirmar Lineup
        </Button>
      )}

      {team.lineupSubmitted && (
        <Alert className="bg-green-900/20 border-green-500/50">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Lineup confirmado y listo para el juego
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
