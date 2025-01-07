import { cn } from '@/app/lib/utils'
import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { Triangle } from 'lucide-react'
import AnimatePopLayout from '../ui/AnimatePopLayout'

const GameInnings = () => {
  const { inning, isTopInning } = useGameStore()
  const { teams } = useTeamsStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color

  return (
    <div className="flex items-center gap-2">
      <Triangle
        className={cn('h-6 w-6 transform', isTopInning ? '' : 'rotate-180')}
        fill={currentTeamColor}
      />
      <AnimatePopLayout dataNumber={inning}>
        <span className="text-2xl">{inning}</span>
      </AnimatePopLayout>
    </div>
  )
}

export default GameInnings
