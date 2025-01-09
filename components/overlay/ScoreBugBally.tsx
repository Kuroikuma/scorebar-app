'use client'

import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { Triangle } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { BaseRunner } from './ScoreBugBally/BaseRunner'
import Teams from './ScoreBugBally/Teams'
import GameScore from '../scorebug/GameScore'
import Ticker from './ScoreBugBally/Tiecker'
import GameInnings from '../scorebug/GameInnings'

export function ScoreBugBallySports() {
  const {
    inning,
    isTopInning,
    balls,
    strikes,
    outs,
    bases,
  } = useGameStore()

  const { teams } = useTeamsStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color

  return (
    <div style={{background: "linear-gradient(90deg, rgba(245,10,10,1) 0%, rgba(0,0,255,1) 100%)"}} className="w-full h-[46px] border-y-2 border-white text-white font-['Roboto_Condensed'] flex relative">
      {/* Team Sections */}
      <div className="relative w-[46px] h-[46px] overflow-hidden">
        <img
          src="/logo-st-activo.png"
          alt={`logo`}
          style={{ objectFit: 'contain' }}
        />
      </div>
      <Teams />

      {/* Game Info */}
      <div className="flex items-stretch flex-1">
        {/* Inning Indicator */}
        <div className="px-4 flex items-center gap-2 border-r border-white/20">
          <GameInnings />
        </div>

        <BaseRunner
          bases={bases}
          currentTeamColor={currentTeamColor}
          outs={outs}
        />

        <div className="px-4 flex items-center gap-6 border-r border-white/20">
          <GameScore />
        </div>
        <Ticker />
      </div>
    </div>
  )
}
