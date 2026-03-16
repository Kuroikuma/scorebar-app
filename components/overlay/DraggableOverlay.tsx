'use client';

import React, { useRef, useEffect, useState } from 'react';
import { IOverlay } from '@/app/types/overlay';
import { OverlayContent } from './OverlayContent';
import { cn } from '@/app/lib/utils';
import { Move, RotateCcw } from 'lucide-react';
import dynamic from 'next/dynamic';

interface DraggableOverlayProps {
  overlay: IOverlay;
  isDraggable: boolean;
  onPositionChange: (x: number, y: number) => void;
}

const DraggableComponent = dynamic(
  () =>
    import('react-draggable').then((mod) => {
      const Draggable = mod.default
      return ({ children, ...props }: any) => {
        const nodeRef = useRef(null)
        return (
          <Draggable {...props} nodeRef={nodeRef}>
            <div ref={nodeRef}>{children}</div>
          </Draggable>
        )
      }
    }),
  { ssr: false }
)

export const DraggableOverlay: React.FC<DraggableOverlayProps> = ({
  overlay,
  isDraggable,
  onPositionChange,
}) => {
  console.log(overlay);
  
  let y = (overlay.y / 100) * window.innerHeight

  return (
    <DraggableComponent
      key={overlay._id}
      position={{ x: overlay.x, y: y }}
      // defaultPosition={{ x: item.x, y: item.y }} // Usa `defaultPosition` en lugar de `position`.
      onStop={(_: any, data: any) =>
        onPositionChange(data.x, data.y)
      }
      // bounds="parent"
      handle={overlay._id.includes('formation') ? undefined : '.drag-handle'}
      disabled={overlay._id.includes('formation')} // Evita mover el campo.
    >
      <div className="absolute" style={{ width: '100%', height: '100%' }}>
        <div
          style={{ transform: `scale(${overlay.scale / 100})` }}
          className={`relative transform scale-[${overlay.scale / 100}]`}
        >
          {!overlay._id.includes('formation') && (
            <div className="drag-handle absolute -top-2 left-0 right-0 h-6 bg-white/10 rounded-t cursor-move opacity-0 hover:opacity-100 transition-opacity" />
          )}
          <OverlayContent overlay={overlay} />
        </div>
      </div>
    </DraggableComponent>
  );
};