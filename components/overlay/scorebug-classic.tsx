import { useUIStore } from '@/app/store/uiStore'
import TeamScore from '../scorebug/TeamScore'
import GameInnings from '../scorebug/GameInnings'
import GameOuts from '../scorebug/GameOuts'
import GameScore from '../scorebug/GameScore'
import Bases from '../scorebug/Bases'
import { AnimatePresence, motion } from 'framer-motion'
import { Game, IOverlays, useGameStore } from '@/app/store/gameStore'
import { useOverlayStore } from '@/app/store/overlayStore'
import { useEffect } from 'react'
import socket from '@/app/service/socket'

interface ScorebugClassicProps {
  item: IOverlays
}

interface ISocketData {
  game: Omit<Game, "userId">
}

export function ScorebugClassic({ item }: ScorebugClassicProps) {
  const { primaryColor, primaryTextColor } = useUIStore()

  const { updateGameOverlay } = useOverlayStore();
  const { id } = useGameStore()

  useEffect(() => {
    const eventName = `server:updateGame/${id}`
    
    const updateScorebugClassic = (socketData: ISocketData) => {
      if ((socketData.game as any).socketId !== id) {
        console.log("updateScorebugClassic");
        
        updateGameOverlay(socketData.game)
      }
    }

    socket.on(eventName, updateScorebugClassic)

    return () => {
      socket.off(eventName, updateScorebugClassic)
    }
  }, [ id ])

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
              <TeamScore />
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
