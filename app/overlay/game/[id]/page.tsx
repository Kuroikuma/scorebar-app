'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useGameOverlays, useOverlayInitialization } from '@/app/hooks/useGameOverlays';
import { SportCategory } from '@/app/types/overlay';
import { useOverlayStore } from '@/app/store/useOverlayStore';
import { OverlayRenderer } from '@/components/overlay/OverlayRenderer';
import { useGameStore } from '@/app/store/gameStore';

export default function GameOverlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.id as string;

  const {
    loadGameOverlays,
  } = useOverlayStore();

  const { overlays, loading, error, updateOverlayPosition } = useGameOverlays(gameId);
  const { loadGame } = useGameStore();
  const { initializeOverlays, loading: initializing } = useOverlayInitialization();


  // Load overlays when gameId changes
  useEffect(() => {
    if (gameId) {
      loadGame(gameId);
      loadGameOverlays(gameId);
    }
  }, []);

  // Check if overlays need initialization
  const needsInitialization = !loading && overlays.length === 0;

  const handleInitializeOverlays = async () => {
    try {
      await initializeOverlays(gameId, SportCategory.Baseball);
    } catch (error) {
      console.error('Error initializing overlays:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p>Cargando overlays...</p>
        </div>
      </div>
    );
  }

  return (<OverlayRenderer
    overlays={overlays}
    isEditMode={true}
    onPositionChange={updateOverlayPosition}
  />);
}