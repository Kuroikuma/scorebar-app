import Image from 'next/image'
import { Triangle } from 'lucide-react'
import { cn } from "@/app/lib/utils"
import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { useUIStore } from '@/app/store/uiStore'
import { AnimatePresence, motion } from 'framer-motion'
import AnimatePopLayout from './ui/AnimatePopLayout'
import Runs from './Runs'

interface ClassicScoreboardProps {
  orientation?: 'horizontal' | 'vertical'
}

export function ClassicScoreboard({ orientation = 'vertical' }: ClassicScoreboardProps) {
  const { inning, isTopInning, balls, strikes, outs, bases } = useGameStore()
  const { teams } = useTeamsStore()
  const { primaryColor, primaryTextColor } = useUIStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color;

  let currrentOrientation = orientation === 'horizontal' ? 'flex-row' : 'flex-col'

  return (
    <div style={{ backgroundColor: primaryColor, color: primaryTextColor }} className={`flex ${currrentOrientation}`}>
      {/* Teams and Scores */}
      <div>
        {teams.map((team) => (
          <div
            key={team.name}
            style={{ backgroundColor: team.color, color: team.textColor }}
            className="flex justify-between items-center gap-2"
          >
            <div className="flex items-center gap-2">
              {team.logo && (
                <div className="relative w-[60px] h-[60px]">
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
              <div className='py-3'>
                <span className="text-3xl font-bold tracking-wider">
                  {team.name}
                </span>
              </div>
            </div>
            <Runs team={team} />
          </div>
        ))}
        {/* Game Info Row */}
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Triangle
              className={cn(
                "h-6 w-6 transform",
                isTopInning ? "" : "rotate-180"
              )}
              fill={currentTeamColor}
            />
            <AnimatePopLayout dataNumber={inning}>
              <span className="text-2xl">{inning}</span>
            </AnimatePopLayout>
          </div>
          
          <div className="flex items-center">
            <AnimatePopLayout dataNumber={outs}>
              <span className="text-2xl">{outs}</span>
            </AnimatePopLayout>
            <span className="text-2xl ml-2">OUTS</span>
          </div>
          {
            orientation === 'vertical' && (
              <div className="text-2xl flex gap-1">
                <AnimatePopLayout dataNumber={balls}>
                  {balls} 
                </AnimatePopLayout>
                <span>-</span>
                <AnimatePopLayout dataNumber={strikes}>
                  {strikes}
                </AnimatePopLayout>
              </div>
            )
          }
        </div>
      </div>

      {/* Bases */}
      <div className="relative w-32 h-32 mx-auto my-4 flex justify-end">
        {/* Second Base */}
        <div 
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 transform rotate-45 border-2",
            bases[1] ? "bg-opacity-80" : "bg-gray-800 border-gray-700"
          )}
          style={{ backgroundColor: bases[1] ? currentTeamColor : undefined }}
        />
        {/* Third Base */}
        <div 
          className={cn(
            "absolute top-1/2 left-0 -translate-y-1/2 w-12 h-12 transform rotate-45 border-2",
            bases[2] ? "bg-opacity-80" : "bg-gray-800 border-gray-700"
          )}
          style={{ backgroundColor: bases[2] ? currentTeamColor : undefined }}
        />
        {/* First Base */}
        <div 
          className={cn(
            "absolute top-1/2 right-0 -translate-y-1/2 w-12 h-12 transform rotate-45 border-2",
            bases[0] ? "bg-opacity-80" : "bg-gray-800 border-gray-700"
          )}
          style={{ backgroundColor: bases[0] ? currentTeamColor : undefined }}
        />
        {
          orientation === 'horizontal' && (
            <div className="absolute text-2xl top-[116px] flex gap-1">
            <AnimatePopLayout dataNumber={balls}>
              {balls} 
            </AnimatePopLayout>
            <span>-</span>
            <AnimatePopLayout dataNumber={strikes}>
              {strikes}
            </AnimatePopLayout>
          </div>
          )
        }
        
      </div>
    </div>
  )
}

