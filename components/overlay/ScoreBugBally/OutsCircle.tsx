import socket from '@/app/service/socket'
import { useGameStore } from '@/app/store/gameStore'
import { useOverlayStore } from '@/app/store/overlayStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { useEffect } from 'react'

interface ISocketOut {
  outs: number;
  strikes: number;
  balls: number;
}

const OutsCircle = () => {
  const { isTopInning, outs, id } = useGameStore()

  const { teams } = useTeamsStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color

  const { changeOutCountOverlay } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:outCount/${id}`
    
    const updateOuts = (socketData: ISocketOut) => {
      changeOutCountOverlay(socketData.outs, socketData.strikes, socketData.balls)
    }

    socket.on(eventName, updateOuts)

    return () => {
      socket.off(eventName, updateOuts)
    }
  }, [ id ])

  return (
    <div className="col-start-1 row-start-2 flex items-center translate-x-[-2%] translate-y-[-12%] rotate-45">
      <div className="flex gap-1">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            style={{
              backgroundColor: index < outs ? currentTeamColor : 'white',
            }}
            className={`w-3 h-3 rounded-full border border-white ${
              index < outs ? 'bg-transparent' : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default OutsCircle
