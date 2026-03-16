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
    <div className="relative w-screen h-[calc(100vh)] bg-[#1a472a00] overflow-hidden">
      {visibleOverlays.map(overlay => (
        <DraggableOverlay
          key={overlay._id}
          overlay={overlay}
          isDraggable={isEditMode}
          onPositionChange={(x, y) => onPositionChange(overlay._id, x, y)}
        />
      ))}
    </div>
  );
};