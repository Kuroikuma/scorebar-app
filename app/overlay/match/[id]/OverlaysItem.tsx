import { useEffect } from 'react'
import { IOverlays } from '@/matchStore/interfaces'
import { useOverlaysStore } from '@/matchStore/overlayStore'
// import socket from '@/services/socket'
import { ScoreboardOverlay } from '@/components/MatchComponents/overlays/ScoreboardOverlay'
import { FormationOverlay } from '@/components/MatchComponents/overlays/FormationOverlay'
import GoalsDownOverlay from '@/components/MatchComponents/overlays/GoalsDownOverlay'
import ScoreBoardDown from '@/components/MatchComponents/overlays/ScoreBoardOverlayDown'
import PreviewOverlay from '@/components/MatchComponents/overlays/PreviewOverlay'

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
    useOverlaysStore()

  // useEffect(() => {
  //   const eventName = `server:handlePositionOverlay/${gameId}/${item.id}`
  //   const eventNameScale = `server:handleScaleOverlay/${gameId}/${item.id}`
  //   const eventNameVisible = `server:handleVisibleOverlay/${gameId}/${item.id}`

  //   const handlePosition = (imagesSocket: ISocketPosition) => {
  //     handlePositionOverlay(
  //       item.id,
  //       { x: imagesSocket.x, y: imagesSocket.y },
  //       false
  //     )
  //   }

  //   const handleScale = (imagesSocket: ISocketScale) => {
  //     handleScaleOverlay(item.id, imagesSocket.scale, false)
  //   }

  //   const handleVisible = (imagesSocket: ISocketVisible) => {
  //     handleVisibleOverlay(item.id, imagesSocket.visible, false)
  //   }

  //   socket.on(eventName, handlePosition)
  //   socket.on(eventNameScale, handleScale)
  //   socket.on(eventNameVisible, handleVisible)

  //   return () => {
  //     socket.off(eventName, handlePosition)
  //     socket.off(eventNameScale, handleScale)
  //     socket.off(eventNameVisible, handleVisible)
  //   }
  // }, [gameId, item.id])

  return item.id === 'scoreboardUp' ? (
    <ScoreboardOverlay />
    // <></>
  ) : item.id === 'formation' ? (
    // <FormationOverlay />
    <></>
  ) : item.id === 'goalsDown' ? (
    // <GoalsDownOverlay />
    <> </>
  ) : item.id === 'scoreBoardDown' ? (
    // <ScoreBoardDown />
    <> </>
  ) : item.id === 'preview' ? (
    // <PreviewOverlay />
    <></>
  ) : <></>
}

const ScoreBoard = ({ item }: ScorebugProps) => {
  return (
    <div className="flex-1 max-w-[100%] bg-black text-white max-[768px]:px-4 flex flex-col font-['Roboto_Condensed']">
      <ScoreboardOverlay />
    </div>
  )
}
