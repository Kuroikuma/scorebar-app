import socket from '@/app/service/socket';
import { useGameStore } from '@/app/store/gameStore'
import { useOverlayStore } from '@/app/store/overlayStore';
import { useTeamsStore } from '@/app/store/teamsStore';
import { useEffect } from 'react';

interface ISocketData {
  teamIndex: number
  currentBatter: number
}

interface ICurrentBatterProps {
  teamIndex: number
}

const CurrentBatter = ({ teamIndex }: ICurrentBatterProps) => {
  const { getCurrentBatter, id } = useGameStore()
  const currentBatter = getCurrentBatter()

  const { advanceBatter } = useTeamsStore()

  useEffect(() => {
    const eventName = `server:AdvanceBatter/${id}/${teamIndex}`
    
    const refreshLineup = (socketData: ISocketData) => {
      if (socketData.teamIndex === teamIndex) {
        advanceBatter(socketData.teamIndex, false)
      }
    }

    socket.on(eventName, refreshLineup)

    return () => {
      socket.off(eventName, refreshLineup)
    }
  }, [ id ])

  return (
    <div className="px-4 flex items-center border-r border-white/20 min-w-[120px]">
      {currentBatter && (
        <div className="text-sm">
          <span className="font-bold mr-2 text-2xl">
           {currentBatter.number}. {currentBatter.name.split(' ').pop()?.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}

export default CurrentBatter
