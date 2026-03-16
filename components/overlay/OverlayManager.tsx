'use client';

import React from 'react';
import { useGameOverlays } from '@/app/hooks/useGameOverlays';
import { useOverlayStore } from '@/app/store/useOverlayStore';
import { OverlayControlPanel } from './OverlayControlPanel';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { OverlayRenderer } from './OverlayRenderer';

interface OverlayManagerProps {
  gameId: string;
  isEditMode?: boolean;
}

export const OverlayManager: React.FC<OverlayManagerProps> = ({ 
  gameId, 
  isEditMode = true
}) => {
  const {
    overlays,
    loading,
    error,
    updateOverlayDesign,
    updateOverlayPosition,
    updateOverlayScale,
    updateOverlayVisibility,
    clearError,
  } = useGameOverlays(gameId);

  const { setEditMode } = useOverlayStore();


  // Set edit mode in store when prop changes
  React.useEffect(() => {
    setEditMode(isEditMode);
  }, [isEditMode, setEditMode]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <button 
            onClick={clearError}
            className="ml-2 underline hover:no-underline"
          >
            Dismiss
          </button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="overlay-manager relative w-full h-full">
      {/* Panel de Control (solo en modo edición) */}
      {isEditMode && (
        <OverlayControlPanel
          overlays={overlays}
          onDesignChange={updateOverlayDesign}
          onPositionChange={updateOverlayPosition}
          onScaleChange={updateOverlayScale}
          onVisibilityChange={updateOverlayVisibility}
        />
      )}
    </div>
  );
};