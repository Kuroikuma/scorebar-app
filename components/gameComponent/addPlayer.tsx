'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Player, useTeamsStore } from '@/app/store/teamsStore'
import { useGameStore } from '@/app/store/gameStore'
import { Label } from '@/components/ui/label'

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
      <DialogContent className="sm:max-w-[425px] bg-[#1a1625] border-[#2d2b3b] text-white">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Jugador' : 'Agregar Nuevo Jugador'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {!isEditMode && (
            <div className="space-y-2">
              <Label>Agregar a:</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={addTo === 'lineup' ? 'default' : 'outline'}
                  className={addTo === 'lineup' ? 'bg-[#4c3f82]' : 'border-[#2d2b3b]'}
                  onClick={() => setAddTo('lineup')}
                >
                  Lineup Activo
                </Button>
                <Button
                  type="button"
                  variant={addTo === 'bench' ? 'default' : 'outline'}
                  className={addTo === 'bench' ? 'bg-[#4c3f82]' : 'border-[#2d2b3b]'}
                  onClick={() => setAddTo('bench')}
                >
                  Banca
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Nombre del jugador"
              value={newPlayer.name || ''}
              onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
              className="bg-[#2d2b3b] border-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">Número</Label>
            <Input
              id="number"
              placeholder="Número de camiseta"
              type='number'
              value={newPlayer.number || ''}
              onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
              className="bg-[#2d2b3b] border-0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Posición</Label>
            <Select
              value={newPlayer.position}
              onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
            >
              <SelectTrigger className="bg-[#2d2b3b] border-0">
                <SelectValue placeholder="Selecciona posición" />
              </SelectTrigger>
              <SelectContent>
                {availablePositions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => handleOpenChange(false)}
            className="bg-[#2d2b3b] border-0"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleAddPlayer}
            disabled={!newPlayer.name || !newPlayer.position || !newPlayer.number}
            className="bg-[#4c3f82] hover:bg-[#5a4b99]"
          >
            {isEditMode ? 'Actualizar' : 'Agregar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
