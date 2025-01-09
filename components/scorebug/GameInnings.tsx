import { cn } from '@/app/lib/utils'
import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { Triangle } from 'lucide-react'
import AnimatePopLayout from '../ui/AnimatePopLayout'
import { useEffect } from 'react'
import { useOverlayStore } from '@/app/store/overlayStore'
import socket from '@/app/service/socket'

export interface ISocketData {
  inning: number
  isTopInning: boolean
  balls: number
  strikes: number
  outs: number
  bases: boolean[]
}

const GameInnings = () => {
  const { inning, isTopInning, id } = useGameStore()
  const { teams } = useTeamsStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color

  const { changeInningCountOverlay } = useOverlayStore()

  useEffect(() => {
    const eventName = `server:inning/${id}`

    const updateInningCountOverlay = (socketData: ISocketData) => {
      changeInningCountOverlay(socketData)
    }

    socket.on(eventName, updateInningCountOverlay)

    return () => {
      socket.off(eventName, updateInningCountOverlay)
    }
  }, [id])

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
