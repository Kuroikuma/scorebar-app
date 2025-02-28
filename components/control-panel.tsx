'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useTeamsStore } from '@/app/store/teamsStore';
import { useGameStore } from '@/app/store/gameStore';
import { useUIStore } from '@/app/store/uiStore';
import { HitPlay } from './hitPlay';
import { ErrorPlay } from './errorPlay';
import Undo from './undo';
import Redo from './redo';
import ControlBase from './ControlBase';

export function ControlPanel() {
  const {
    balls,
    strikes,
    outs,
    inning,
    changeInning,
    isTopInning,
    handleBallChange,
    handleStrikeChange,
    handleOutsChange,
    changeIsTopInning,
  } = useGameStore();
  const { teams, incrementRuns, incrementHits, incrementErrors, decrementHits, decrementErrors } = useTeamsStore();
  const { scoreboardStyle, setScoreboardStyle } = useUIStore();

  let teamIndex = isTopInning ? 0 : 1;
  let hits = teams[teamIndex].hits;
  let errors = teams[teamIndex].errorsGame;

  return (
    <>
      <Card className="bg-[#1a1625] border-[#2d2b3b] text-white">
        <CardHeader className="flex justify-between">
          <CardTitle className="text-lg font-medium">Control Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <HitPlay />
            <ErrorPlay />
            <Undo />
            <Redo />
          </div>

          {/* Scoreboard Style */}
          <div className="space-y-2">
            <Label className="text-sm text-white font-semibold">Scoreboard Style</Label>
            <Select value={scoreboardStyle} onValueChange={(value: 'classic' | 'modern') => setScoreboardStyle(value)}>
              <SelectTrigger className="w-full bg-[#4c3f82] border-0">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Balls and Strikes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-semibold">Balls</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#2d2b3b] hover:bg-[#363447]"
                  onClick={() => handleBallChange(Math.max(0, balls - 1))}
                >
                  -1
                </Button>
                <span className="w-8 text-center text-lg">{balls}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#4c3f82] hover:bg-[#5a4b99]"
                  onClick={() => handleBallChange(Math.min(4, balls + 1))}
                >
                  +1
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-semibold">Strikes</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#2d2b3b] hover:bg-[#363447]"
                  onClick={() => handleStrikeChange(Math.max(0, strikes - 1))}
                >
                  -1
                </Button>
                <span className="w-8 text-center text-lg">{strikes}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#4c3f82] hover:bg-[#5a4b99]"
                  onClick={() => handleStrikeChange(Math.min(3, strikes + 1))}
                >
                  +1
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-semibold">Hits</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#2d2b3b] hover:bg-[#363447]"
                  onClick={() => decrementHits(Math.max(0, hits - 1))}
                >
                  -1
                </Button>
                <span className="w-8 text-center text-lg">{hits}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#4c3f82] hover:bg-[#5a4b99]"
                  onClick={() => incrementHits(strikes + 1)}
                >
                  +1
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-semibold">Errors</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#2d2b3b] hover:bg-[#363447]"
                  onClick={() => decrementErrors(Math.max(0, strikes - 1))}
                >
                  -1
                </Button>
                <span className="w-8 text-center text-lg">{errors}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#4c3f82] hover:bg-[#5a4b99]"
                  onClick={() => incrementErrors(errors + 1)}
                >
                  +1
                </Button>
              </div>
            </div>
          </div>

          {/* Outs */}
          <div className="space-y-2">
            <span className="text-sm text-white font-semibold">Outs</span>
            <Select value={outs.toString()} onValueChange={(value) => handleOutsChange(parseInt(value))}>
              <SelectTrigger className="w-full bg-[#4c3f82] border-0">
                <SelectValue placeholder="Select outs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 Outs</SelectItem>
                <SelectItem value="1">1 Out</SelectItem>
                <SelectItem value="2">2 Outs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Base Runners */}
          <ControlBase />

          {/* Team Runs */}
          {teams.map((team, teamIndex) => (
            <div key={team.name} className="space-y-2">
              <span className="text-sm text-white font-semibold">{team.name} Runs</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#2d2b3b] hover:bg-[#363447]"
                  onClick={() => incrementRuns(teamIndex, -1)}
                >
                  -1
                </Button>
                <span className="w-8 text-center text-lg">{team.runs}</span>
                {[1, 2, 3, 4].map((increment) => (
                  <Button
                    key={increment}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 bg-[#4c3f82] hover:bg-[#5a4b99]"
                    onClick={() => incrementRuns(teamIndex, increment)}
                  >
                    +{increment}
                  </Button>
                ))}
              </div>
            </div>
          ))}

          {/* Inning */}
          <div className="space-y-4">
            <div>
              <span className="text-sm text-white font-semibold">Top or Bottom Inning</span>
              <Select
                value={isTopInning ? 'top' : 'bottom'}
                onValueChange={(value) => changeIsTopInning(value === 'top')}
              >
                <SelectTrigger className="w-full mt-2 bg-[#4c3f82] border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-semibold">Inning</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#2d2b3b] hover:bg-[#363447]"
                  onClick={() => changeInning(false)}
                  disabled={isTopInning && inning === 1}
                >
                  -
                </Button>
                <span className="w-8 text-center text-lg">{inning}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[#4c3f82] hover:bg-[#5a4b99]"
                  onClick={() => changeInning(true)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
