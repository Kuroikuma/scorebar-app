'use client';

import React, { useState } from 'react';
import { useGameOverlays } from '@/app/hooks/useGameOverlays';
import { OverlayManager } from './OverlayManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Settings, Layers } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface GameOverlayIntegrationProps {
  gameId: string;
  className?: string;
}

/**
 * Componente de integración que puede ser usado en páginas de juego existentes
 * para agregar el nuevo sistema de overlays desacoplados
 */
export const GameOverlayIntegration: React.FC<GameOverlayIntegrationProps> = ({
  gameId,
  className
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showOverlays, setShowOverlays] = useState(true);
  const [showControls, setShowControls] = useState(false);

  const { overlays, loading, error, isConnected } = useGameOverlays(gameId);

  const visibleOverlays = overlays.filter(overlay => overlay.visible);

  if (!showOverlays) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowOverlays(true)}
          className="bg-background/80 backdrop-blur-sm"
        >
          <Layers className="h-4 w-4 mr-2" />
          Mostrar Overlays
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Overlay Manager */}
      <OverlayManager
        gameId={gameId}
        isEditMode={isEditMode}
      />

      {/* Quick Controls */}
      {showControls && (
        <Card className="fixed top-4 right-4 z-40 w-64 bg-background/95 backdrop-blur-sm">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Overlays</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isConnected ? "default" : "destructive"}
                  className="text-xs"
                >
                  {isConnected ? 'Conectado' : 'Desconectado'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowControls(false)}
                >
                  <EyeOff className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {loading && (
              <div className="text-xs text-muted-foreground">
                Cargando overlays...
              </div>
            )}

            {error && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                {error}
              </div>
            )}

            {!loading && !error && (
              <>
                <div className="text-xs text-muted-foreground">
                  {overlays.length} overlays • {visibleOverlays.length} visibles
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-mode" className="text-xs">
                    Modo Edición
                  </Label>
                  <Switch
                    id="edit-mode"
                    checked={isEditMode}
                    onCheckedChange={setIsEditMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-overlays" className="text-xs">
                    Mostrar Overlays
                  </Label>
                  <Switch
                    id="show-overlays"
                    checked={showOverlays}
                    onCheckedChange={setShowOverlays}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Toggle Controls Button */}
      {!showControls && (
        <Button
          variant="outline"
          size="sm"
          className="fixed top-4 right-4 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setShowControls(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}

      {/* Hide Overlays Button */}
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-40 bg-background/80 backdrop-blur-sm"
        onClick={() => setShowOverlays(false)}
      >
        <Eye className="h-4 w-4 mr-2" />
        Ocultar Overlays
      </Button>
    </div>
  );
};