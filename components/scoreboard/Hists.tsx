import socket from "@/app/service/socket";
import { useGameStore } from "@/app/store/gameStore";
import { useOverlayStore } from "@/app/store/overlayStore";
import { useEffect } from "react";

interface HitsProps {
  hits: number
}

interface ISocketHits {
  hits: number
  teamIndex: number
}

export function Hits({ hits }: HitsProps) {

  const { id } = useGameStore()

  const { changeHitsCountOverlay } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:hitsCount/${id}`
    
    const refreshHitsCountOverlay = (socketData: ISocketHits) => {
      changeHitsCountOverlay(socketData.hits, socketData.teamIndex)
    }

    socket.on(eventName, refreshHitsCountOverlay)

    return () => {
      socket.off(eventName, refreshHitsCountOverlay)
    }
  }, [ id ])
  return (
    <td className="px-3 py-2 text-center font-bold bg-[#4c3f82]">{hits}</td>
  )
}
