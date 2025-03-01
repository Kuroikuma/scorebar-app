import { cn } from '@/app/lib/utils'
import socket from '@/app/service/socket'
import { useGameStore } from '@/app/store/gameStore'
import { useOverlayStore } from '@/app/store/overlayStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { useEffect } from 'react'

interface ISocketBase {
  baseIndex: number
  isOccupied: boolean
}

export default function Bases() {

  const { isTopInning, bases, id } = useGameStore()
  const { teams } = useTeamsStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color;

  const { changeBasesRunnersOverlay } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:baseRunner/${id}`
    
    const updateBaseRunners = (socketData: ISocketBase) => {
      changeBasesRunnersOverlay(socketData.baseIndex, socketData.isOccupied)
    }

    socket.on(eventName, updateBaseRunners)

    return () => {
      socket.off(eventName, updateBaseRunners)
    }
  }, [ id ])

  return (
    <div className="relative w-32 h-32 mx-auto flex justify-end">
      {/* Second Base */}
      <div
        className={cn(
          'absolute top-[15%] left-1/2 -translate-x-1/2 w-12 h-12 transform rotate-45 border-2',
          bases[1].isOccupied ? 'bg-opacity-80' : 'bg-gray-800 border-gray-700'
        )}
        style={{ backgroundColor: bases[1].isOccupied ? currentTeamColor : undefined }}
      />
      {/* Third Base */}
      <div
        className={cn(
          'absolute top-[65%] left-0 -translate-y-1/2 w-12 h-12 transform rotate-45 border-2',
          bases[2].isOccupied ? 'bg-opacity-80' : 'bg-gray-800 border-gray-700'
        )}
        style={{ backgroundColor: bases[2].isOccupied ? currentTeamColor : undefined }}
      />
      {/* First Base */}
      <div
        className={cn(
          'absolute top-[65%] right-0 -translate-y-1/2 w-12 h-12 transform rotate-45 border-2',
          bases[0].isOccupied ? 'bg-opacity-80' : 'bg-gray-800 border-gray-700'
        )}
        style={{ backgroundColor: bases[0].isOccupied ? currentTeamColor : undefined }}
      />
    </div>
  )
}
