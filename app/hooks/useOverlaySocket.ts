import { useBaseballSocketEvents } from './useSocketEventFactory';
import { useOverlayStore } from '../store/useOverlayStore';
import socket from '../service/socket';
import { IOverlay, IOverlayUpdate } from '../types/overlay';

/**
 * Hook para manejar eventos de socket de overlays usando la nueva estructura BaseballSocketService
 */
export const useOverlaySocket = (gameId: string) => {
  const { 
    updateOverlay, 
    loadGameOverlays,
    overlayAutoDismiss
  } = useOverlayStore();

  const overlayEvents = [
    {
      eventName: 'overlayUpdate',
      handler: (data: { 
        gameId: string; 
        overlayId: string; 
        updates: IOverlayUpdate; 
        timestamp: string 
      }) => {
        updateOverlay(data.overlayId, data.updates, false);
      }
    },
    {
      eventName: 'overlayPositionUpdate',
      handler: (data: { 
        gameId: string; 
        overlayId: string; 
        x: number; 
        y: number; 
        timestamp: string 
      }) => {
        updateOverlay(data.overlayId, { x: data.x, y: data.y }, false);
      }
    },
    {
      eventName: 'overlayVisibilityUpdate',
      handler: (data: { 
        gameId: string; 
        overlayId: string; 
        visible: boolean; 
        timestamp: string 
      }) => {
        updateOverlay(data.overlayId, { visible: data.visible }, false);
      }
    },
    {
      eventName: 'overlayDesignUpdate',
      handler: (data: { 
        gameId: string; 
        overlayId: string; 
        design: string; 
        customConfig?: Record<string, any>; 
        timestamp: string 
      }) => {
        updateOverlay(data.overlayId, { 
          design: data.design, 
          customConfig: data.customConfig 
        }, false);
      }
    },
    {
      eventName: 'overlayScaleUpdate',
      handler: (data: { 
        gameId: string; 
        overlayId: string; 
        scale: number; 
        timestamp: string 
      }) => {
        updateOverlay(data.overlayId, { scale: data.scale }, false);
      }
    },
    {
      eventName: 'overlayRefresh',
      handler: (data: { gameId: string; timestamp: string }) => {
        loadGameOverlays(gameId);
      }
    },
    {
      eventName: 'gameOverlayUpdate',
      handler: (data: { gameId: string; overlay: IOverlay; timestamp: string }) => {
        updateOverlay(data.overlay._id, data.overlay);
      }
    },
    {
        
      eventName: 'overlayAutoDismiss',
      handler: (data: { 
        gameId: string; 
        overlayId: string; 
        timestamp: string
      }) => {
        overlayAutoDismiss(data.overlayId);
      }

    }
  ];

  useBaseballSocketEvents(gameId, overlayEvents);



  return {
    isConnected: socket?.connected || false,
  };
};