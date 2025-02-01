import { useEffect, useState } from 'react'
import { useEventStore } from '@/matchStore/useEvent'
import { useTeamStore } from '@/matchStore/useTeam'
import { useTimeStore } from '@/matchStore/useTime'
import { CardPlayers } from './CardsPlayers'
import IEventSubstitution from './EventSubstitution'
import { formatName } from '@/lib/utils'

export interface EventNotification {
  type: 'yellowCard' | 'redCard' | 'substitution'
  minute: number
  logo: string
  playerName: string
  substitute?: string
  replacement?: string
}

export function EventMatch() {
  const { homeTeam, awayTeam } = useTeamStore()
  const { time, period } = useTimeStore()
  const { events } = useEventStore()
  const [notification, setNotification] = useState<EventNotification | null>(
    null
  )

  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = events[events.length - 1]

      if (
        latestEvent.type === 'yellowCard' ||
        latestEvent.type === 'redCard' ||
        latestEvent.type === 'substitution'
      ) {
        const team = latestEvent.teamId === 'home' ? homeTeam : awayTeam
        const player = team.players.find((p) => p.id === latestEvent.playerId)

        const substitute = team.players.find(
          (p) => p.id === latestEvent.assistById
        )
        const replacement = team.players.find(
          (p) => p.id === latestEvent.replacedById
        )

        if (player) {
          const notification: EventNotification = {
            type: latestEvent.type,
            minute: latestEvent.minute,
            logo: team.logo ?? '/placeholder.svg',
            playerName: formatName(player.name),
          }

          if (latestEvent.type === 'substitution') {
            notification.substitute = formatName(substitute.name)
            notification.replacement = formatName(replacement.name)
          }

          setNotification(notification)

          // Remove notification after 5 seconds
          // setTimeout(() => {
          //   setNotification(null)
          // }, 5000)
        }
      }
    }
  }, [events, homeTeam, awayTeam])

  return notification && <CardPlayers notification={notification} />
}
