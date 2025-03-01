import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Player, useTeamsStore } from '@/app/store/teamsStore';
import { useGameStore } from '@/app/store/gameStore';
import { IEditingPlayer } from '../lineup-panel';

interface AddPlayerProps {
  selectedTeam: number;
  editingPlayer: IEditingPlayer | null;
  setEditingPlayer: Dispatch<SetStateAction<IEditingPlayer | null>>;
}

const AddPlayer = ({ selectedTeam, editingPlayer, setEditingPlayer }: AddPlayerProps) => {
  const { teams, updatePlayer } = useTeamsStore();
  const { isDHEnabled } = useGameStore();
  const [newPlayers, setNewPlayers] = useState<Player>({
    name: '',
    position: '',
    number: '',
    battingOrder: 0,
    turnsAtBat: [],
    defensiveOrder: 0,
  });

  const allPositions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];
  const getAvailablePositions = () => {
    return allPositions.filter(
      (pos) =>
        ((isDHEnabled || pos !== 'DH') && !teams[selectedTeam].lineup.some((player) => player.position === pos)) ||
        (editingPlayer &&
          editingPlayer.teamIndex === selectedTeam &&
          teams[selectedTeam].lineup[editingPlayer.playerIndex].position === pos)
    );
  };

  const handleAddPlayer = () => {
    const newPlayer = newPlayers;
    if (newPlayer.name && newPlayer.position && newPlayer.number) {
      const currentLineup = teams[selectedTeam].lineup;
      const battingOrderPlayers = isDHEnabled
        ? currentLineup.filter((player) => player.position !== 'P')
        : currentLineup;

      if (editingPlayer && editingPlayer.teamIndex === selectedTeam) {
        let defensiveOrder = allPositions.findIndex((pos) => pos === newPlayer.position) + 1;
        updatePlayer(selectedTeam, editingPlayer.playerIndex, {
          ...newPlayer,
          battingOrder: isDHEnabled && newPlayer.position === 'P' ? 0 : editingPlayer.playerIndex + 1,
          defensiveOrder,
        });
        setEditingPlayer(null);
      } else {
        const playerIndex = currentLineup.length;
        let defensiveOrder = allPositions.findIndex((pos) => pos === newPlayer.position) + 1;
        const battingOrder = isDHEnabled && newPlayer.position === 'P' ? 0 : battingOrderPlayers.length + 1;
        updatePlayer(selectedTeam, playerIndex, {
          ...newPlayer,
          battingOrder,
          defensiveOrder,
        });
      }
      setNewPlayers({ name: '', position: '', number: '', battingOrder: 0, defensiveOrder: 0, turnsAtBat: [] });
    }
    setIsOpen(false);
  };

  const handleInputChange = (field: keyof Player, value: string) => {
    setNewPlayers((prev) => ({ ...prev, [field]: value }));
  };


  const [isOpen, setIsOpen] = useState(false);

  const availablePositions = getAvailablePositions();

  useEffect(() => {
    if (editingPlayer) {
      setIsOpen(true);
      setNewPlayers(teams[selectedTeam].lineup[editingPlayer.playerIndex]);
    }
  }, [editingPlayer]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-5 h-5 mr-2" />
          Crear Jugador
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#fafafa] dark:bg-[#18181b]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Crear nuevo partido de fútbol</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            value={newPlayers.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Nombre del jugador"
            className="bg-[#2d2b3b] border-0"
          />
          <Select value={newPlayers.position} onValueChange={(value) => handleInputChange('position', value)}>
            <SelectTrigger className="w-full bg-[#2d2b3b] border-0">
              <SelectValue placeholder="Selecciona posición" />
            </SelectTrigger>
            <SelectContent>
              {availablePositions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={newPlayers.number}
            onChange={(e) => handleInputChange('number', e.target.value)}
            placeholder="Número de camiseta"
            className="bg-[#2d2b3b] border-0"
          />
          <Button
            onClick={() => handleAddPlayer()}
            className="w-full bg-[#4c3f82] hover:bg-[#5a4b99]"
            disabled={!newPlayers.name || !newPlayers.position || !newPlayers.number}
          >
            {editingPlayer && editingPlayer.teamIndex === selectedTeam ? 'Actualizar jugador' : 'Añadir jugador'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPlayer;
