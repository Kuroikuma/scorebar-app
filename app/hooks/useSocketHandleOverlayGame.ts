import { useEffect } from 'react';
import { IOverlays, useGameStore } from '../store/gameStore';
import socket from '../service/socket';

interface ISocketPosition {
  x: number;
  y: number;
}

interface ISocketScale {
  scale: number;
}

interface ISocketVisible {
  visible: boolean;
}


export const useSocketHandleOverlays = (item: IOverlays, gameId: string) => {
  const { handlePositionOverlay, handleVisibleOverlay, handleScaleOverlay } = useGameStore();

  useEffect(() => {
    const eventName = `server:handlePositionOverlay/${gameId}/${item.id}`;
    const eventNameScale = `server:handleScaleOverlay/${gameId}/${item.id}`;
    const eventNameVisible = `server:handleVisibleOverlay/${gameId}/${item.id}`;

    const handlePosition = (imagesSocket: ISocketPosition) => {
      handlePositionOverlay(item.id, { x: imagesSocket.x, y: imagesSocket.y }, false);
    };

    const handleScale = (imagesSocket: ISocketScale) => {
      handleScaleOverlay(item.id, imagesSocket.scale, false);
    };

    const handleVisible = (imagesSocket: ISocketVisible) => {
      handleVisibleOverlay(item.id, imagesSocket.visible, false);
    };

    socket.on(eventName, handlePosition);
    socket.on(eventNameScale, handleScale);
    socket.on(eventNameVisible, handleVisible);

    return () => {
      socket.off(eventName, handlePosition);
      socket.off(eventNameScale, handleScale);
      socket.off(eventNameVisible, handleVisible);
    };
  }, [gameId, item.id]);
};
