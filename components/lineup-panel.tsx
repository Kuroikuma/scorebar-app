"use client"

import { useState } from "react"
import { useGameStore } from "@/app/store/gameStore"
import { Player, useTeamsStore } from "@/app/store/teamsStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Trash2 } from 'lucide-react'

export function LineupPanel() {
  const { teams, updatePlayer, submitLineup } = useTeamsStore()
  const { isDHEnabled, setIsDHEnabled } = useGameStore()
  const [newPlayers, setNewPlayers] = useState<[Player, Player]>([
    { name: '', position: '', number: '', battingOrder: 0, turnsAtBat: [], defensiveOrder: 0 },
    { name: '', position: '', number: '', battingOrder: 0, turnsAtBat: [], defensiveOrder: 0 }
  ])
  
  const [editingPlayer, setEditingPlayer] = useState<{ teamIndex: number, playerIndex: number } | null>(null)

  const allPositions = [
    "P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "DH"
  ]

  const getAvailablePositions = (teamIndex: number) => {
    return allPositions.filter(pos => 
      (isDHEnabled || pos !== "DH") && 
      !teams[teamIndex].lineup.some(player => player.position === pos) ||
      (editingPlayer && editingPlayer.teamIndex === teamIndex && teams[teamIndex].lineup[editingPlayer.playerIndex].position === pos)
    )
  }

  const handleAddPlayer = (teamIndex: number) => {
    const newPlayer = newPlayers[teamIndex]
    if (newPlayer.name && newPlayer.position && newPlayer.number) {
      const currentLineup = teams[teamIndex].lineup
      const battingOrderPlayers = isDHEnabled 
        ? currentLineup.filter(player => player.position !== 'P')
        : currentLineup

      if (editingPlayer && editingPlayer.teamIndex === teamIndex) {
        updatePlayer(teamIndex, editingPlayer.playerIndex, {
          ...newPlayer,
          battingOrder: isDHEnabled && newPlayer.position === 'P' ? 0 : editingPlayer.playerIndex + 1
        })
        setEditingPlayer(null)
      } else {
        const playerIndex = currentLineup.length
        const battingOrder = isDHEnabled && newPlayer.position === 'P' 
          ? 0 
          : battingOrderPlayers.length + 1
        updatePlayer(teamIndex, playerIndex, {
          ...newPlayer,
          battingOrder
        })
      }
      setNewPlayers(prev => {
        const newState = [...prev] as [Player, Player]
        newState[teamIndex] = { name: '', position: '', number: '', battingOrder: 0, defensiveOrder:0, turnsAtBat:[] }
        return newState
      })
    }
  }

  const handleInputChange = (teamIndex: number, field: keyof Player, value: string) => {
    setNewPlayers(prev => {
      const newState = [...prev] as [Player, Player]
      newState[teamIndex] = { ...newState[teamIndex], [field]: value }
      return newState
    })
  }

  const handleEditPlayer = (teamIndex: number, playerIndex: number) => {
    let player = teams[teamIndex].lineup[playerIndex]
    setNewPlayers(prev => {
      const newState = [...prev] as [Player, Player]
      newState[teamIndex] = { ...player }
      return newState
    })
    setEditingPlayer({ teamIndex, playerIndex })
  }

  const handleDeletePlayer = (teamIndex: number, playerIndex: number) => {
    const newLineup = [...teams[teamIndex].lineup]
    newLineup.splice(playerIndex, 1)
    updatePlayer(teamIndex, playerIndex, null)
  }

  const isLineupComplete = (teamIndex: number) => {
    const requiredPlayers = isDHEnabled ? 10 : 9
    return teams[teamIndex].lineup.length === requiredPlayers
  }

  const renderTeamLineup = (teamIndex: number) => {
    const team = teams[teamIndex]
    const availablePositions = getAvailablePositions(teamIndex)
    const newPlayer = newPlayers[teamIndex]

    return (
      <div key={teamIndex} className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold">{team.name} Lineup</h3>
        <div className="space-y-2">
          <Input
            value={newPlayer.name}
            onChange={(e) => handleInputChange(teamIndex, 'name', e.target.value)}
            placeholder="Nombre del jugador"
            className="bg-[#2d2b3b] border-0"
          />
          <Select
            value={newPlayer.position}
            onValueChange={(value) => handleInputChange(teamIndex, 'position', value)}
          >
            <SelectTrigger className="w-full bg-[#2d2b3b] border-0">
              <SelectValue placeholder="Selecciona posición" />
            </SelectTrigger>
            <SelectContent>
              {availablePositions.map((pos) => (
                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={newPlayer.number}
            onChange={(e) => handleInputChange(teamIndex, 'number', e.target.value)}
            placeholder="Número de camiseta"
            className="bg-[#2d2b3b] border-0"
          />
          <Button 
            onClick={() => handleAddPlayer(teamIndex)} 
            className="w-full bg-[#4c3f82] hover:bg-[#5a4b99]"
            disabled={!newPlayer.name || !newPlayer.position || !newPlayer.number}
          >
            {editingPlayer && editingPlayer.teamIndex === teamIndex ? 'Actualizar jugador' : 'Añadir jugador'}
          </Button>
        </div>
        <div className="space-y-2">
          {team.lineup.map((player, index) => (
            <div key={index} className="flex justify-between items-center bg-[#2d2b3b] p-2 rounded">
              <span>{index + 1}. {player.name} ({player.position}) #{player.number}</span>
              <div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditPlayer(teamIndex, index)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeletePlayer(teamIndex, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {!isLineupComplete(teamIndex) && (
          <Alert variant="destructive">
            <AlertDescription>
              Necesitas {isDHEnabled ? 10 : 9} jugadores en la alineación.
            </AlertDescription>
          </Alert>
        )}
        {isLineupComplete(teamIndex) && (
          <Button 
            onClick={() => submitLineup(teamIndex)} 
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Submit Lineup
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto pb-4">
      <Card className="bg-[#1a1625] border-[#2d2b3b] text-white">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Lineups de los equipos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="dh-mode"
              checked={isDHEnabled}
              onCheckedChange={setIsDHEnabled}
            />
            <Label htmlFor="dh-mode">Habilitar bateador designado (DH)</Label>
          </div>
          
          {renderTeamLineup(0)}
          {renderTeamLineup(1)}
        </CardContent>
      </Card>
    </div>
  )
}

