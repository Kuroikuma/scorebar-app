import { cn } from '@/app/lib/utils'
import OutsCircle from './OutsCircle'
import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'

export function BaseRunner() {

  const { bases, isTopInning } = useGameStore()

  const { teams } = useTeamsStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color

  return (
    <div
      style={{
        clipPath: 'polygon(100% 0, 100% 100%, 35% 100%, 0 65%, 0 0)',
      }}
      className="grid grid-cols-2 grid-rows-2 gap-1 w-[80px] h-[80px] translate-y-[-26%]  -rotate-45 bg-[#2d2b3b] p-1 drop-shadow-2xl"
    >
      {/* Second Base */}
      
      {/* Third Base */}
      <div
        className={cn(
          'border-2',
          bases[2].isOccupied ? 'bg-opacity-80' : 'bg-gray-800 border-gray-700'
        )}
        style={{ backgroundColor: bases[2].isOccupied ? currentTeamColor : "white" }}
      />
      <div
        className={cn(
          'border-2',
          bases[1].isOccupied ? 'bg-opacity-80' : 'bg-gray-800 border-gray-700'
        )}
        style={{ backgroundColor: bases[1].isOccupied ? currentTeamColor : "white" }}
      />
      {/* First Base */}
      <div
        className={cn(
          'border-2 col-start-2 row-start-2',
          bases[0].isOccupied ? 'bg-opacity-80' : 'bg-gray-800 border-gray-700'
        )}
        style={{ backgroundColor: bases[0].isOccupied ? currentTeamColor : "white" }}
      />
      <OutsCircle />
    </div>
  )
}
