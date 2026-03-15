'use client';

import React from 'react';
import { IOverlay } from '@/app/types/overlay';
import { useTeamsStore } from '@/app/store/teamsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/app/lib/utils';

interface PlayerStatsProps {
  overlay: IOverlay;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ overlay }) => {
  const { teams } = useTeamsStore();
  
  // Get current batter from both teams
  const getCurrentBatter = () => {
    for (const team of teams) {
      if (team.currentBatter !== undefined && team.lineup && team.lineup[team.currentBatter]) {
        return {
          player: team.lineup[team.currentBatter],
          team: team
        };
      }
    }
    return null;
  };

  const currentBatter = getCurrentBatter();

  const getDesignClasses = (design: string) => {
    switch (design) {
      case 'modern':
        return 'bg-gradient-to-br from-green-600 to-blue-700 text-white';
      case 'classic':
        return 'bg-white border-2 border-gray-800 text-gray-800';
      case 'minimal':
        return 'bg-white/95 backdrop-blur-md border border-gray-200 text-gray-900';
      case 'dark':
        return 'bg-gray-900 text-white border border-gray-700';
      default:
        return 'bg-white border border-gray-300 text-gray-900';
    }
  };

  if (!currentBatter) {
    return (
      <Card className={cn("min-w-[300px]", getDesignClasses(overlay.design))}>
        <CardContent className="p-4 text-center">
          <p className="text-sm opacity-75">
            No hay bateador activo
          </p>
        </CardContent>
      </Card>
    );
  }

  const { player, team } = currentBatter;

  return (
    <Card className={cn("min-w-[320px] font-mono", getDesignClasses(overlay.design))}>
      <CardHeader className="pb-2">
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: team.color }}
          />
          AL BATE
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Player Info */}
        <div className="text-center space-y-1">
          <div className="text-xl font-bold">{player.name}</div>
          <div className="text-sm opacity-75">
            #{player.number || '00'} • {player.position}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="opacity-75">AVG:</span>
              <span className="font-bold">
                .{Math.round((player.battingAverage || 0) * 1000).toString().padStart(3, '0')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">HR:</span>
              <span className="font-bold">{player.homeRuns || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">RBI:</span>
              <span className="font-bold">{player.rbis || 0}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="opacity-75">H:</span>
              <span className="font-bold">{player.hits || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">R:</span>
              <span className="font-bold">{player.runs || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">SO:</span>
              <span className="font-bold">{player.strikeouts || 0}</span>
            </div>
          </div>
        </div>

        {/* Season Stats */}
        {(player.seasonStats || player.gameStats) && (
          <div className="border-t pt-3 space-y-2">
            <div className="text-xs font-medium opacity-75 text-center">
              TEMPORADA 2024
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div>
                <div className="opacity-75">AB</div>
                <div className="font-bold">{player.seasonStats?.atBats || 0}</div>
              </div>
              <div>
                <div className="opacity-75">OBP</div>
                <div className="font-bold">
                  .{Math.round((player.seasonStats?.onBasePercentage || 0) * 1000).toString().padStart(3, '0')}
                </div>
              </div>
              <div>
                <div className="opacity-75">SLG</div>
                <div className="font-bold">
                  .{Math.round((player.seasonStats?.sluggingPercentage || 0) * 1000).toString().padStart(3, '0')}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};