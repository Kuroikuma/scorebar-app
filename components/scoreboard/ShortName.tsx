import socket from '@/app/service/socket';
import { useGameStore } from '@/app/store/gameStore';
import { useOverlayStore } from '@/app/store/overlayStore';
import { Team } from '@/app/store/teamsStore'
import { useEffect } from 'react';

interface ShortNameProps {
  team: Team
  classes?: string
}

interface ISocketShortName {
  shortName: string
  teamIndex: number
}

export function ShortName({ team, classes = "" }: ShortNameProps) {

  const { id } = useGameStore()

  const { changeShortNameOverlay } = useOverlayStore();

  useEffect(() => {
    const eventName = `server:teamShortName/${id}`
    
    const updateShortNameOverlay = (socketData: ISocketShortName) => {
      changeShortNameOverlay(socketData.shortName, socketData.teamIndex)
    }

    socket.on(eventName, updateShortNameOverlay)

    return () => {
      socket.off(eventName, updateShortNameOverlay)
    }
  }, [ id ])

  return <div className={`font-bold ${classes}`}>{team.shortName}</div>
}
