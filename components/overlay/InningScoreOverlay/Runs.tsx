import { cn } from '@/app/lib/utils'
import socket from '@/app/service/socket'
import { useGameStore } from '@/app/store/gameStore'
import { useOverlayStore } from '@/app/store/overlayStore'
import { Team } from '@/app/store/teamsStore'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'

interface InninScoreOverlayProps {
  index: number
  isTopInning: boolean
  team: Team
}

interface ISocketRuns {
  teamIndex: number
  runs: number
  runsInning: number
}

export function Runs({ index, isTopInning, team }: InninScoreOverlayProps) {
  const { id } = useGameStore()
  const { incrementRunsOverlay } = useOverlayStore()

  useEffect(() => {
    const eventName = `server:scoreRun/${id}`

    const updateRuns = (socketData: ISocketRuns) => {
      incrementRunsOverlay(
        socketData.teamIndex,
        socketData.runs,
        socketData.runsInning
      )
    }

    socket.on(eventName, updateRuns)

    return () => {
      socket.off(eventName, updateRuns)
    }
  }, [id])

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
