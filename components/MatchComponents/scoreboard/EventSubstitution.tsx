import { useEventStore } from '@/matchStore/useEvent'
import { useTeamStore } from '@/matchStore/useTeam'
import { useTimeStore } from '@/matchStore/useTime'
import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SubstitutionFootball } from '@/matchStore/interfaces'
import { formatName } from '@/app/utils/cropImage'
import socket from '@/app/service/socket'
import { useOverlaysStore } from '@/matchStore/overlayStore'
import { useMatchStore } from '@/matchStore/matchStore'
import { AnimatePresence, motion } from 'framer-motion'

interface IEventSubstitution extends SubstitutionFootball {
  logo: string
}

export const EventSubstitution = () => {
  const { homeTeam, awayTeam } = useTeamStore()
  const { substitutions } = useEventStore()
  const [notification, setNotification] = useState<IEventSubstitution | null>(
    null
  )
  const { id: matchId } = useMatchStore()
  const { addSubstitutionOverlay } = useOverlaysStore()

  useEffect(() => {
    socket.on(
      `server:AddSubstitution/${matchId}`,
      (data: SubstitutionFootball) => {
        addSubstitutionOverlay(data)
      }
    )

    return () => {
      socket.off(`server:AddSubstitution/${matchId}`)
    }
  }, [matchId, addSubstitutionOverlay])

  useEffect(() => {
    if (substitutions.length > 0) {
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
        setTimeout(() => {
          setNotification(null)
        }, 10000)
      }
    }
  }, [substitutions])

  return (
    <div className="w-full overflow-hidden">
      <AnimatePresence>
        {notification && (
          <div className="relative flex w-full font-['Roboto_Condensed']">
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ duration: 1 }}
              className="absolute -top-[2px] left-0 right-0 h-[2px]"
              style={{
                background: 'linear-gradient(90deg, #0534da 0%, #4bded8 100%)',
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className=" text-xl font-bold absolute top-0 -left-0 flex items-center h-[100%]"
            >
              <img
                src={notification.logo}
                alt="Logo"
                className="h-16 w-full object-contain"
              />
            </motion.div>

            <div className="flex flex-col h-[100%] w-full">
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 1 }}
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
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '-100%' }}
                transition={{ duration: 1 }}
                className="h-[50%] bg-[rgba(0,7,85,.8)] w-full flex justify-between items-center pl-[20%] pr-2"
              >
                <span className="text-white text-2xl font-bold">
                  {notification.playerOutId}
                </span>
                <ChevronDown
                  strokeWidth={4}
                  className="h-8 w-8 font-bold text-red-600 "
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default IEventSubstitution
