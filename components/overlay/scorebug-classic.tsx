import { useUIStore } from '@/app/store/uiStore'
import TeamScore from '../scorebug/TeamScore'
import GameInnings from '../scorebug/GameInnings'
import GameOuts from '../scorebug/GameOuts'
import GameScore from '../scorebug/GameScore'
import Bases from '../scorebug/Bases'
import { AnimatePresence, motion } from 'framer-motion'
import { IOverlays } from '@/app/store/gameStore'


interface ScorebugClassicProps {
  item: IOverlays
  styleName: "short" | "long"
}

export function ScorebugClassic({ item, styleName = 'long' }: ScorebugClassicProps) {
  const { primaryColor, primaryTextColor } = useUIStore()


  return (
    <div
      style={{ backgroundColor: primaryColor, color: primaryTextColor }}
      className={`flex flex-col overflow-hidden`}
    >
      <AnimatePresence>
        {item.visible && (
          <motion.div
            initial={{ x: -520 }}
            animate={{ x: 0 }}
            exit={{ x: -520 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="flex justify-between">
              <TeamScore styleName={styleName} />
              <Bases />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {item.visible && (
          <motion.div
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            exit={{ y: 40 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between px-6 py-3">
              <GameInnings />
              <GameOuts />
              <GameScore />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
