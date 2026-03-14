'use client'

import { useState } from 'react'
import { useTeamsStore, Player } from '@/app/store/teamsStore'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { ArrowRightLeft, Trash2, Users, Pencil, AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface BenchManagerProps {
  teamIndex: number
  onEditPlayer: (player: Player, index: number) => void
}

export function BenchManager({ teamIndex, onEditPlayer }: BenchManagerProps) {
  const { teams, removePlayerFromBench, substituteWithBenchPlayer, canPlayerBeSubstituted } = useTeamsStore()
  const team = teams[teamIndex]

  const [substituteDialogOpen, setSubstituteDialogOpen] = useState(false)
  const [selectedLineupPlayerId, setSelectedLineupPlayerId] = useState<string | null>(null)
  const [selectedBenchPlayerId, setSelectedBenchPlayerId] = useState<string | null>(null)

  const handleSubstitute = async () => {
    if (!selectedLineupPlayerId || !selectedBenchPlayerId) {
      toast.error('Selecciona ambos jugadores para realizar la sustitución')
      return
    }

    const result = await substituteWithBenchPlayer(teamIndex, selectedLineupPlayerId, selectedBenchPlayerId)
    
    if (result.success) {
      setSubstituteDialogOpen(false)
      setSelectedLineupPlayerId(null)
      setSelectedBenchPlayerId(null)
    }
  }

  const handleRemoveFromBench = async (playerId: string) => {
    await removePlayerFromBench(teamIndex, playerId)
  }

  const availableBenchPlayers = team.bench.filter(p => !p.isSubstituted)
  const availableLineupPlayers = team.lineup.filter(p => canPlayerBeSubstituted(teamIndex, p._id!))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Jugadores sustitutos disponibles para entrar al juego
        </p>
        {availableBenchPlayers.length > 0 && availableLineupPlayers.length > 0 && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setSubstituteDialogOpen(true)}
            className="border-[#4c3f82] text-[#4c3f82] hover:bg-[#4c3f82] hover:text-white"
          >
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            Realizar Sustitución
          </Button>
        )}
      </div>

      {team.bench.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No hay jugadores en la banca</p>
          <p className="text-sm">Agrega jugadores sustitutos para realizar cambios durante el juego</p>
        </div>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {team.bench.map((player, index) => (
              <Card key={player._id || index} className="p-4 bg-[#2d2b3b] border-[#3d3b4b]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      #{player.number}
                    </Badge>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {player.name}
                        {player.isSubstituted && (
                          <Badge variant="secondary" className="text-xs">
                            Sustituido
                          </Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-400">
                        {player.position}
                        {player.substituteFor && ' • Entró por sustitución'}
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
                      onClick={() => handleRemoveFromBench(player._id!)}
                      disabled={player.isSubstituted}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Dialog: Realizar sustitución */}
      <Dialog open={substituteDialogOpen} onOpenChange={setSubstituteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#1a1625] border-[#2d2b3b] text-white">
          <DialogHeader>
            <DialogTitle>Realizar Sustitución - {team.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Jugador a Sustituir (Lineup)</Label>
              <Select
                value={selectedLineupPlayerId || ''}
                onValueChange={setSelectedLineupPlayerId}
              >
                <SelectTrigger className="bg-[#2d2b3b] border-0">
                  <SelectValue placeholder="Selecciona jugador del lineup" />
                </SelectTrigger>
                <SelectContent>
                  {availableLineupPlayers.map((player) => (
                    <SelectItem key={player._id} value={player._id!}>
                      #{player.number} - {player.name} ({player.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Jugador Sustituto (Banca)</Label>
              <Select
                value={selectedBenchPlayerId || ''}
                onValueChange={setSelectedBenchPlayerId}
              >
                <SelectTrigger className="bg-[#2d2b3b] border-0">
                  <SelectValue placeholder="Selecciona jugador de la banca" />
                </SelectTrigger>
                <SelectContent>
                  {availableBenchPlayers.map((player) => (
                    <SelectItem key={player._id} value={player._id!}>
                      #{player.number} - {player.name} ({player.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Alert className="bg-[#2d2b3b] border-yellow-500/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Regla 5.10:</strong> Un jugador sustituido no puede regresar al juego. 
                Asegúrate de que la bola esté muerta antes de realizar la sustitución.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSubstituteDialogOpen(false)}
              className="bg-[#2d2b3b] border-0"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubstitute}
              disabled={!selectedLineupPlayerId || !selectedBenchPlayerId}
              className="bg-[#4c3f82] hover:bg-[#5a4b99]"
            >
              Confirmar Sustitución
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
