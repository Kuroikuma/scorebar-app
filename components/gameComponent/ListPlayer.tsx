import { Dispatch, SetStateAction } from 'react';
import { IEditingPlayer } from '../lineup-panel';
import { useTeamsStore } from '@/app/store/teamsStore';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { Icon } from 'lucide-react';
import { golfDriver } from '@lucide/lab';

interface ListPlayerProps {
  selectedTeam: number;
  setEditingPlayer: Dispatch<SetStateAction<IEditingPlayer | null>>;
}

const ListPlayer = ({ selectedTeam, setEditingPlayer }: ListPlayerProps) => {
  const { teams, updatePlayer } = useTeamsStore();
  const team = teams[selectedTeam];

  const handleEditPlayer = (playerIndex: number) => {
    setEditingPlayer({ teamIndex: selectedTeam, playerIndex });
  };

  const handleDeletePlayer = (playerIndex: number) => {
    const newLineup = [...teams[selectedTeam].lineup];
    newLineup.splice(playerIndex, 1);
    updatePlayer(selectedTeam, playerIndex, null);
  };

  return (
    <div className="space-y-2">
      {team.lineup.map((player, index) => (
        <div key={index} className="flex justify-between items-center bg-[#2d2b3b] p-2 rounded">
          <span className='cursor-move'>
            {index + 1}. {player.name} ({player.position}) #{player.number}
          </span>
          <div>
            <Button variant="ghost" size="sm" onClick={() => handleEditPlayer(index)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleDeletePlayer(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" >
              <Icon className="h-4 w-4" iconNode={golfDriver} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListPlayer;
