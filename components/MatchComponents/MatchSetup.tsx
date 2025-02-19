"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTeamStore } from "@/matchStore/useTeam"
import { useTimeStore } from "@/matchStore/useTime"
import { toast } from "sonner"

export default function MatchSetup() {
  const router = useRouter()
  const { homeTeam, awayTeam, updateTeamName } = useTeamStore()
  const { startMatch } = useTimeStore()
  const setHomeTeam = (name: string) => updateTeamName("home", name)
  const setAwayTeam = (name: string) => updateTeamName("away", name)
  const [duration, setDuration] = useState("90")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!homeTeam.name || !awayTeam.name) {
      toast.error("Please enter both team names.")
      return
    }
    // Update the match state with the new team names
    startMatch()
    router.push("/live")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="homeTeam">Home Team</Label>
        <Input
          id="homeTeam"
          value={homeTeam.name}
          onChange={(e) => setHomeTeam(e.target.value)}
          placeholder="Enter home team name"
        />
      </div>
      <div>
        <Label htmlFor="awayTeam">Away Team</Label>
        <Input
          id="awayTeam"
          value={awayTeam.name}
          onChange={(e) => setAwayTeam(e.target.value)}
          placeholder="Enter away team name"
        />
      </div>
      <div>
        <Label htmlFor="duration">Match Duration</Label>
        <Select onValueChange={setDuration} defaultValue={duration}>
          <SelectTrigger>
            <SelectValue placeholder="Select match duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90">90 minutes</SelectItem>
            <SelectItem value="120">120 minutes (with extra time)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Start Match</Button>
    </form>
  )
}

