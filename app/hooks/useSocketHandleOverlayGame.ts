import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import socket from '../service/socket';
import { IOverlay } from '../types/overlay';

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


export const useSocketHandleOverlays = (item: IOverlay, gameId: string) => {
  const { handlePositionOverlay, handleVisibleOverlay, handleScaleOverlay } = useGameStore();

  useEffect(() => {
    const eventName = `server:handlePositionOverlay/${gameId}/${item._id}`;
    const eventNameScale = `server:handleScaleOverlay/${gameId}/${item._id}`;
    const eventNameVisible = `server:handleVisibleOverlay/${gameId}/${item._id}`;

    const handlePosition = (imagesSocket: ISocketPosition) => {
      handlePositionOverlay(item._id, { x: imagesSocket.x, y: imagesSocket.y }, false);
    };

    const handleScale = (imagesSocket: ISocketScale) => {
      handleScaleOverlay(item._id, imagesSocket.scale, false);
    };

    const handleVisible = (imagesSocket: ISocketVisible) => {
      handleVisibleOverlay(item._id, imagesSocket.visible, false);
    };

    socket.on(eventName, handlePosition);
    socket.on(eventNameScale, handleScale);
    socket.on(eventNameVisible, handleVisible);

    return () => {
      socket.off(eventName, handlePosition);
      socket.off(eventNameScale, handleScale);
      socket.off(eventNameVisible, handleVisible);
    };
  }, [gameId, item._id]);
};
