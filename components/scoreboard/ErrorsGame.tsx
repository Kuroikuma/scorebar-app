import socket from '@/app/service/socket';
import { useGameStore } from '@/app/store/gameStore';
import { useOverlayStore } from '@/app/store/overlayStore';
import { Team } from '@/app/store/teamsStore'
import { useEffect } from 'react';

interface ErrorsGameProps {
  team: Team
}

interface ISocketErrorsGame {
  errors: number
  teamIndex: number
}

export function ErrorsGame({ team }: ErrorsGameProps) {

  const { id } = useGameStore()

  const { changeErrorsGameOverlay } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:errorsCount/${id}`
    
    const refreshErrorsGameOverlay = (socketData: ISocketErrorsGame) => {
      changeErrorsGameOverlay(socketData.errors, socketData.teamIndex)
    }

    socket.on(eventName, refreshErrorsGameOverlay)

    return () => {
      socket.off(eventName, refreshErrorsGameOverlay)
    }
  }, [ id ])

  return (
    <td className="px-3 py-2 text-center font-bold bg-[#4c3f82]">
      {team.errorsGame}
    </td>
  )
}
