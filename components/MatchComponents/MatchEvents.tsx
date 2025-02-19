"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTimeStore } from "@/matchStore/useTime"
import { useTeamStore } from "@/matchStore/useTeam"
import { useEventStore } from "@/matchStore/useEvent"
import { TeamRole } from "@/matchStore/interfaces"

export function MatchEvents() {

  const { time } = useTimeStore()
  const { homeTeam, awayTeam } = useTeamStore()
  const { addEvent, events, removeEvent } = useEventStore()

  const handleAddEvent = (type: "goal" | "yellowCard" | "redCard", teamId:TeamRole, playerId: string) => {
    addEvent({
      type,
      teamId,
      playerId,
      minute: time.minutes,
    })
  }

  const getPlayerName = (teamId: TeamRole, playerId: string) => {
    const team = teamId === "home" ? homeTeam : awayTeam
    const player = team.players.find((p) => p.id === playerId)
    return player ? `${player.name} (${player.number})` : "Unknown Player"
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return "⚽"
      case "yellowCard":
        return "🟨"
      case "redCard":
        return "🟥"
      case "substitution":
        return "🔄"
      default:
        return "•"
    }
  }

  return (
    <Card className="bg-[#1a1625]">
      <CardHeader>
        <CardTitle>Match Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {["home", "away"].map((teamId) => (
              <div key={teamId} className="space-y-2">
                <h3 className="font-semibold">{teamId === "home" ? homeTeam.name : awayTeam.name}</h3>
                <Select onValueChange={(playerId) => handleAddEvent("goal", teamId as TeamRole, playerId)}>
                  <SelectTrigger className="bg-[#2a2438]">
                    <SelectValue placeholder="Add Goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {(teamId === "home" ? homeTeam : awayTeam).players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} ({player.number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(playerId) => handleAddEvent("yellowCard", teamId as TeamRole, playerId)}>
                  <SelectTrigger className="bg-[#2a2438]">
                    <SelectValue placeholder="Add Yellow Card" />
                  </SelectTrigger>
                  <SelectContent>
                    {(teamId === "home" ? homeTeam : awayTeam).players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} ({player.number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(playerId) => handleAddEvent("redCard", teamId as TeamRole, playerId)}>
                  <SelectTrigger className="bg-[#2a2438]">
                    <SelectValue placeholder="Add Red Card" />
                  </SelectTrigger>
                  <SelectContent>
                    {(teamId === "home" ? homeTeam : awayTeam).players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name} ({player.number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <ScrollArea className="h-[200px] rounded-md border">
            <div className="p-4 space-y-2">
              {events
                .sort((a, b) => b.minute - a.minute)
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{event.minute}'</span>
                      <span>{getEventIcon(event.type)}</span>
                      <span>{getPlayerName(event.teamId, event.playerId)}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEvent(event.id)}
                      className="hover:bg-[#2a2438]"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}

