'use client'

import { cn } from '@/app/lib/utils'
import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Runs } from './InningScoreOverlay/Runs'
import { Logo } from './InningScoreOverlay/Logo'
import { Name } from './InningScoreOverlay/Name'
import { ShortName } from './InningScoreOverlay/ShortName'
import { Innings } from './InningScoreOverlay/Inning'

interface InningScoreOverlayProps {
  visible: boolean
}

export function InningScoreOverlay({ visible }: InningScoreOverlayProps) {
  const { inning, isTopInning } = useGameStore()
  const { teams } = useTeamsStore()
  const [prevScores, setPrevScores] = useState([0, 0])

  useEffect(() => {
    setPrevScores([teams[0].runs, teams[1].runs])
  }, [teams[0].runs, teams[1].runs])

  return (
    <AnimatePresence>
      {visible ? (
        <>
          <style jsx global>{`
            @keyframes gradientMove {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }

            @keyframes pulse {
              0% {
                opacity: 0.8;
              }
              50% {
                opacity: 1;
              }
              100% {
                opacity: 0.8;
              }
            }

            .pattern-overlay {
              background-image: url('/pattern-overlay.svg');
            }
          `}</style>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl font-['Roboto_Condensed'] text-white shadow-2xl"
          >
            {/* Main Container */}
            <div className="w-full flex flex-col relative overflow-hidden">
              {/* Top Title Banner */}
              <div
                className="bg-gradient-to-r from-[#B31942] via-[#C41E3A] to-[#B31942] py-4 relative  pattern-overlay"
                style={{
                  backgroundSize: '200% 200%',
                  animation: 'gradientMove 15s ease infinite',
                }}
              >
                <motion.h1
                  className="text-5xl font-bold text-center tracking-wider"
                  style={{
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  DEPARTAMENTAL MAYOR A
                </motion.h1>
              </div>

              {/* Stadium Name */}
              <div className="bg-gradient-to-r from-gray-100 to-white py-3 relative overflow-hidden">
                <div className="absolute inset-0 pattern-overlay" />
                <h2 className="text-2xl font-bold text-center tracking-wide text-black relative">
                  ESTADIO EL AYOTE
                </h2>
              </div>

              {/* Team Names Header */}
              <div className="grid grid-cols-2 bg-gradient-to-b from-[#555555] to-[#333333]">
                {teams.map((team) => (
                  <Name team={team} />
                ))}
              </div>

              {/* Score Display */}
              <div className="grid grid-cols-4 h-40">
                {teams.map((team, index) => (
                  <>
                    <Logo team={team} />

                    <Runs index={index} isTopInning={isTopInning} team={team} />
                  </>
                ))}
              </div>

              {/* Team Names Footer */}
              <div className="grid grid-cols-2">
                {teams.map((team, index) => (
                  <ShortName index={index} team={team} />
                ))}
              </div>

              {/* Inning Display */}

              <Innings inning={inning} />

              {/* Score Change Indicators */}
              {teams.map(
                (team, index) =>
                  team.runs > prevScores[index] && (
                    <motion.div
                      key={`score-change-${index}`}
                      initial={{ opacity: 1, scale: 0.5 }}
                      animate={{ opacity: 0, scale: 2 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        color: index === 0 ? '#C8AA37' : '#40E0D0',
                        fontWeight: 'bold',
                        fontSize: '4rem',
                        zIndex: 10,
                      }}
                    >
                      +{team.runs - prevScores[index]}
                    </motion.div>
                  )
              )}
            </div>
          </motion.div>
        </>
      ) : (
        <></>
      )}
    </AnimatePresence>
  )
}
