import { cn } from '@/app/lib/utils'
import socket from '@/app/service/socket'
import { useGameStore } from '@/app/store/gameStore'
import { useOverlayStore } from '@/app/store/overlayStore'
import { Team } from '@/app/store/teamsStore'
import { useEffect } from 'react'

interface ShortNameProps {
  index: number
  team: Team
}

interface ISocketShortName {
  shortName: string
  teamIndex: number
}

export function ShortName({ index, team }: ShortNameProps) {
  const { id } = useGameStore()

  const { changeShortNameOverlay } = useOverlayStore()

  useEffect(() => {
    const eventName = `server:teamShortName/${id}`

    const updateShortNameOverlay = (socketData: ISocketShortName) => {
      changeShortNameOverlay(socketData.shortName, socketData.teamIndex)
    }

    socket.on(eventName, updateShortNameOverlay)

    return () => {
      socket.off(eventName, updateShortNameOverlay)
    }
  }, [id])

  return (
    <div
      className={cn(
        'bg-gradient-to-r  py-3 text-xl font-bold text-center tracking-wide relative overflow-hidden',
        index === 0
          ? 'from-[#001845] to-[#00205B]'
          : 'from-[#00205B] to-[#001845]'
      )}
    >
      <div className="absolute inset-0 pattern-overlay" />
      <span className="relative">{team.shortName}</span>
    </div>
  )
}
