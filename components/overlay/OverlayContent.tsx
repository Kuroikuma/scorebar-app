'use client';

import React from 'react';
import { IOverlay } from '@/app/types/overlay';
import { BaseballScoreboard } from './overlays/BaseballScoreboard';
import { BaseballScoreBug } from './overlays/BaseballScoreBug';
import { BaseballLineup } from './overlays/BaseballLineup';
import { PlayerStats } from './overlays/PlayerStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OverlayContentProps {
  overlay: IOverlay;
}

export const OverlayContent: React.FC<OverlayContentProps> = ({ overlay }) => {
  const overlayType = overlay.overlayTypeId?.name;

  // Render specific overlay content based on type
  switch (overlayType) {
    case 'baseball_scoreboard':
      return <BaseballScoreboard overlay={overlay} />;
    
    case 'baseball_scorebug':
      return <BaseballScoreBug overlay={overlay} />;
    
    case 'baseball_lineup_home':
    case 'baseball_lineup_away':
      return <BaseballLineup overlay={overlay} />;
    
    case 'baseball_player_stats':
      return <PlayerStats overlay={overlay} />;
    
    default:
      // Fallback placeholder for unknown overlay types
      return (
        <Card className="min-w-[200px] bg-background/90 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {overlay.overlayTypeId?.displayName || 'Unknown Overlay'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Tipo: {overlayType || 'No definido'}
              </p>
              <p className="text-xs text-muted-foreground">
                Diseño: {overlay.design}
              </p>
              <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                Contenido no implementado
              </div>
            </div>
          </CardContent>
        </Card>
      );
  }
};