'use client';

import React, { useRef, useEffect, useState } from 'react';
import { IOverlay } from '@/app/types/overlay';
import { OverlayContent } from './OverlayContent';
import { cn } from '@/app/lib/utils';
import { Move, RotateCcw } from 'lucide-react';

interface DraggableOverlayProps {
  overlay: IOverlay;
  isDraggable: boolean;
  onPositionChange: (x: number, y: number) => void;
}

export const DraggableOverlay: React.FC<DraggableOverlayProps> = ({
  overlay,
  isDraggable,
  onPositionChange,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isDraggable || !overlayRef.current) return;

    const element = overlayRef.current;

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;
      dragStart.current = {
        x: e.clientX - overlay.x,
        y: e.clientY - overlay.y,
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Add dragging class
      element.classList.add('dragging');
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;

      // Constrain to viewport
      const constrainedX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newX));
      const constrainedY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newY));

      // Update position visually (optimistic update)
      element.style.left = `${constrainedX}px`;
      element.style.top = `${constrainedY}px`;
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return;

      isDragging.current = false;
      
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;

      // Constrain to viewport
      const constrainedX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newX));
      const constrainedY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newY));

      // Save to server
      onPositionChange(constrainedX, constrainedY);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Remove dragging class
      element.classList.remove('dragging');
    };

    element.addEventListener('mousedown', handleMouseDown);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggable, overlay.x, overlay.y, onPositionChange]);

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    left: overlay.x,
    top: overlay.y,
    transform: `scale(${overlay.scale})`,
    transformOrigin: 'top left',
    cursor: isDraggable ? 'move' : 'default',
    zIndex: 1000,
  };

  return (
    <div
      ref={overlayRef}
      className={cn(
        "overlay-element transition-shadow duration-200",
        overlay.overlayTypeId?.name,
        overlay.design,
        isDraggable && "hover:shadow-lg",
        isDraggable && isHovered && "ring-2 ring-primary/50"
      )}
      style={overlayStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <OverlayContent overlay={overlay} />
      
      {/* Edit Mode Controls */}
      {isDraggable && isHovered && (
        <div className="absolute -top-8 -right-2 flex items-center gap-1 bg-background border border-border rounded-md px-2 py-1 shadow-md">
          <Move className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {Math.round(overlay.x)}, {Math.round(overlay.y)}
          </span>
        </div>
      )}
    </div>
  );
};