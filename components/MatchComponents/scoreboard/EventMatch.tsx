import { useEffect, useRef, useState } from 'react'
import { useEventStore } from '@/matchStore/useEvent'
import { useTeamStore } from '@/matchStore/useTeam'
import { useTimeStore } from '@/matchStore/useTime'
import { CardPlayers } from './CardsPlayers'
import IEventSubstitution from './EventSubstitution'
import { formatName } from '@/app/utils/cropImage'
import { AnimatePresence } from 'framer-motion'

export interface EventNotification {
  type: 'yellowCard' | 'redCard' | 'substitution'
  minute: number
  logo: string
  playerName: string
  substitute?: string
  replacement?: string
  id: string
}

export function EventMatch() {
  const { homeTeam, awayTeam } = useTeamStore()
  const { time, period } = useTimeStore()
  const { events } = useEventStore()
  const [notification, setNotification] = useState<EventNotification | null>(
    null
  )

  const lastEventId = useRef<string | null>(null); // Guarda el último evento mostrado
  const isFirstRender = useRef(true); // Evita mostrar en el primer render

  useEffect(() => {

    if (isFirstRender.current) {
      isFirstRender.current = false; // Evita ejecución en el primer render
      return;
    }

    if (events.length === 0) return; // No hay eventos, no hacer nada

    const latestEvent = events[events.length - 1];

    if (latestEvent.id !== lastEventId.current) {

      lastEventId.current = latestEvent.id; // Guardar el ID para evitar duplicados

      if (latestEvent.type === 'yellowCard' || latestEvent.type === 'redCard') {
        const team = latestEvent.teamId === 'home' ? homeTeam : awayTeam
        const player = team.players.find((p) => p.id === latestEvent.playerId)

        if (player) {
          const notification: EventNotification = {
            type: latestEvent.type,
            minute: latestEvent.minute,
            logo: team.logo ?? '/placeholder.svg',
            playerName: formatName(player.name),
            id: latestEvent.id,
          }

          setNotification(notification)

          // Remove notification after 10 seconds
          setTimeout(() => {
            setNotification(null)
          }, 10000)
        }
      }
    }
  }, [events])

  return (
    <div className="w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {notification && <CardPlayers notification={notification} />}
      </AnimatePresence>
    </div>
  )
}
