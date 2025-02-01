import { formatName } from '@/lib/utils'
import { useEventStore } from '@/matchStore/useEvent'
import { useTeamStore } from '@/matchStore/useTeam'
import { useTimeStore } from '@/matchStore/useTime'
import { useState, useEffect } from 'react'
import { EventNotification } from './EventMatch'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SubstitutionFootball } from '@/matchStore/interfaces'

interface IEventSubstitution extends SubstitutionFootball {
  logo: string
}

export const EventSubstitution = () => {
  const { homeTeam, awayTeam } = useTeamStore()
  const { time, period } = useTimeStore()
  const { events, substitutions } = useEventStore()
  const [notification, setNotification] = useState<IEventSubstitution | null>(
    null
  )

  useEffect(() => {
    if (events.length > 0) {
      const latestEvent = substitutions[substitutions.length - 1]

      const team = latestEvent.teamId === 'home' ? homeTeam : awayTeam

      const substitute = team.players.find(
        (p) => p.id === latestEvent.playerInId
      )
      const replacement = team.players.find(
        (p) => p.id === latestEvent.playerOutId
      )

      if (substitute && replacement) {
        const notification: IEventSubstitution = {
          id: latestEvent.id,
          minute: latestEvent.minute,
          teamId: latestEvent.teamId,
          playerOutId: formatName(replacement.name),
          playerInId: formatName(substitute.name),
          logo: team.logo ?? '/placeholder.svg',
        }

        setNotification(notification)

        // Remove notification after 5 seconds
        // setTimeout(() => {
        //   setNotification(null)
        // }, 5000)
      }
    }
  }, [events, homeTeam, awayTeam])

  if (!notification) return <></>

  return (
    <div className="relative flex w-full font-['Roboto_Condensed']">
      <div
        className="absolute -top-[2px] left-0 right-0 h-[2px]"
        style={{
          background: 'linear-gradient(90deg, #0534da 0%, #4bded8 100%)',
        }}
      ></div>
      <div className=" text-xl font-bold absolute top-0 -left-0 flex items-center h-[100%]">
        <img
          src="/logoEquipo.png"
          alt="Logo"
          className="h-16 w-full object-contain"
        />
      </div>
      <div className="flex flex-col h-[100%] w-full">
        <div
          className="h-[50%] w-full flex justify-between items-center pl-[20%] pr-2"
          style={{
            background: `linear-gradient(to right, rgb(32, 0, 199) 0%, rgb(14, 0, 95) 40%, rgb(14, 0, 95) 60%, rgb(32, 0, 199) 100%)`,
          }}
        >
          <span className="text-white text-center text-2xl font-bold">
            {notification.playerInId}
          </span>
          <ChevronUp
            strokeWidth={4}
            className="h-8 w-8 font-bold text-green-400 "
          />
        </div>
        <div className="h-[50%] bg-[rgba(0,7,85,.8)] w-full flex justify-between items-center pl-[20%] pr-2">
          <span className="text-white text-2xl font-bold">
            {notification.playerOutId}
          </span>
          <ChevronDown
            strokeWidth={4}
            className="h-8 w-8 font-bold text-red-600 "
          />
        </div>
      </div>
    </div>
  )
}

export default IEventSubstitution
