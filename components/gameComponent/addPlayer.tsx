'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Player, useTeamsStore } from '@/app/store/teamsStore'
import { useGameStore } from '@/app/store/gameStore'
import { Label } from '@/components/ui/label'
import { UserPlus, Users, Shirt, Hash, MapPin, Edit3 } from 'lucide-react'

interface AddPlayerProps {
  teamIndex: number
  editingPlayer: { player: Player; index: number; location: 'lineup' | 'bench' } | null
  onClose: () => void
  trigger?: React.ReactNode
}

export function AddPlayer({ teamIndex, editingPlayer, onClose, trigger }: AddPlayerProps) {
  const { teams, updatePlayer, addPlayerToBench, addPlayerToLineup, updateBenchPlayer } = useTeamsStore()
  const { isDHEnabled } = useGameStore()
  const [isOpen, setIsOpen] = useState(false)
  const [addTo, setAddTo] = useState<'lineup' | 'bench'>('lineup')
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    position: '',
    number: '',
    battingOrder: 0,
    defensiveOrder: 0,
  })

  const allPositions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']

  const getAvailablePositions = (forLocation: 'lineup' | 'bench', currentPosition?: string) => {
    if (forLocation === 'bench') {
      return isDHEnabled ? allPositions : allPositions.filter(pos => pos !== 'DH')
    }
    
    return allPositions.filter(pos => 
      (isDHEnabled || pos !== 'DH') && 
      (!teams[teamIndex].lineup.some(p => p.position === pos) || pos === currentPosition)
    )
  }

  const handleAddPlayer = async () => {
    if (!newPlayer.name || !newPlayer.number || !newPlayer.position) {
      return
    }

    const player: Player = {
      name: newPlayer.name,
      number: newPlayer.number,
      position: newPlayer.position,
      battingOrder: 0,
      defensiveOrder: 0,
      turnsAtBat: [],
    }

    if (editingPlayer) {
      // Modo edición
      if (editingPlayer.location === 'lineup') {
        const defensiveOrder = allPositions.findIndex(pos => pos === newPlayer.position) + 1
        await updatePlayer(teamIndex, editingPlayer.index, {
          ...editingPlayer.player,
          ...newPlayer,
          defensiveOrder,
        } as Player)
      } else {
        // Actualizar jugador en banca
        await updateBenchPlayer(teamIndex, editingPlayer.player._id!, {
          ...editingPlayer.player,
          ...newPlayer,
        } as Player)
      }
    } else {
      // Modo agregar
      if (addTo === 'bench') {
        await addPlayerToBench(teamIndex, player)
      } else {
        const currentLineup = teams[teamIndex].lineup
        const battingOrderPlayers = isDHEnabled 
          ? currentLineup.filter(p => p.position !== 'P')
          : currentLineup
        
        const playerIndex = currentLineup.length
        const defensiveOrder = allPositions.findIndex(pos => pos === player.position) + 1
        const battingOrder = isDHEnabled && player.position === 'P' 
          ? 0 
          : battingOrderPlayers.length + 1

        await addPlayerToLineup(teamIndex, {
          ...player,
          battingOrder,
          defensiveOrder,
        })
      }
    }

    setNewPlayer({ name: '', position: '', number: '', battingOrder: 0, defensiveOrder: 0 })
    setIsOpen(false)
    onClose()
  }

  useEffect(() => {
    if (editingPlayer) {
      setIsOpen(true)
      setNewPlayer({ ...editingPlayer.player })
      setAddTo(editingPlayer.location)
    }
  }, [editingPlayer])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setNewPlayer({ name: '', position: '', number: '', battingOrder: 0, defensiveOrder: 0 })
      setAddTo('lineup')
      onClose()
    }
  }

  const availablePositions = getAvailablePositions(addTo, editingPlayer?.player.position)
  const isEditMode = !!editingPlayer

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-[#1a1625] to-[#221b2e] border-[#3d3550] text-white shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-[#3d3550]">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isEditMode ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
              {isEditMode ? (
                <Edit3 className="w-6 h-6 text-blue-400" />
              ) : (
                <UserPlus className="w-6 h-6 text-purple-400" />
              )}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {isEditMode ? 'Editar Jugador' : 'Agregar Nuevo Jugador'}
              </DialogTitle>
              <p className="text-sm text-gray-400 mt-1">
                {isEditMode 
                  ? 'Actualiza la información del jugador' 
                  : 'Completa los datos del nuevo jugador'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-6">
          {!isEditMode && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Destino del Jugador
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAddTo('lineup')}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200
                    ${addTo === 'lineup' 
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20' 
                      : 'border-[#3d3550] bg-[#2d2b3b] hover:border-purple-500/50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-lg ${addTo === 'lineup' ? 'bg-purple-500/30' : 'bg-[#3d3550]'}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">Lineup Activo</span>
                    <span className="text-xs text-gray-400">Jugador titular</span>
                  </div>
                  {addTo === 'lineup' && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setAddTo('bench')}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200
                    ${addTo === 'bench' 
                      ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20' 
                      : 'border-[#3d3550] bg-[#2d2b3b] hover:border-blue-500/50'
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-lg ${addTo === 'bench' ? 'bg-blue-500/30' : 'bg-[#3d3550]'}`}>
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">Banca</span>
                    <span className="text-xs text-gray-400">Jugador suplente</span>
                  </div>
                  {addTo === 'bench' && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Nombre Completo
            </Label>
            <div className="relative">
              <Input
                id="name"
                placeholder="Ej: Juan Pérez"
                value={newPlayer.name || ''}
                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                className="bg-[#2d2b3b] border-[#3d3550] pl-4 pr-4 py-6 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Número
              </Label>
              <div className="relative">
                <Shirt className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="number"
                  placeholder="00"
                  type='number'
                  value={newPlayer.number || ''}
                  onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
                  className="bg-[#2d2b3b] border-[#3d3550] pl-11 pr-4 py-6 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Posición
              </Label>
              <Select
                value={newPlayer.position}
                onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
              >
                <SelectTrigger className="bg-[#2d2b3b] border-[#3d3550] py-6 text-base focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all">
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className="bg-[#2d2b3b] border-[#3d3550]">
                  {availablePositions.map((pos) => (
                    <SelectItem 
                      key={pos} 
                      value={pos}
                      className="hover:bg-purple-500/20 focus:bg-purple-500/20"
                    >
                      <span className="font-semibold">{pos}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!newPlayer.name && !newPlayer.number && !newPlayer.position && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300">
              💡 Completa todos los campos para continuar
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 pt-4 border-t border-[#3d3550]">
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            className="bg-[#2d2b3b] border-[#3d3550] hover:bg-[#3d3550] hover:border-[#4d4560] transition-all px-6"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddPlayer}
            disabled={!newPlayer.name || !newPlayer.position || !newPlayer.number}
            className={`
              px-6 font-semibold transition-all
              ${!newPlayer.name || !newPlayer.position || !newPlayer.number
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 shadow-lg shadow-purple-500/30'
              }
            `}
          >
            {isEditMode ? (
              <>
                <Edit3 className="w-4 h-4 mr-2" />
                Actualizar Jugador
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Jugador
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
