'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { OverlayManager } from '@/components/overlay/OverlayManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { useGameOverlays, useOverlayInitialization } from '@/app/hooks/useGameOverlays';
import { SportCategory } from '@/app/types/overlay';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOverlayStore } from '@/app/store/useOverlayStore';

export default function GameOverlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const gameId = params.id as string;

  const {
      loadGameOverlays,
    } = useOverlayStore();
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const { overlays, loading, error } = useGameOverlays(gameId);
  const { initializeOverlays, loading: initializing } = useOverlayInitialization();

    // Load overlays when gameId changes
  useEffect(() => {
    if (gameId) {
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

  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      {/* Controls Panel */}
      {showControls && (
        <Card className="absolute top-4 left-4 z-40 w-80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="h-4 w-4" />
              Control de Overlays
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Edit Mode Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-mode" className="text-sm">
                Modo Edición
              </Label>
              <Switch
                id="edit-mode"
                checked={isEditMode}
                onCheckedChange={setIsEditMode}
              />
            </div>

            {/* Initialize Overlays */}
            {needsInitialization && (
              <div className="space-y-2">
                <Alert>
                  <AlertDescription>
                    No se encontraron overlays para este juego.
                  </AlertDescription>
                </Alert>
                <Button 
                  onClick={handleInitializeOverlays}
                  disabled={initializing}
                  className="w-full"
                  size="sm"
                >
                  {initializing ? 'Inicializando...' : 'Inicializar Overlays'}
                </Button>
              </div>
            )}

            {/* Overlay Count */}
            {overlays.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {overlays.length} overlays disponibles
                <br />
                {overlays.filter(o => o.visible).length} visibles
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription className="text-xs">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Controls Toggle */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 z-40"
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>

      {/* Overlay Manager */}
      <OverlayManager
        gameId={gameId}
        isEditMode={isEditMode}
      />

      {/* Background for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 pointer-events-none" />
    </div>
  );
}