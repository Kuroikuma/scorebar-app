import { useGameStore } from "@/app/store/gameStore"
import AnimatePopLayout from "../ui/AnimatePopLayout"
import { useOverlayStore } from "@/app/store/overlayStore";
import { useEffect } from "react";
import socket from "@/app/service/socket";

interface ISocketBalls {
  balls: number;
  socketId: string
}

export function Balls() {
  const { balls, id } = useGameStore()

  const { changeBallsCountOveraly } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:ballCount/${id}`
    
    const updateBalls = (socketData: ISocketBalls) => {
      if (socketData.socketId !== socket.id) {
        changeBallsCountOveraly(socketData.balls)
      }
    }

    socket.on(eventName, updateBalls)

    return () => {
      socket.off(eventName, updateBalls)
    }
  }, [ id ])

  return <AnimatePopLayout dataNumber={balls}>{balls}</AnimatePopLayout>
}