'use client';

import React, { useState } from 'react';
import { IOverlay } from '@/app/types/overlay';
import { OverlayCard } from './OverlayCard';
import { useOverlayStore } from '@/app/store/useOverlayStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/app/lib/utils';
import { DesignSelector } from './DesignSelector';

interface OverlayControlPanelProps {
  overlays: IOverlay[];
  onDesignChange: (overlayId: string, design: string, customConfig?: Record<string, any>) => Promise<void>;
  onPositionChange: (overlayId: string, x: number, y: number) => Promise<void>;
  onScaleChange: (overlayId: string, scale: number) => Promise<void>;
  onVisibilityChange: (overlayId: string, visible: boolean) => Promise<void>;
}

export const OverlayControlPanel: React.FC<OverlayControlPanelProps> = ({
  overlays,
  onDesignChange,
  onPositionChange,
  onScaleChange,
  onVisibilityChange,
}) => {
  const { selectedOverlay, setSelectedOverlay } = useOverlayStore();

  // Organizar overlays por categoría
  const overlaysByCategory = overlays.reduce((acc, overlay) => {
    const category = overlay.overlayTypeId?.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(overlay);
    return acc;
  }, {} as Record<string, IOverlay[]>);

  const selectedOverlayData = overlays.find(o => o._id === selectedOverlay);

  return (
    <>
      {/* Panel Principal */}
      <div className="fixed right-0 top-0 w-80 h-full bg-background border-l border-border z-50 flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold">Control de Overlays</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona la visibilidad y posición de los overlays
          </p>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {Object.entries(overlaysByCategory).map(([category, categoryOverlays]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-foreground">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h4>
                  <Badge variant="secondary" className="text-xs">
                    {categoryOverlays.length}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {categoryOverlays.map(overlay => (
                    <OverlayCard
                      key={overlay._id}
                      overlay={overlay}
                      isSelected={selectedOverlay === overlay._id}
                      onSelect={() => setSelectedOverlay(
                        selectedOverlay === overlay._id ? null : overlay._id
                      )}
                      onVisibilityChange={(visible) => onVisibilityChange(overlay._id, visible)}
                      onPositionChange={(x, y) => onPositionChange(overlay._id, x, y)}
                      onScaleChange={(scale) => onScaleChange(overlay._id, scale)}
                    />
                  ))}
                </div>

                {category !== Object.keys(overlaysByCategory)[Object.keys(overlaysByCategory).length - 1] && (
                  <Separator />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Panel de Diseño */}
      {selectedOverlayData && (
        <div className={cn(
          "fixed bottom-0 right-80 w-96 max-h-[50vh] bg-background border border-border rounded-t-lg z-50",
          "shadow-lg"
        )}>
          <DesignSelector
            overlay={selectedOverlayData}
            onDesignChange={(design, customConfig) => 
              onDesignChange(selectedOverlay!, design, customConfig)
            }
            onClose={() => setSelectedOverlay(null)}
          />
        </div>
      )}
    </>
  );
};