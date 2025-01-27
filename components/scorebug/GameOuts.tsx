import { useGameStore } from '@/app/store/gameStore'
import AnimatePopLayout from '../ui/AnimatePopLayout'
import { useOverlayStore } from '@/app/store/overlayStore';
import { useEffect } from 'react';
import socket from '@/app/service/socket';

interface ISocketOut {
  outs: number;
  strikes: number;
  balls: number;
}

export default function GameOuts() {

  const { outs } = useGameStore()

  const { id } = useGameStore();
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
    <div className="flex items-center">
      <AnimatePopLayout dataNumber={outs}>
        <span className="text-2xl">{outs}</span>
      </AnimatePopLayout>
      <span className="text-2xl ml-2">OUTS</span>
    </div>
  )
}
