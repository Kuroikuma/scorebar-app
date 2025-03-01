import { useGameStore } from '@/app/store/gameStore';
import CurrentBatter from './CurrentBatter';
import CurrentPitcher from './CurrentPitcher';
import { darkenColor } from '@/app/lib/utils';

interface CurrentPlayerProps {
  teamIndex: number;
  color: string;
}

const CurrentPlayer = ({ teamIndex, color }: CurrentPlayerProps) => {
  const { isTopInning } = useGameStore();

  return (
    <div className="px-[6px] pt-[6px]">
      <div className="border-x-4 h-9 border-t-4 border-white" style={{ backgroundColor: darkenColor(color, 50) }}>
        {teamIndex === 0 ? (
          isTopInning ? (
            <CurrentBatter />
          ) : (
            <CurrentPitcher />
          )
        ) : isTopInning ? (
          <CurrentPitcher />
        ) : (
          <CurrentBatter />
        )}
      </div>
    </div>
  );
};

export default CurrentPlayer;
