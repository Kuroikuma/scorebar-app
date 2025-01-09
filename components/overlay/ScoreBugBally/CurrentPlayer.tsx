import { useGameStore } from '@/app/store/gameStore'
import CurrentBatter from './CurrentBatter'
import CurrentPitcher from './CurrentPitcher'
import { darkenColor } from '@/app/lib/utils'
import { useEffect } from 'react'
import socket from '@/app/service/socket'
import { useOverlayStore } from '@/app/store/overlayStore'
import { Player } from '@/app/store/teamsStore'

interface CurrentPlayerProps {
  teamIndex: number
  color: string
}

interface ISocketData {
  teamIndex: number
  lineup: Player[]
  lineupSubmitted: boolean
}

const CurrentPlayer = ({ teamIndex, color }: CurrentPlayerProps) => {
  const { isTopInning, id } = useGameStore()

  const { changeLineupOverlay } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:updateLineupTeam/${id}`
    
    const refreshLineup = (socketData: ISocketData) => {
      if (socketData.teamIndex === teamIndex) {
        changeLineupOverlay(socketData.teamIndex, socketData.lineup, socketData.lineupSubmitted)
      }
    }

    socket.on(eventName, refreshLineup)

    return () => {
      socket.off(eventName, refreshLineup)
    }
  }, [ id ])

  return (
    <div className='px-[6px] pt-[6px]'>
      <div className='border-x-4 border-t-4 border-white' style={{ backgroundColor: darkenColor(color, 50) }}>
      {teamIndex === 0 ? (
        isTopInning ? (
          <CurrentBatter teamIndex={teamIndex} />
        ) : (
          <CurrentPitcher />
        )
      ) : isTopInning ? (
        <CurrentPitcher />
      ) : (
        <CurrentBatter teamIndex={teamIndex} />
      )}
      </div>
    </div>
  )
}

export default CurrentPlayer
