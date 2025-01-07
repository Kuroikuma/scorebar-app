import { AnimatePresence, motion } from 'framer-motion'
import { OverlayItem } from './page'
import { SetStateAction, useEffect } from 'react'
import socket from '@/app/service/socket'
import { IOverlays, useGameStore } from '@/app/store/gameStore'
import { ClassicScoreboard } from '@/components/classic-scoreboard'
import BaseballFormation from '@/components/overlay/improved-field-lineup'
import { EnhancedRunsTable } from '@/components/overlay/enhanced-runs-table'

interface IOverlaysItemProps {
  item: IOverlays
  gameId: string
}

interface ISocketPosition {
  x: number
  y: number
}

interface ISocketScale {
  scale: number
}

interface ISocketVisible {
  visible: boolean
}

export const OverlaysItem = ({
  item,
  gameId,
}: IOverlaysItemProps) => {
  const { handlePositionOverlay, handleVisibleOverlay, handleScaleOverlay } = useGameStore()

  useEffect(() => {
    const eventName = `server:handlePositionOverlay/${gameId}/${item.id}`
    const eventNameScale = `server:handleScaleOverlay/${gameId}/${item.id}`
    const eventNameVisible = `server:handleVisibleOverlay/${gameId}/${item.id}`
    
    const handlePosition = (imagesSocket: ISocketPosition) => {
      handlePositionOverlay(item.id, { x: imagesSocket.x, y: imagesSocket.y }, false)
    }

    const handleScale = (imagesSocket: ISocketScale) => {
      handleScaleOverlay(item.id, imagesSocket.scale, false)
    }

    const handleVisible = (imagesSocket: ISocketVisible) => {
      handleVisibleOverlay(item.id, imagesSocket.visible, false)
    }

    socket.on(eventName, handlePosition)
    socket.on(eventNameScale, handleScale)
    socket.on(eventNameVisible, handleVisible)

    return () => {
      socket.off(eventName, handlePosition)
      socket.off(eventNameScale, handleScale)
      socket.off(eventNameVisible, handleVisible)
    }
  }, [gameId, item.id])

  return (
    <AnimatePresence mode="popLayout">
      {item.visible && (
        <motion.div
          key={item.id}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ duration: 2 }}
        >
          {item.id === 'scorebug' ? (
            <ScoreBoard />
          ) : item.id === 'formationA' ? (
            <BaseballFormation />
          ) : item.id === 'scoreboard' ? (
            <EnhancedRunsTable />
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const ScoreBoard = () => {
  return (
    <div className="flex-1 max-w-[520px] bg-black text-white max-[768px]:px-4 flex flex-col font-['Roboto_Condensed']">
      <ClassicScoreboard orientation="horizontal" />
    </div>
  )
}
