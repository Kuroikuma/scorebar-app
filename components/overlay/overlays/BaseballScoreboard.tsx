'use client';

import React from 'react';
import { IOverlay } from '@/app/types/overlay';
import { useGameStore } from '@/app/store/gameStore';
import { useTeamsStore } from '@/app/store/teamsStore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/app/lib/utils';

interface BaseballScoreboardProps {
  overlay: IOverlay;
}

export const BaseballScoreboard: React.FC<BaseballScoreboardProps> = ({ overlay }) => {
  const { inning, isTopInning, balls, strikes, outs } = useGameStore();
  const { teams } = useTeamsStore();

  const getDesignClasses = (design: string) => {
    switch (design) {
      case 'modern':
        return 'bg-gradient-to-br from-blue-600 to-purple-700 text-white shadow-xl';
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

  return (
    <Card className={cn(
      "min-w-[320px] font-mono",
      getDesignClasses(overlay.design)
    )}>
      <CardHeader className="pb-2">
        <div className="text-center">
          <h2 className="text-lg font-bold">MARCADOR</h2>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teams Section */}
        <div className="space-y-2">
          {teams.map((team, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: team.color }}
                />
                <span className="font-semibold text-lg">
                  {team.shortName || team.name}
                </span>
              </div>
              <div className="text-2xl font-bold">
                {team.runs}
              </div>
            </div>
          ))}
        </div>

        {/* Game Info */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Inning:</span>
            <span className="font-bold">
              {isTopInning ? '↑' : '↓'} {inning}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Count:</span>
            <span className="font-mono">
              {balls}B - {strikes}S - {outs}O
            </span>
          </div>
        </div>

        {/* Hits and Errors */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium mb-1">HITS</div>
            {teams.map((team, index) => (
              <div key={index} className="flex justify-between">
                <span>{team.shortName}</span>
                <span>{team.hits}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="font-medium mb-1">ERRORS</div>
            {teams.map((team, index) => (
              <div key={index} className="flex justify-between">
                <span>{team.shortName}</span>
                <span>{team.errorsGame}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};