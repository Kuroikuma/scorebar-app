import Image from 'next/image'
import { Triangle } from 'lucide-react'
import { cn } from "@/app/lib/utils"
import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { useUIStore } from '@/app/store/uiStore'


export function ModernScoreboard() {
  const { inning, isTopInning, balls, strikes, outs, bases } = useGameStore()
  const { teams } = useTeamsStore()
  const { primaryColor, primaryTextColor } = useUIStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color;

  return (
    <div style={{ backgroundColor: primaryColor, color: primaryTextColor }} className="p-4 rounded-lg shadow-lg">
      {/* Teams and Scores */}
      <div className="flex justify-between mb-4">
        {teams.map((team) => (
          <div
            key={team.name}
            style={{ backgroundColor: team.color, color: team.textColor }}
            className="flex flex-col items-center p-2 rounded-md"
          >
            {team.logo && (
              <div className="relative w-12 h-12 mb-2">
                <Image
                  src={team.logo}
                  alt={`${team.name} logo`}
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            )}
            <span className="text-xl font-bold">{team.name}</span>
            <span className="text-4xl font-bold">{team.runs}</span>
          </div>
        ))}
      </div>

      {/* Game Info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Triangle
            className={cn(
              "h-6 w-6 transform",
              isTopInning ? "" : "rotate-180"
            )}
            fill={currentTeamColor}
          />
          <span className="text-2xl font-bold">{inning}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-sm">OUTS</span>
            <span className="text-2xl font-bold">{outs}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm">COUNT</span>
            <span className="text-2xl font-bold">{balls}-{strikes}</span>
          </div>
        </div>
      </div>

      {/* Bases */}
      <div className="relative w-32 h-32 mx-auto my-4">
        {/* Second Base */}
        <div 
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 transform rotate-45 border-2",
            bases[1].isOccupied ? "bg-opacity-80" : "bg-gray-800 border-gray-700"
          )}
          style={{ backgroundColor: bases[1].isOccupied ? currentTeamColor : undefined }}
        />
        {/* Third Base */}
        <div 
          className={cn(
            "absolute top-1/2 left-0 -translate-y-1/2 w-12 h-12 transform rotate-45 border-2",
            bases[2].isOccupied ? "bg-opacity-80" : "bg-gray-800 border-gray-700"
          )}
          style={{ backgroundColor: bases[2].isOccupied ? currentTeamColor : undefined }}
        />
        {/* First Base */}
        <div 
          className={cn(
            "absolute top-1/2 right-0 -translate-y-1/2 w-12 h-12 transform rotate-45 border-2",
            bases[0].isOccupied ? "bg-opacity-80" : "bg-gray-800 border-gray-700"
          )}
          style={{ backgroundColor: bases[0].isOccupied ? currentTeamColor : undefined }}
        />
      </div>
    </div>
  )
}

