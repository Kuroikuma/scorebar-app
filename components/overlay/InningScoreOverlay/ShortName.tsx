import { cn } from '@/app/lib/utils'
import { Team } from '@/app/store/teamsStore'

interface ShortNameProps {
  index: number
  team: Team
}

export function ShortName({ index, team }: ShortNameProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r  py-3 text-xl font-bold text-center tracking-wide relative overflow-hidden',
        index === 0
          ? 'from-[#001845] to-[#00205B]'
          : 'from-[#00205B] to-[#001845]'
      )}
    >
      <div className="absolute inset-0 pattern-overlay" />
      <span className="relative">{team.shortName}</span>
    </div>
  )
}
