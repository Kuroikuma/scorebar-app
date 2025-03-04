import { cn } from '@/app/lib/utils'
import { Team } from '@/app/store/teamsStore'
import { AnimatePresence, motion } from 'framer-motion'

interface InninScoreOverlayProps {
  index: number
  isTopInning: boolean
  team: Team
}


export function Runs({ index, isTopInning, team }: InninScoreOverlayProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br flex items-center justify-center relative overflow-hidden',
        index === (isTopInning ? 0 : 1)
          ? 'from-[#C8AA37] to-[#AA8C27]'
          : 'from-[#1A1A1A] to-black'
      )}
    >
      <div className="absolute inset-0 pattern-overlay" />
      <AnimatePresence mode="wait">
        <motion.span
          key={team.runs}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="text-8xl font-bold"
          style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
        >
          {team.runs}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
