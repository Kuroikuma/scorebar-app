import { IOverlays, useGameStore } from '@/app/store/gameStore';
import { BaseballFormationOverlay } from '@/components/overlay/improved-field-lineup';
import { EnhancedRunsTable } from '@/components/overlay/enhanced-runs-table';
import { ScoreBugBallySports } from '@/components/overlay/ScoreBugBally';
import { InningScoreOverlay } from '@/components/overlay/inning-score-overlay';
import { PlayerOverlay } from '@/components/overlay/player-stats-overlay';
import { useSocketHandleOverlays } from '@/app/hooks/useSocketHandleOverlayGame';

interface IOverlaysItemProps {
  item: IOverlays;
  gameId: string;
}

interface ScorebugProps {
  item: IOverlays;
}

export const OverlaysItem = ({ item, gameId }: IOverlaysItemProps) => {
  useSocketHandleOverlays(item, gameId);

  return item.id === 'scorebug' ? (
    <ScoreBoard item={item} />
  ) : item.id === 'formationA' ? (
    <BaseballFormationOverlay overlayId="formationA" visible={item.visible} />
  ) : item.id === 'formationB' ? (
    <BaseballFormationOverlay overlayId="formationB" visible={item.visible} />
  ) : item.id === 'scoreboard' ? (
    <EnhancedRunsTable visible={item.visible} />
  ) : item.id === 'scoreboardMinimal' ? (
    <InningScoreOverlay visible={item.visible} />
  ) : item.id === 'playerStats' ? (
    <PlayerOverlay visible={item.visible} />
  ) : (
    <></>
  );
};

const ScoreBoard = ({ item }: ScorebugProps) => {
  return (
    <div className="flex-1 max-w-[100%] bg-black text-white max-[768px]:px-4 flex flex-col font-['Roboto_Condensed']">
      <ScoreBugBallySports visible={item.visible} />
    </div>
  );
};
