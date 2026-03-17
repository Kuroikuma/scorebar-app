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

  // Normalizar la escala: si es > 10, asumimos que está en porcentaje y la convertimos
  // Si es <= 10, asumimos que ya está en el formato correcto (0.1 - 3.0)
  const normalizedScale = overlay.scale > 10 ? overlay.scale / 100 : overlay.scale || 1;
  
  // Validar que la escala esté en el rango correcto
  const validScale = Math.max(0.1, Math.min(3.0, normalizedScale));

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
          style={{ transform: `scale(${validScale})` }}
          className="relative"
        >
          {!overlay._id.includes('formation') && isDraggable && (
            <div className="drag-handle absolute -top-2 left-0 right-0 h-6 bg-white/10 rounded-t cursor-move opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Move className="h-3 w-3 text-white" />
            </div>
          )}
          <OverlayContent overlay={overlay} />
        </div>
      </div>
    </DraggableComponent>
  );
};