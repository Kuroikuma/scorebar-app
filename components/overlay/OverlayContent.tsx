'use client';

import React from 'react';
import { IOverlay } from '@/app/types/overlay';
import { BaseballScoreboard } from './overlays/BaseballScoreboard';
import { BaseballScoreBug } from './overlays/BaseballScoreBug';
import { BaseballLineup } from './overlays/BaseballLineup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameSocket } from '@/app/hooks/useGameSocket';
import { ScoreBugBallySports } from './ScoreBugBally';
import { EnhancedRunsTable } from './enhanced-runs-table';
import { BaseballFormationOverlay } from './improved-field-lineup';
import { PlayerOverlay } from './At-BatGraphic/player-stats-overlay';
import { PlayResultOverlay, PlayResultType } from './designs/baseball_play_result/PlayResultOverlay';
import { usePlayResultStore } from '@/app/store/usePlayResultStore';
import { InningScoreOverlay } from './inning-score-overlay';

interface OverlayContentProps {
  overlay: IOverlay;
}

export const OverlayContent: React.FC<OverlayContentProps> = ({ overlay }) => {
  const overlayType = overlay.overlayTypeId?.name;
  const gameId = overlay.gameId;

  // Usar el nuevo hook unificado para eventos de socket del juego
  useGameSocket(gameId);

  // Render specific overlay content based on type
  switch (overlayType) {
    case 'baseball_scoreboard':
      switch (overlay.design) {
        case 'RunsTable':
          return <EnhancedRunsTable visible={overlay.visible} />
        default:
          return <BaseballScoreboard overlay={overlay} />;
      }

    case 'baseball_scorebug':
      switch (overlay.design) {
        case 'BallySports':
          return <div className="flex-1 max-w-[100%] bg-black text-white max-[768px]:px-4 flex flex-col font-['Roboto_Condensed']">
            <ScoreBugBallySports visible={overlay.visible} />
          </div>

        default:
          return <BaseballScoreBug overlay={overlay} />;
      }

    case 'baseball_lineup_home':
      switch(overlay.design) {
        case 'defensiveHome':
          return <BaseballFormationOverlay overlayId={overlay.design} visible={overlay.visible} />;
        default:
          return <BaseballLineup overlay={overlay} />;
      }
    case 'baseball_lineup_away':
      switch(overlay.design) {
        case 'defensiveAway':
          return <BaseballFormationOverlay overlayId={overlay.design} visible={overlay.visible} />;
        default:
          return <BaseballLineup overlay={overlay} />;
      }

    case 'baseball_player_stats':
      switch(overlay.design) {
        default:
          return <PlayerOverlay visible={overlay.visible} />;
      }
    case 'baseball_play_result':
      return (
        <PlayResultOverlay
          visible={overlay.visible}
          play={(overlay.design as PlayResultType) || 'SINGLE'}
          playerName={overlay?.customConfig?.playerName ?? ""}
          detail={overlay?.customConfig?.detail ?? ""}
        />
      );
    case 'baseball_inning_change':
      switch(overlay.design) {
        case 'InningScore':
          return <InningScoreOverlay visible={overlay.visible} />
        default:
          return <InningScoreOverlay visible={overlay.visible} />;
      }

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