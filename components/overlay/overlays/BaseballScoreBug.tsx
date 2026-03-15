'use client';

import React from 'react';
import { IOverlay } from '@/app/types/overlay';
import { useGameStore } from '@/app/store/gameStore';
import { useTeamsStore } from '@/app/store/teamsStore';
import { cn } from '@/app/lib/utils';

interface BaseballScoreBugProps {
  overlay: IOverlay;
}

export const BaseballScoreBug: React.FC<BaseballScoreBugProps> = ({ overlay }) => {
  const { inning, isTopInning, balls, strikes, outs } = useGameStore();
  const { teams } = useTeamsStore();

  const getDesignClasses = (design: string) => {
    switch (design) {
      case 'modern':
        return 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white';
      case 'classic':
        return 'bg-white/95 border border-gray-800 text-gray-800';
      case 'minimal':
        return 'bg-black/80 text-white';
      case 'transparent':
        return 'bg-white/20 backdrop-blur-md text-white border border-white/30';
      default:
        return 'bg-gray-900/90 text-white';
    }
  };

  return (
    <div className={cn(
      "flex items-center gap-4 px-4 py-2 rounded-lg font-mono text-sm",
      getDesignClasses(overlay.design)
    )}>
      {/* Teams and Scores */}
      <div className="flex items-center gap-3">
        {teams.map((team, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded"
              style={{ backgroundColor: team.color }}
            />
            <span className="font-semibold">{team.shortName}</span>
            <span className="text-lg font-bold">{team.runs}</span>
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-current opacity-30" />

      {/* Inning */}
      <div className="flex items-center gap-1">
        <span className="text-xs opacity-75">INN</span>
        <span className="font-bold">
          {isTopInning ? '↑' : '↓'}{inning}
        </span>
      </div>

      {/* Count */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <span className="opacity-75">B</span>
          <span className="font-bold">{balls}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="opacity-75">S</span>
          <span className="font-bold">{strikes}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="opacity-75">O</span>
          <span className="font-bold">{outs}</span>
        </div>
      </div>
    </div>
  );
};