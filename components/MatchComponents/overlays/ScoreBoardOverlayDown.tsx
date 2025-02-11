import { useTeamStore } from '@/matchStore/useTeam'
import { useEffect, useState } from 'react'
import { useEventStore } from '@/matchStore/useEvent'
import { IOverlays, TeamRole } from '@/matchStore/interfaces'
import { Arrow } from '@radix-ui/react-select'
import ArrowCircleLeft from '../svg/ArrowCircleLeft'
import ArrowCircleRigth from '../svg/ArrowCircleRigth'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

interface EventGoal {
  playerName: string
  minute: number
  teamRole: TeamRole
}

interface ScoreBoardDownProps {
  item: IOverlays
}

const ScoreBoardDown = ({ item }: ScoreBoardDownProps) => {
  const { homeTeam, awayTeam } = useTeamStore()
  const { events } = useEventStore()
  const [goals, setGoals] = useState<EventGoal[]>([])

  useEffect(() => {
    if (events.length > 0) {
      const goalsEvent = events.filter((event) => event.type === 'goal')

      const goalsMap = goalsEvent
        .map((element) => {
          const team = element.teamId === 'home' ? homeTeam : awayTeam
          if (!team?.players) return null

          const player = team.players.find((p) => p.id === element.playerId)
          if (!player) return null

          return {
            playerName: player.name,
            minute: element.minute,
            teamRole: element.teamId,
          } as EventGoal
        })
        .filter((goal): goal is EventGoal => goal !== null)

      setGoals(goalsMap)
    }
  }, [events, homeTeam, awayTeam])

  return (
    <AnimatePresence initial={false}>
      {item.visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative font-['Roboto_Condensed'] w-[60vw] min-h-[15vh]"
        >
          <div className="flex flex-col h-[100%]">
            <div className="min-h-[50%] bg-[rgba(0,7,85,.8)] w-full flex justify-center items-center py-2">
              <div className="flex flex-col items-start justify-center w-[50%] min-h-10 pl-[10%]">
                {goals
                  .filter((goal) => goal.teamRole === 'home')
                  .map((goal, index) => (
                    <span key={index} className="text-white text-sm font-bold">
                      {goal.playerName} ({goal.minute}')
                    </span>
                  ))}
              </div>
              <div className="flex flex-col items-end justify-center w-[50%] pr-[10%]">
                {goals
                  .filter((goal) => goal.teamRole === 'away')
                  .map((goal, index) => (
                    <span key={index} className="text-white text-sm font-bold">
                      {goal.playerName} ({goal.minute}')
                    </span>
                  ))}
              </div>
            </div>
            <div
              className="flex w-full relative h-[50%]"
              style={{
                background: `linear-gradient(to right, rgb(32, 0, 199) 0%, rgb(14, 0, 95) 40%, rgb(14, 0, 95) 60%, rgb(32, 0, 199) 100%)`,
              }}
            >
              <div className=" text-xl font-bold absolute -top-[3.5vh] -left-[5%] flex items-center h-[15vh] z-10">
                <img src={homeTeam.logo} alt="Logo" className="h-full w-full object-contain" />
              </div>
              <div
                className="absolute -top-[4px] left-0 right-0 h-[4px]"
                style={{
                  background: 'linear-gradient(90deg, #0534da 0%, #4bded8 100%)',
                }}
              ></div>
              <div className="flex justify-start text-white items-center w-[45%] p-2 pl-[10%] pr-8">
                <span className="font-bold text-3xl">{homeTeam.name}</span>
              </div>
              <div className="flex items-center justify-center">
                <ArrowCircleLeft className="text-white" />
              </div>

              {/* Score */}
              <div className="flex items-center justify-center text-white px-6 text-4xl font-bold">
                {homeTeam.score}
              </div>

              <div className="flex items-center justify-center text-white px-4 text-4xl font-bold">
                <div className="bg-[#2919a6] w-[2px] h-[4vh]"></div>
              </div>

              <div className="flex items-center justify-center text-white px-6 text-4xl font-bold">
                {awayTeam.score}
              </div>
              <div className="flex items-center justify-center">
                <ArrowCircleRigth className="text-white" />
              </div>

              {/* Away Team */}
              <div className="flex items-center p-2 pl-8 w-[45%] justify-end text-white pr-[10%]">
                <span className="font-bold text-3xl">{awayTeam.name}</span>
              </div>
              <div className=" text-xl font-bold absolute -top-[3.5vh] -right-[5%] flex items-center h-[15vh]">
                <img src={awayTeam.logo} alt="Logo" className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default React.memo(ScoreBoardDown)
