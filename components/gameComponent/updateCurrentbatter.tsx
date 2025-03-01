import { useGameStore } from '@/app/store/gameStore';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTeamsStore } from '@/app/store/teamsStore';

const UpdateCurrentBatter = () => {
  const { isTopInning, getCurrentBatter } = useGameStore();
  const { teams } = useTeamsStore();

  const currentBatter = getCurrentBatter();

  const currentTeam = teams[isTopInning ? 0 : 1];

  const handleCurrentBatterChange = (newCurrentBatterId: string) => {
    const newCurrentBatterIndex = currentTeam.lineup.findIndex((player) => player._id === newCurrentBatterId);
    if (newCurrentBatterIndex !== -1) {
      useTeamsStore.getState().changeCurrentBatter(newCurrentBatterIndex);
    }
  };

  return (
    <div className="space-y-2 pt-2">
      <Label className="text-sm text-white font-semibold"> Cambiar bateador en turno </Label>
      <Select value={currentBatter?._id} onValueChange={(value: string) => handleCurrentBatterChange(value)}>
        <SelectTrigger className="w-full bg-[#4c3f82] border-0">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent>
          {currentTeam.lineup.map((player) => (
            <SelectItem key={player._id} value={player._id as string}>
              #{player.number} {player.name} ({player.position})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default UpdateCurrentBatter;
