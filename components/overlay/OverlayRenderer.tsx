'use client';

import React from 'react';
import { IOverlay } from '@/app/types/overlay';
import { DraggableOverlay } from './DraggableOverlay';

interface OverlayRendererProps {
  overlays: IOverlay[];
  isEditMode: boolean;
  onPositionChange: (overlayId: string, x: number, y: number) => void;
}

export const OverlayRenderer: React.FC<OverlayRendererProps> = ({
  overlays,
  isEditMode,
  onPositionChange,
}) => {
  const visibleOverlays = overlays.filter(overlay => overlay.visible);

  return (
    <div className="overlay-renderer relative w-full h-full overflow-hidden">
      {visibleOverlays.map(overlay => (
        <DraggableOverlay
          key={overlay._id}
          overlay={overlay}
          isDraggable={isEditMode}
          onPositionChange={(x, y) => onPositionChange(overlay._id, x, y)}
        />
      ))}
      
      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="absolute top-4 left-4 z-50">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium">
            Modo Edición
          </div>
        </div>
      )}
    </div>
  );
};