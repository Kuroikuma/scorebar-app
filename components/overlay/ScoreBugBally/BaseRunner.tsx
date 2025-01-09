import { cn } from '@/app/lib/utils'
import OutsCircle from './OutsCircle'

interface BaseRunnerProps {
  bases: any
  currentTeamColor: any
  outs: any
}

export function BaseRunner({ bases, currentTeamColor, outs }: BaseRunnerProps) {
  return (
    <div
      style={{
        clipPath: 'polygon(100% 0, 100% 100%, 35% 100%, 0 65%, 0 0)',
      }}
      className="grid grid-cols-2 grid-rows-2 gap-1 w-[60px] h-[60px] translate-y-[-26%]  -rotate-45 bg-[#2d2b3b] p-1 drop-shadow-2xl"
    >
      {/* Second Base */}
      <div
        className={cn(
          'border-2',
          bases[1] ? 'bg-opacity-80' : 'bg-gray-800 border-gray-700'
        )}
        style={{ backgroundColor: bases[1] ? currentTeamColor : undefined }}
      />
      {/* Third Base */}
      <div
        className={cn(
          'border-2',
          bases[2] ? 'bg-opacity-80' : 'bg-gray-800 border-gray-700'
        )}
        style={{ backgroundColor: bases[2] ? currentTeamColor : undefined }}
      />
      {/* First Base */}
      <div
        className={cn(
          'border-2 col-start-2 row-start-2',
          bases[0] ? 'bg-opacity-80' : 'bg-gray-800 border-gray-700'
        )}
        style={{ backgroundColor: bases[0] ? currentTeamColor : undefined }}
      />
      <OutsCircle />
    </div>
  )
}
