'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { useTimeStore } from '@/matchStore/useTime'
import { useTeamStore } from '@/matchStore/useTeam'
import { useEventStore } from '@/matchStore/useEvent'
import { TeamRole } from '@/matchStore/interfaces'
import { ScrollArea } from '../ui/scroll-area'

export function TabMatchEvents() {

  const { time } = useTimeStore()
  const { homeTeam, awayTeam } = useTeamStore()
  const { addEvent, events, removeEvent, addSubstitution,  removeSubstitution, substitutions } = useEventStore()

  const [selectedTeam, setSelectedTeam] = useState<TeamRole>('home')
  const [eventType, setEventType] = useState<
    'goal' | 'yellowCard' | 'redCard' | 'substitution'
  >('goal')
  const [playerOutId, setPlayerOutId] = useState('')
  const [playerInId, setPlayerInId] = useState('')
  const [selectedPlayerId, setSelectedPlayerId] = useState('')

  const handleAddEvent = () => {
    if (eventType === 'substitution') {
      if (playerOutId && playerInId) {
        addSubstitution({
          minute: time.minutes,
          teamId: selectedTeam,
          playerOutId,
          playerInId,
        })
        setPlayerOutId('')
        setPlayerInId('')
      }
    } else {
      if (selectedPlayerId) {
        addEvent({
          type: eventType,
          teamId: selectedTeam,
          playerId: selectedPlayerId,
          minute: time.minutes,
        })
        setSelectedPlayerId('')
      }
    }
  }

  const getPlayerName = (teamId: TeamRole, playerId: string) => {
    const team = teamId === 'home' ? homeTeam : awayTeam
    const player = team.players.find((p) => p.id === playerId)
    return player ? `${player.name} (${player.number})` : 'Unknown Player'
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'goal':
        return '⚽'
      case 'yellowCard':
        return '🟨'
      case 'redCard':
        return '🟥'
      case 'substitution':
        return '🔄'
      default:
        return '•'
    }
  }

  return (
    <TabsContent value="match-events" className="p-4 space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Team</Label>
            <Select
              value={selectedTeam}
              onValueChange={(value: TeamRole) => setSelectedTeam(value)}
            >
              <SelectTrigger className="bg-[#2a2438]">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">{homeTeam.name}</SelectItem>
                <SelectItem value="away">{awayTeam.name}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Event Type</Label>
            <Select
              value={eventType}
              onValueChange={(
                value: 'goal' | 'yellowCard' | 'redCard' | 'substitution'
              ) => setEventType(value)}
            >
              <SelectTrigger className="bg-[#2a2438]">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="goal">Goal</SelectItem>
                <SelectItem value="yellowCard">Yellow Card</SelectItem>
                <SelectItem value="redCard">Red Card</SelectItem>
                <SelectItem value="substitution">Substitution</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {eventType === 'substitution' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Player Out</Label>
              <Select value={playerOutId} onValueChange={setPlayerOutId}>
                <SelectTrigger className="bg-[#2a2438]">
                  <SelectValue placeholder="Select player out" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedTeam === 'home' ? homeTeam : awayTeam).players.map(
                    (player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} ({player.number})
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Player In</Label>
              <Select value={playerInId} onValueChange={setPlayerInId}>
                <SelectTrigger className="bg-[#2a2438]">
                  <SelectValue placeholder="Select player in" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedTeam === 'home' ? homeTeam : awayTeam).players.map(
                    (player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} ({player.number})
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div>
            <Label>Player</Label>
            <Select
              value={selectedPlayerId}
              onValueChange={setSelectedPlayerId}
            >
              <SelectTrigger className="bg-[#2a2438]">
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent>
                {(selectedTeam === 'home' ? homeTeam : awayTeam).players.map(
                  (player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name} ({player.number})
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={handleAddEvent}
          className="w-full bg-[#ff5722] hover:bg-[#ff5722]/90"
        >
          Add Event
        </Button>

        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-4 space-y-2">
            {[...events, ...substitutions]
              .sort((a, b) => b.minute - a.minute)
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span>{event.minute}'</span>
                    <span>
                      {getEventIcon(
                        'type' in event ? event.type : 'substitution'
                      )}
                    </span>
                    {'type' in event ? (
                      <span>{getPlayerName(event.teamId, event.playerId)}</span>
                    ) : (
                      <span>
                        {getPlayerName(event.teamId, event.playerOutId)} ➡️{' '}
                        {getPlayerName(event.teamId, event.playerInId)}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      'type' in event
                        ? removeEvent(event.id)
                        : removeSubstitution(event.id)
                    }
                    className="hover:bg-[#2a2438]"
                  >
                    ✕
                  </Button>
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </TabsContent>
  )
}
