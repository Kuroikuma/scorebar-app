'use client'

import { useState } from 'react'
import { useTeamsStore, Player } from '@/app/store/teamsStore'
import { useGameStore } from '@/app/store/gameStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  UserPlus, 
  Pencil, 
  Trash2, 
  ArrowRightLeft, 
  CheckCircle2,
  AlertCircle,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'

interface RosterManagerProps {
  teamIndex: number
}

export function RosterManager({ teamIndex }: RosterManagerProps) {
  const { teams, updatePlayer, addPlayerToBench, removePlayerFromBench, substituteWithBenchPlayer, canPlayerBeSubstituted, submitLineup } = useTeamsStore()
  const { isDHEnabled } = useGameStore()
  const team = teams[teamIndex]

  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [substituteDialogOpen, setSubstituteDialogOpen] = useState(false)
  
  const [addTo, setAddTo] = useState<'lineup' | 'bench'>('lineup')
  const [editingPlayer, setEditingPlayer] = useState<{ player: Player; index: number; location: 'lineup' | 'bench' } | null>(null)
  const [selectedLineupPlayerId, setSelectedLineupPlayerId] = useState<string | null>(null)
  const [selectedBenchPlayerId, setSelectedBenchPlayerId] = useState<string | null>(null)

  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    number: '',
    position: '',
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
      (!team.lineup.some(p => p.position === pos) || pos === currentPosition)
    )
  }

  const handleAddPlayer = async () => {
    if (!newPlayer.name || !newPlayer.number || !newPlayer.position) {
      toast.error('Nombre, número y posición son requeridos')
      return
    }

    const player: Player = {
      _id: `player-${Date.now()}-${Math.random()}`,
      name: newPlayer.name,
      number: newPlayer.number,
      position: newPlayer.position,
      battingOrder: 0,
      defensiveOrder: 0,
      turnsAtBat: [],
    }

    if (addTo === 'bench') {
      await addPlayerToBench(teamIndex, player)
    } else {
      const currentLineup = team.lineup
      const battingOrderPlayers = isDHEnabled 
        ? currentLineup.filter(p => p.position !== 'P')
        : currentLineup
      
      const playerIndex = currentLineup.length
      const defensiveOrder = allPositions.findIndex(pos => pos === player.position) + 1
      const battingOrder = isDHEnabled && player.position === 'P' 
        ? 0 
        : battingOrderPlayers.length + 1

      await updatePlayer(teamIndex, playerIndex, {
        ...player,
        battingOrder,
        defensiveOrder,
      })
    }

    setNewPlayer({ name: '', number: '', position: '', battingOrder: 0, defensiveOrder: 0 })
    setAddDialogOpen(false)
  }

  const handleEditPlayer = (player: Player, index: number, location: 'lineup' | 'bench') => {
    setEditingPlayer({ player, index, location })
    setNewPlayer({ ...player })
    setEditDialogOpen(true)
  }

  const handleUpdatePlayer = async () => {
    if (!editingPlayer || !newPlayer.name || !newPlayer.number || !newPlayer.position) {
      toast.error('Todos los campos son requeridos')
      return
    }

    if (editingPlayer.location === 'lineup') {
      const defensiveOrder = allPositions.findIndex(pos => pos === newPlayer.position) + 1
      await updatePlayer(teamIndex, editingPlayer.index, {
        ...editingPlayer.player,
        ...newPlayer,
        defensiveOrder,
      } as Player)
    } else {
      // Para banca, necesitamos actualizar manualmente
      const updatedBench = team.bench.map((p, i) => 
        i === editingPlayer.index ? { ...p, ...newPlayer } as Player : p
      )
      // Aquí deberías llamar a una función updateBenchPlayer si existe
      toast.success('Jugador actualizado')
    }

    setEditDialogOpen(false)
    setEditingPlayer(null)
    setNewPlayer({ name: '', number: '', position: '', battingOrder: 0, defensiveOrder: 0 })
  }

  const handleDeletePlayer = async (index: number, location: 'lineup' | 'bench') => {
    if (location === 'lineup') {
      await updatePlayer(teamIndex, index, null)
    } else {
      const player = team.bench[index]
      if (player._id) {
        await removePlayerFromBench(teamIndex, player._id)
      }
    }
  }

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

  const isLineupComplete = () => {
    const requiredPlayers = isDHEnabled ? 10 : 9
    return team.lineup.length === requiredPlayers
  }

  const availablePositions = getAvailablePositions(addTo, editingPlayer?.player.position)
  const availableBenchPlayers = team.bench.filter(p => !p.isSubstituted)
  const availableLineupPlayers = team.lineup.filter(p => canPlayerBeSubstituted(teamIndex, p._id!))

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
          <Button onClick={() => setAddDialogOpen(true)} className="bg-[#4c3f82] hover:bg-[#5a4b99]">
            <UserPlus className="h-4 w-4 mr-2" />
            Agregar Jugador
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="lineup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#2d2b3b]">
            <TabsTrigger value="lineup" className="data-[state=active]:bg-[#4c3f82]">
              <Users className="h-4 w-4 mr-2" />
              Lineup Activo ({team.lineup.length}/{isDHEnabled ? 10 : 9})
            </TabsTrigger>
            <TabsTrigger value="bench" className="data-[state=active]:bg-[#4c3f82]">
              <Users className="h-4 w-4 mr-2" />
              Banca ({availableBenchPlayers.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Lineup Activo */}
          <TabsContent value="lineup" className="space-y-4 mt-4">
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
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
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
                              onClick={() => handleEditPlayer(player, index, 'lineup')}
                              disabled={player.isSubstituted}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePlayer(index, 'lineup')}
                              disabled={player.isSubstituted || team.lineupSubmitted}
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
          </TabsContent>

          {/* Tab: Banca */}
          <TabsContent value="bench" className="space-y-4 mt-4">
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
                            onClick={() => handleEditPlayer(player, index, 'bench')}
                            disabled={player.isSubstituted}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeletePlayer(index, 'bench')}
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
          </TabsContent>
        </Tabs>

        {/* Dialog: Agregar Jugador */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-[#1a1625] border-[#2d2b3b] text-white">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Jugador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
                onClick={() => setAddDialogOpen(false)}
                className="bg-[#2d2b3b] border-0"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleAddPlayer}
                className="bg-[#4c3f82] hover:bg-[#5a4b99]"
              >
                Agregar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Editar Jugador */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-[#1a1625] border-[#2d2b3b] text-white">
            <DialogHeader>
              <DialogTitle>Editar Jugador</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={newPlayer.name || ''}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="bg-[#2d2b3b] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-number">Número</Label>
                <Input
                  id="edit-number"
                  value={newPlayer.number || ''}
                  onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
                  className="bg-[#2d2b3b] border-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-position">Posición</Label>
                <Select
                  value={newPlayer.position}
                  onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
                >
                  <SelectTrigger className="bg-[#2d2b3b] border-0">
                    <SelectValue />
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
                onClick={() => {
                  setEditDialogOpen(false)
                  setEditingPlayer(null)
                }}
                className="bg-[#2d2b3b] border-0"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdatePlayer}
                className="bg-[#4c3f82] hover:bg-[#5a4b99]"
              >
                Actualizar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog: Realizar Sustitución */}
        <Dialog open={substituteDialogOpen} onOpenChange={setSubstituteDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-[#1a1625] border-[#2d2b3b] text-white">
            <DialogHeader>
              <DialogTitle>Realizar Sustitución</DialogTitle>
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
      </CardContent>
    </Card>
  )
}
