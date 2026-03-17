'use client';

import React, { useEffect } from 'react';
import { IOverlay } from '@/app/types/overlay';
import { useOverlayDesigns } from '@/app/hooks/useOverlayTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Palette } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { useOverlayStore } from '@/app/store/useOverlayStore';

interface DesignSelectorProps {
  overlay: IOverlay;
  onDesignChange: (design: string, customConfig?: Record<string, any>) => void;
  onClose: () => void;
}

export const DesignSelector: React.FC<DesignSelectorProps> = ({
  overlay,
  onDesignChange,
  onClose,
}) => {
  const overlayType = overlay.overlayTypeId

  if (!overlayType) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Diseños</h4>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          No se encontró información del tipo de overlay
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <h4 className="text-sm font-medium">
            Diseños para {overlayType.displayName}
          </h4>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {overlayType.availableDesigns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No hay diseños disponibles para este overlay
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {overlayType.availableDesigns.map((design) => (
              <Card
                key={design}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  overlay.design === design && "ring-2 ring-primary bg-accent/50"
                )}
                onClick={() => onDesignChange(design)}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    {/* Design Preview Placeholder */}
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                      <div className="text-xs text-muted-foreground text-center">
                        <div className="font-medium">{design}</div>
                        <div>Preview</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={overlay.design === design ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {design}
                      </Badge>
                      
                      {overlay.design === design && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <Check className="h-3 w-3" />
                          Activo
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};