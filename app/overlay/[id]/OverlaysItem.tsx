import { AnimatePresence, motion } from 'framer-motion'
import { OverlayItem } from './page'
import { SetStateAction, useEffect } from 'react'
import socket from '@/app/service/socket'
import { IOverlays, useGameStore } from '@/app/store/gameStore'
import { ClassicScoreboard } from '@/components/classic-scoreboard'
import { BaseballFormationOverlay } from '@/components/overlay/improved-field-lineup'
import { EnhancedRunsTable } from '@/components/overlay/enhanced-runs-table'
import { ScorebugClassic } from '@/components/overlay/scorebug-classic'
import { ScoreBugBallySports } from '@/components/overlay/ScoreBugBally'
import { InningScoreOverlay } from '@/components/overlay/inning-score-overlay'
import { PlayerOverlay } from '@/components/overlay/player-stats-overlay'

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

interface ScorebugProps {
  item: IOverlays
}

export const OverlaysItem = ({ item, gameId }: IOverlaysItemProps) => {
  const { handlePositionOverlay, handleVisibleOverlay, handleScaleOverlay } =
    useGameStore()

  useEffect(() => {
    const eventName = `server:handlePositionOverlay/${gameId}/${item.id}`
    const eventNameScale = `server:handleScaleOverlay/${gameId}/${item.id}`
    const eventNameVisible = `server:handleVisibleOverlay/${gameId}/${item.id}`

    const handlePosition = (imagesSocket: ISocketPosition) => {
      handlePositionOverlay(
        item.id,
        { x: imagesSocket.x, y: imagesSocket.y },
        false
      )
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

  return item.id === 'scorebug' ? (
    <ScoreBoard item={item} />
  ) : item.id === 'formationA' ? (
    <BaseballFormationOverlay overlayId="formationA" visible={item.visible} />
  ) : item.id === 'formationB' ? (
    <BaseballFormationOverlay overlayId="formationB" visible={item.visible} />
  ) : item.id === 'scoreboard' ? (
    <EnhancedRunsTable visible={item.visible} />
  ) : item.id === 'scoreboardMinimal' ? (
    <InningScoreOverlay visible={item.visible} />
  ) : item.id === 'playerStats' ? (
    <PlayerOverlay visible={item.visible} />
    ) : <></>
}

const ScoreBoard = ({ item }: ScorebugProps) => {
  return (
    <div className="flex-1 max-w-[100%] bg-black text-white max-[768px]:px-4 flex flex-col font-['Roboto_Condensed']">
      <ScoreBugBallySports visible={item.visible} />
    </div>
  )
}
