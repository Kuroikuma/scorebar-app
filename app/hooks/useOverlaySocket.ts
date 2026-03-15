import { useEffect } from 'react';
import { useOverlayStore } from '../store/useOverlayStore';
import socket from '../service/socket';
import { IOverlay, IOverlayUpdate } from '../types/overlay';

export const useOverlaySocket = (gameId: string) => {
  const { 
    updateOverlay, 
    loadGameOverlays,
    overlays 
  } = useOverlayStore();

  useEffect(() => {
    if (!gameId || !socket) return;

    // Join game room for overlay updates
    socket.emit('join-game', gameId);

    // Listen for overlay updates
    const handleOverlayUpdate = (data: { overlayId: string; updates: IOverlayUpdate }) => {
      updateOverlay(data.overlayId, data.updates);
    };

    const handleOverlayPositionUpdate = (data: { overlayId: string; x: number; y: number }) => {
      updateOverlay(data.overlayId, { x: data.x, y: data.y });
    };

    const handleOverlayVisibilityUpdate = (data: { overlayId: string; visible: boolean }) => {
      updateOverlay(data.overlayId, { visible: data.visible });
    };

    const handleOverlayDesignUpdate = (data: { overlayId: string; design: string; customConfig?: Record<string, any> }) => {
      updateOverlay(data.overlayId, { 
        design: data.design, 
        customConfig: data.customConfig 
      });
    };

    const handleOverlayScaleUpdate = (data: { overlayId: string; scale: number }) => {
      updateOverlay(data.overlayId, { scale: data.scale });
    };

    const handleOverlayRefresh = () => {
      loadGameOverlays(gameId);
    };

    // Socket event listeners
    socket.on(`overlay-update-${gameId}`, handleOverlayUpdate);
    socket.on(`overlay-position-${gameId}`, handleOverlayPositionUpdate);
    socket.on(`overlay-visibility-${gameId}`, handleOverlayVisibilityUpdate);
    socket.on(`overlay-design-${gameId}`, handleOverlayDesignUpdate);
    socket.on(`overlay-scale-${gameId}`, handleOverlayScaleUpdate);
    socket.on(`overlay-refresh-${gameId}`, handleOverlayRefresh);

    // Generic overlay update handler
    socket.on(`game-overlay-${gameId}`, (data: IOverlay) => {
      updateOverlay(data._id, data);
    });

    return () => {
      // Cleanup listeners
      socket.off(`overlay-update-${gameId}`, handleOverlayUpdate);
      socket.off(`overlay-position-${gameId}`, handleOverlayPositionUpdate);
      socket.off(`overlay-visibility-${gameId}`, handleOverlayVisibilityUpdate);
      socket.off(`overlay-design-${gameId}`, handleOverlayDesignUpdate);
      socket.off(`overlay-scale-${gameId}`, handleOverlayScaleUpdate);
      socket.off(`overlay-refresh-${gameId}`, handleOverlayRefresh);
      socket.off(`game-overlay-${gameId}`);
      
      // Leave game room
      socket.emit('leave-game', gameId);
    };
  }, [gameId, updateOverlay, loadGameOverlays]);

  // Emit overlay updates to other clients
  const broadcastOverlayUpdate = (overlayId: string, updates: IOverlayUpdate) => {
    if (socket && gameId) {
      socket.emit(`overlay-update-${gameId}`, { overlayId, updates });
    }
  };

  const broadcastPositionUpdate = (overlayId: string, x: number, y: number) => {
    if (socket && gameId) {
      socket.emit(`overlay-position-${gameId}`, { overlayId, x, y });
    }
  };

  const broadcastVisibilityUpdate = (overlayId: string, visible: boolean) => {
    if (socket && gameId) {
      socket.emit(`overlay-visibility-${gameId}`, { overlayId, visible });
    }
  };

  const broadcastDesignUpdate = (overlayId: string, design: string, customConfig?: Record<string, any>) => {
    if (socket && gameId) {
      socket.emit(`overlay-design-${gameId}`, { overlayId, design, customConfig });
    }
  };

  const broadcastScaleUpdate = (overlayId: string, scale: number) => {
    if (socket && gameId) {
      socket.emit(`overlay-scale-${gameId}`, { overlayId, scale });
    }
  };

  return {
    broadcastOverlayUpdate,
    broadcastPositionUpdate,
    broadcastVisibilityUpdate,
    broadcastDesignUpdate,
    broadcastScaleUpdate,
    isConnected: socket?.connected || false,
  };
};