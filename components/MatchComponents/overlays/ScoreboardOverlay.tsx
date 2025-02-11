'use client'

import STActivoSVG from '../svg/logo-st-activo'
import { Time } from '../scoreboard/Time'
import { Score } from '../scoreboard/Score'
import { EventMatch } from '../scoreboard/EventMatch'
import { EventSubstitution } from '../scoreboard/EventSubstitution'
import { IOverlays } from '@/matchStore/interfaces'
import { AnimatePresence, motion } from 'framer-motion'

interface IProps {
  item: IOverlays
}

export function ScoreboardOverlay({ item }: IProps) {
  return (
    <AnimatePresence>
      {item.visible && (
        <motion.div
          className="relative font-['Roboto_Condensed']"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="w-[50vw]">
            <div className="relative">
              {/* Main Scoreboard */}
              <div className="flex items-stretch text-white">
                <div>
                  <div className="bg-[#162cf8]">
                    <STActivoSVG />
                  </div>
                  <div className="h-[50px]"></div>
                </div>

                <Time />
                <div className="flex flex-col items-center justify-start gap-1 pl-2">
                  <Score />
                  <EventMatch />
                  <EventSubstitution />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
