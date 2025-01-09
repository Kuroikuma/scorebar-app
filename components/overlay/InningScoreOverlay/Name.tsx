import socket from "@/app/service/socket"
import { useGameStore } from "@/app/store/gameStore"
import { useOverlayStore } from "@/app/store/overlayStore"
import { Team } from "@/app/store/teamsStore"
import { useEffect } from "react"

interface NameProps {
  team: Team
}

interface ISocketTeamName {
  name: string
  teamIndex: number
}

export function Name({ team }: NameProps) {

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
    <div className="py-4 text-2xl font-bold text-center tracking-wide">
      {team.name}
    </div>
  )
}
