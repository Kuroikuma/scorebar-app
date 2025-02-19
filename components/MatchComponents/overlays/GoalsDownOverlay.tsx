import GradientText from '@/components/GradiantText'
import { useEventStore } from '@/matchStore/useEvent'
import { useTeamStore } from '@/matchStore/useTeam'
import { useTimeStore } from '@/matchStore/useTime'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, useId, useRef } from 'react'

export interface EventGoal {
  logo: string
  playerName: string
  goalMessage: string
  id: string
}

const GoalsDownOverlay = () => {
  const { homeTeam, awayTeam } = useTeamStore()
  const { time, period } = useTimeStore()
  const { events } = useEventStore()
  const [notification, setNotification] = useState<EventGoal | null>(null)
  const [isWithDelay, setIsWithDelay] = useState(false);

  const lastEventId = useRef<string | null>(null); 

  useEffect(() => {

    if (events.length === 0) return;

    const latestEvent = events[events.length - 1];

    if (latestEvent.id !== lastEventId.current) {
      lastEventId.current = latestEvent.id; 

      if (latestEvent.type === 'goal') {
        const team = latestEvent.teamId === 'home' ? homeTeam : awayTeam
        const player = team.players.find((p) => p.id === latestEvent.playerId)

        if (player) {
          const message = `${player.number}. ${player.name}`
          const goalMessage = `${latestEvent.minute}' GOAL !!!`

          const notification: EventGoal = {
            logo: team.logo ?? '/placeholder.svg',
            playerName: message,
            goalMessage,
            id: latestEvent.id,
          }
          setIsWithDelay(true);
          setNotification(notification)

          // Remove notification after 5 seconds

          setTimeout(() => {
            setIsWithDelay(false);
          }, 9000);

          setTimeout(() => {
            setNotification(null)
          }, 10000)
        }
      }
    }
  }, [events, homeTeam, awayTeam])

  return (
    <div className="relative font-['Roboto_Condensed'] w-[50vw] h-[15vh]">
      <AnimatePresence mode="wait">
        {notification && (
          <>
            <motion.div
              key={notification.id}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              exit={{ width: 0 }}
              transition={{ duration: 1 }}
              className="absolute -top-[4px] left-0 right-0 h-[4px]"
              style={{
                background: 'linear-gradient(90deg, #0534da 0%, #4bded8 100%)',
              }}
            ></motion.div>
            <motion.div
              key={notification.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: isWithDelay ? 0.5 : 0 }}
              className="text-xl font-bold absolute top-0 -left-[5%] flex items-center h-[100%]"
            >
              <img
                src={notification?.logo}
                alt="Logo"
                className="h-[90%] w-full object-contain"
              />
            </motion.div>

            <motion.div
              key={notification.id}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              exit={{ width: 0 }}
              transition={{ duration: 1, delay: isWithDelay ? 0 : 0.3 }}
              className="flex flex-col h-[100%]"
            >
              <div
                className="h-[50%] w-full flex justify-center items-center"
                style={{
                  background: `linear-gradient(to right, rgb(32, 0, 199) 0%, rgb(14, 0, 95) 40%, rgb(14, 0, 95) 60%, rgb(32, 0, 199) 100%)`,
                }}
              >
                <motion.span
                  key={notification.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{duration: 0.5, delay: isWithDelay ? 0.7 : 0 }}
                  className="text-white text-center text-2xl font-bold"
                >
                  {notification?.playerName}
                </motion.span>
              </div>
              <div className="h-[50%] bg-[rgba(0,7,85,.9)] w-full flex justify-center items-center">
                <motion.h1
                  key={notification.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: isWithDelay ? 0.7 : 0 }}
                >
                  <GradientText
                    colors={[
                      'rgba(255, 114, 91, 1)',
                      'rgba(255, 195, 0, 1)',
                      'rgba(255, 114, 91, 1)',
                      'rgba(255, 195, 0, 1)',
                      'rgba(255, 114, 91, 1)',
                    ]}
                    animationSpeed={3}
                    showBorder={false}
                    className="custom-class text-5xl font-bold"
                  >
                    {notification?.goalMessage}
                  </GradientText>
                </motion.h1>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GoalsDownOverlay
