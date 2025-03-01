'use client'

import { Game } from '@/app/store/gameStore'
import { BaseRunner } from './ScoreBugBally/BaseRunner'
import Teams from './ScoreBugBally/Teams'
import GameScore from '../scorebug/GameScore'
import Ticker from './ScoreBugBally/Tiecker'
import GameInnings from '../scorebug/GameInnings'
import { AnimatePresence, motion } from 'framer-motion'

interface ISocketData {
  game: Omit<Game, 'userId'>
}

interface ScorebugClassicProps {
  visible: boolean
}

export function ScoreBugBallySports({ visible }: ScorebugClassicProps) {
  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <div
            style={{
              background:
                'linear-gradient(90deg, rgba(245,10,10,1) 0%, rgba(0,0,255,1) 100%)',
            }}
            className="w-full h-[60px] border-y-2 border-white text-white font-['Roboto_Condensed'] flex relative"
          >
            {/* Team Sections */}
            <div className="relative w-[60px] h-[60px] overflow-hidden">
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
                <GameInnings classes="text-3xl" />
              </div>

              <BaseRunner />

              <div className="px-4 flex items-center gap-6 border-r border-white/20">
                <GameScore classes="text-3xl" />
              </div>
              <Ticker />
            </div>
          </div>
        </motion.div>
      ) : (
        <></>
      )}
    </AnimatePresence>
  )
}
