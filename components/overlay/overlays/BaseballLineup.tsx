'use client';

import React from 'react';
import { IOverlay } from '@/app/types/overlay';
import { useTeamsStore } from '@/app/store/teamsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/app/lib/utils';

interface BaseballLineupProps {
  overlay: IOverlay;
}

export const BaseballLineup: React.FC<BaseballLineupProps> = ({ overlay }) => {
  const { teams } = useTeamsStore();
  
  // Determine which team based on overlay type
  const isHomeTeam = overlay.overlayTypeId?.name === 'baseball_lineup_home';
  const teamIndex = isHomeTeam ? 1 : 0;
  const team = teams[teamIndex];

  if (!team) {
    return (
      <Card className="min-w-[250px]">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            No hay datos del equipo disponibles
          </p>
        </CardContent>
      </Card>
    );
  }

  const getDesignClasses = (design: string) => {
    switch (design) {
      case 'modern':
        return 'bg-gradient-to-br from-blue-600 to-purple-700 text-white';
      case 'classic':
        return 'bg-white border-2 border-gray-800 text-gray-800';
      case 'minimal':
        return 'bg-white/95 backdrop-blur-md border border-gray-200 text-gray-900';
      case 'team-colors':
        return `text-white border-2`;
      default:
        return 'bg-white border border-gray-300 text-gray-900';
    }
  };

  const cardStyle = overlay.design === 'team-colors' ? {
    backgroundColor: team.color,
    borderColor: team.textColor || '#ffffff'
  } : {};

  return (
    <Card 
      className={cn("min-w-[280px] font-mono", getDesignClasses(overlay.design))}
      style={cardStyle}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-center flex items-center justify-center gap-2">
          <div 
            className="w-4 h-4 rounded"
            style={{ backgroundColor: team.color }}
          />
          {team.name} - {isHomeTeam ? 'LOCAL' : 'VISITANTE'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {team.lineup && team.lineup.length > 0 ? (
          team.lineup.map((player, index) => (
            <div 
              key={player._id || index}
              className={cn(
                "flex items-center justify-between p-2 rounded text-sm",
                team.currentBatter === index && "bg-yellow-400/20 font-bold"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 text-center font-bold">
                  {index + 1}
                </span>
                <span className="font-medium">
                  {player.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="opacity-75">{player.position}</span>
                {player.battingAverage && (
                  <span className="font-mono">
                    .{Math.round(player.battingAverage * 1000).toString().padStart(3, '0')}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            Lineup no disponible
          </div>
        )}

        {/* Current Batter Indicator */}
        {team.currentBatter !== undefined && team.lineup && team.lineup[team.currentBatter] && (
          <div className="border-t pt-2 mt-2">
            <div className="text-xs font-medium opacity-75 mb-1">AL BATE:</div>
            <div className="font-bold">
              #{team.currentBatter + 1} {team.lineup[team.currentBatter].name}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};