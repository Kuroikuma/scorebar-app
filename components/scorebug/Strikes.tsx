import { useGameStore } from "@/app/store/gameStore"
import AnimatePopLayout from "../ui/AnimatePopLayout"
import { useOverlayStore } from "@/app/store/overlayStore";
import { useEffect } from "react";
import socket from "@/app/service/socket";

interface ISocketStrikes {
  strikes: number;
  socketId: string
}

export function Strikes() {
  const { strikes, id } = useGameStore()

  const { changeStrikesCountOveraly } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:strikeCount/${id}`
    
    const updateStrikes = (socketData: ISocketStrikes) => {
      if (socketData.socketId !== socket.id) {
        changeStrikesCountOveraly(socketData.strikes)
      }
    }

    socket.on(eventName, updateStrikes)

    return () => {
      socket.off(eventName, updateStrikes)
    }
  }, [ id ])

  return <AnimatePopLayout dataNumber={strikes}>{strikes}</AnimatePopLayout>
}