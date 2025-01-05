"use client"

import { useTeamsStore } from "@/app/store/teamsStore"
import { useGameStore } from "@/app/store/gameStore"

interface PositionNode {
  position: string
  x: number
  y: number
  rotation?: number
}

const positions: PositionNode[] = [
  { position: "LF", x: 20, y: 15, rotation: -25 },
  { position: "CF", x: 50, y: 10 },
  { position: "RF", x: 80, y: 15, rotation: 25 },
  { position: "3B", x: 25, y: 40, rotation: -15 },
  { position: "SS", x: 35, y: 35 },
  { position: "2B", x: 65, y: 35 },
  { position: "1B", x: 75, y: 40, rotation: 15 },
  { position: "P", x: 50, y: 45 },
  { position: "C", x: 50, y: 75 }
]

export function FieldLineup() {
  const { teams } = useTeamsStore()
  const { isTopInning } = useGameStore()
  const currentTeam = teams[isTopInning ? 1 : 0] // Show fielding team

  return (
    <div className="w-[400px] aspect-[4/3] bg-[#1a472a] rounded-lg p-4 shadow-lg relative">
      {/* Infield dirt */}
      <div className="absolute inset-[15%] bg-[#b87a41] rounded-[50%]" />
      
      {/* Infield grass */}
      <div className="absolute inset-[25%] bg-[#1a472a] rounded-[50%]" />
      
      {/* Base lines */}
      <div className="absolute left-1/2 top-[75%] w-[40%] h-[1px] bg-white -translate-x-1/2 origin-center -rotate-45" />
      <div className="absolute left-1/2 top-[75%] w-[40%] h-[1px] bg-white -translate-x-1/2 origin-center rotate-45" />
      
      {/* Home plate */}
      <div className="absolute left-1/2 bottom-[25%] w-3 h-3 bg-white -translate-x-1/2 rotate-45" />

      {/* Bases */}
      <div className="absolute left-1/2 top-[35%] w-3 h-3 bg-white -translate-x-1/2 rotate-45" /> {/* Second */}
      <div className="absolute left-[35%] top-[55%] w-3 h-3 bg-white -translate-x-1/2 rotate-45" /> {/* Third */}
      <div className="absolute left-[65%] top-[55%] w-3 h-3 bg-white -translate-x-1/2 rotate-45" /> {/* First */}

      {/* Position markers with player names */}
      {positions.map((pos) => {
        const player = currentTeam.lineup.find(p => p.position === pos.position)
        return (
          <div
            key={pos.position}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `translate(-50%, -50%) ${pos.rotation ? `rotate(${pos.rotation}deg)` : ''}`
            }}
          >
            <div className="text-white font-bold mb-1">{pos.position}</div>
            {player && (
              <div className="bg-black/50 text-white text-xs p-1 rounded whitespace-nowrap">
                {player.name} #{player.number}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

