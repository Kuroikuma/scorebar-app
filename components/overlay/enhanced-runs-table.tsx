'use client'

import { useTeamsStore } from '@/app/store/teamsStore'
import { useGameStore } from '@/app/store/gameStore'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Team } from '@/app/store/teamsStore'
import { Hits } from '../scoreboard/Hists'
import { ErrorsGame } from '../scoreboard/ErrorsGame'
import { ShortName } from '../scoreboard/ShortName'

interface EnhancedRunsTableProps {
  visible: boolean
}

export function EnhancedRunsTable({ visible }: EnhancedRunsTableProps) {
  const { teams } = useTeamsStore()
  const { inning, isTopInning, runsByInning } = useGameStore()
  const innings = Array.from({ length: 9 }, (_, i) => i + 1)
  const [animatedScores, setAnimatedScores] = useState(
    teams.map((team) => ({ ...team, animatedRuns: team.runs }))
  )

  useEffect(() => {
    teams.forEach((team, index) => {
      if (team.runs !== animatedScores[index].animatedRuns) {
        setAnimatedScores((prev) =>
          prev.map((score, i) =>
            i === index ? { ...score, animatedRuns: team.runs } : score
          )
        )
      }
    })
  }, [teams])

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a1625] rounded-lg overflow-hidden shadow-lg border border-[#2d2b3b] w-[80vw] font-['Roboto_Condensed']"
        >
          <table className="w-full text-sm border-collapse shadow-md">
            <thead>
              <tr className="bg-[#2d2b3b] text-white border-b-2 border-[#4c3f82]">
                <th className="w-[240px] px-2 py-3 text-left">Team</th>
                {innings.map((inningNum) => (
                  <th
                    key={inningNum}
                    className="px-3 w-[80px] py-2 text-start font-bold"
                  >
                    {inningNum}
                  </th>
                ))}
                <th className="px-3 py-2 text-center font-bold bg-[#4c3f82] border-b-2 border-[#2d2b3b] w-[80px]">
                  R
                </th>
                <th className="px-3 py-2 text-center font-bold bg-[#4c3f82] border-b-2 border-[#2d2b3b] w-[80px]">
                  H
                </th>
                <th className="px-3 py-2 text-center font-bold bg-[#4c3f82] border-b-2 border-[#2d2b3b] w-[80px]">
                  E
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team: Team, index: number) => (
                <motion.tr
                  key={team.name}
                  className="border-t border-[#2d2b3b] text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="">
                    <div className="flex items-center gap-2">
                      {team.logo && (
                        <div className="relative w-[40px] h-[40px] overflow-hidden">
                          <img
                            src={team.logo}
                            alt={`${team.name} logo`}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      )}
                      <div className="text-xs">
                        <ShortName team={team} />
                        <div className="text-gray-400">90-72</div>
                      </div>
                    </div>
                  </td>
                  {innings.map((inningNum) => {
                    const inningKey = `${inningNum}T${index + 1}`
                    const runs = runsByInning[inningKey] || 0
                    const isCurrentInning =
                      inningNum === inning && index === (isTopInning ? 0 : 1)
                    return (
                      <td
                        key={inningNum}
                        className={`w-[80px] box-border text-center font-bold`}
                      >
                        <div
                          className={`${
                            isCurrentInning ? 'bg-[#4c3f82]' : 'bg-[#2d2b3b]'
                          } flex h-[30px] w-[30px] items-center justify-center rounded-md`}
                        >
                          <AnimatePresence mode="popLayout">
                            <motion.div
                              key={runs}
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              exit={{ y: -20, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {runs}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </td>
                    )
                  })}
                  <td className="px-3 py-2 text-center font-bold bg-[#4c3f82]">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={animatedScores[index].animatedRuns}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {animatedScores[index].animatedRuns}
                      </motion.span>
                    </AnimatePresence>
                  </td>
                  <Hits hits={team.hits} />
                  <ErrorsGame team={team} />
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


      

    

      


    

      

    