import socket from "@/app/service/socket";
import { useGameStore } from "@/app/store/gameStore";
import { useOverlayStore } from "@/app/store/overlayStore";
import { useEffect } from "react";

interface TeamNameProps {
  name: string
}

interface ISocketTeamName {
  name: string
  teamIndex: number
}

const TeamName = ({ name }: TeamNameProps) => {

  const { id } = useGameStore()

  const { changeTeamNameOverlay } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:teamName/${id}`
    
    const modifyTeamName = (socketData: ISocketTeamName) => {
        changeTeamNameOverlay(socketData.teamIndex, socketData.name)
    }

    socket.on(eventName, modifyTeamName)

    return () => {
      socket.off(eventName, modifyTeamName)
    }
  }, [ id ])
  return (
    <div className="py-3">
      <span className="text-3xl font-bold tracking-wider">{name}</span>
    </div>
  )
}

export default TeamName
