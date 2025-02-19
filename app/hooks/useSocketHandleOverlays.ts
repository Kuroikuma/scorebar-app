import { useEffect } from 'react'
import socket from '../service/socket'
import { IOverlays } from '@/matchStore/interfaces'
import { useOverlaysStore } from '@/matchStore/overlayStore'
import { useMatchStore } from '@/matchStore/matchStore'

interface ISocketPosition {
  x: number
  y: number
}

export const useSocketHandleOverlays = (item: IOverlays) => {
  const { handlePositionOverlay, handleVisibleOverlay, handleScaleOverlay } = useOverlaysStore()
  const { id: matchId } = useMatchStore()

  useEffect(() => {
    const eventName = `server:handlePositionOverlay/${matchId}/${item.id}`
    const eventNameScale = `server:handleScaleOverlay/${matchId}/${item.id}`
    const eventNameVisible = `server:handleVisibleOverlay/${matchId}/${item.id}`

    const handlePosition = (imagesSocket: ISocketPosition) => {
      handlePositionOverlay(item.id, { x: imagesSocket.x, y: imagesSocket.y }, false)
    }

    const handleScale = (scale: number) => {
      handleScaleOverlay(item.id, scale, false)
    }

    const handleVisible = (visible: boolean) => {
      handleVisibleOverlay(item.id, visible, false)
    }

    socket.on(eventName, handlePosition)
    socket.on(eventNameScale, handleScale)
    socket.on(eventNameVisible, handleVisible)

    return () => {
      socket.off(eventName, handlePosition)
      socket.off(eventNameScale, handleScale)
      socket.off(eventNameVisible, handleVisible)
    }
  }, [matchId, item.id])
}
