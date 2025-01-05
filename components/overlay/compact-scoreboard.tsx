"use client"

import { useGameStore } from "@/app/store/gameStore"
import { useTeamsStore } from "@/app/store/teamsStore"

export function CompactScoreboard() {
  const { inning, isTopInning, balls, strikes, outs } = useGameStore()
  const { teams } = useTeamsStore()

  return (
    <div className="bg-black/80 text-white p-4 rounded-lg shadow-lg min-w-[200px]">
      <div className="grid grid-cols-2 gap-4">
        {teams.map((team, index) => (
          <div key={team.name} className="flex justify-between items-center">
            <span className="font-bold">{team.name}</span>
            <span className="text-xl">{team.runs}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm mt-2">
        <span>{isTopInning ? "▲" : "▼"} {inning}</span>
        <span>{balls}-{strikes}</span>
        <span>{outs} OUT</span>
      </div>
    </div>
  )
}

