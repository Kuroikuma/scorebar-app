import { useEffect } from 'react';
import { useOverlayStore } from '../store/useOverlayStore';
import { useOverlaySocket } from './useOverlaySocket';
import { SportCategory, IOverlayUpdate } from '../types/overlay';

export const useGameOverlays = (gameId: string) => {
  const {
    overlays,
    loading,
    error,
    loadGameOverlays,
    updateOverlay,
    updateOverlayDesign,
    updateOverlayPosition,
    updateOverlayScale,
    updateOverlayVisibility,
    deleteOverlay,
    getOverlayByType,
    getOverlaysByCategory,
    getVisibleOverlays,
    clearError,
  } = useOverlayStore();

  // Initialize Socket.io integration
  const {
    broadcastPositionUpdate,
    broadcastVisibilityUpdate,
    broadcastDesignUpdate,
    broadcastScaleUpdate,
    isConnected,
  } = useOverlaySocket(gameId);

  // Load overlays when gameId changes
  // useEffect(() => {
  //   if (gameId) {
  //     loadGameOverlays(gameId);
  //   }
  // }, []);

  // Filter overlays for current game
  const gameOverlays = overlays.filter(overlay => overlay.gameId === gameId);

  // Enhanced update methods with Socket.io broadcasting
  const updateOverlayPositionWithBroadcast = async (overlayId: string, x: number, y: number) => {
    await updateOverlayPosition(overlayId, x, y);
    broadcastPositionUpdate(overlayId, x, y);
  };

  const updateOverlayVisibilityWithBroadcast = async (overlayId: string, visible: boolean) => {
    await updateOverlayVisibility(overlayId, visible);
    broadcastVisibilityUpdate(overlayId, visible);
  };

  const updateOverlayDesignWithBroadcast = async (overlayId: string, design: string, customConfig?: Record<string, any>) => {
    await updateOverlayDesign(overlayId, design, customConfig);
    broadcastDesignUpdate(overlayId, design, customConfig);
  };

  const updateOverlayScaleWithBroadcast = async (overlayId: string, scale: number) => {
    await updateOverlayScale(overlayId, scale);
    broadcastScaleUpdate(overlayId, scale);
  };

  return {
    overlays: gameOverlays,
    loading,
    error,
    isConnected,
    refetch: () => loadGameOverlays(gameId),
    clearError,
    
    // Update methods with broadcasting
    updateOverlay: (overlayId: string, updates: IOverlayUpdate) => 
      updateOverlay(overlayId, updates),
    updateOverlayDesign: updateOverlayDesignWithBroadcast,
    updateOverlayPosition: updateOverlayPositionWithBroadcast,
    updateOverlayScale: updateOverlayScaleWithBroadcast,
    updateOverlayVisibility: updateOverlayVisibilityWithBroadcast,
    deleteOverlay: (overlayId: string) => deleteOverlay(overlayId),
    
    // Getters
    getOverlayByType: (typeName: string) => getOverlayByType(typeName),
    getOverlaysByCategory: (category: string) => getOverlaysByCategory(category),
    getVisibleOverlays: () => getVisibleOverlays(),
  };
};

export const useOverlayInitialization = () => {
  const { initializeGameOverlays, loading, error } = useOverlayStore();

  const initializeOverlays = async (gameId: string, sport: SportCategory) => {
    return initializeGameOverlays(gameId, sport);
  };

  return {
    initializeOverlays,
    loading,
    error,
  };
};