import { useGameStore } from '@/app/store/gameStore';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Switch } from './ui/switch';
import { AdvanceRunners } from './gameComponent/advance-runners';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/app/lib/utils';
import { Icon } from 'lucide-react';
import { hatBaseball } from '@lucide/lab';
import { useTeamsStore } from '@/app/store/teamsStore';

const ControlBase = () => {
  const { bases, setBase, handleOutsChange, outs, isTopInning } = useGameStore();
  const { teams } = useTeamsStore();

  const teamIndex = isTopInning ? 0 : 1;
  const currentTeam = teams[teamIndex];

  const handleBaseChange = (index: number, checked: boolean) => {
    const base = { isOccupied: checked, playerId: null };

    setBase(base, index);
  };

  const baseNames = ['1st', '2nd', '3rd', 'Home'];

  const handleBaseClick = (base: boolean, index: number) => {
    console.log(base, index);

    if (!base) {
      // Si la base está ocupada y el usuario hace clic, mostrar el modal
      setSelectedBase(index);
      setIsModalOpen(true);
    } else {
      handleBaseChange(index, true);
      setIsModalOpen(false);
    }
  };

  const handleMarkOut = () => {
    handleBaseChange(selectedBase as number, false);
    handleOutsChange(outs + 1, true, false);
    setIsModalOpen(false);
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedBase, setSelectedBase] = useState<number | null>(null);

  const returnNameBae = (index: number) => {
    return index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : '4th';
  };

  const getOccupiedBases = () => {
    return bases
      .map((base, index) => ({ base: index, isOccupied: base.isOccupied, playerId: base.playerId }))
      .filter((base) => base.isOccupied)
      .sort((a, b) => b.base - a.base); // Ordenar de 3ra a 1ra
  };

  return (
    <>
      <Card className="bg-[#1a1625] border-[#2d2b3b] text-white">
        <CardHeader className="flex justify-between">
          <CardTitle className="text-lg font-medium">Control Bases</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {['1st', '2nd', '3rd'].map((base, index) => (
              <div key={base} className="flex items-center justify-between">
                <span className="text-sm text-white font-semibold">{base} Base Runner</span>
                <Switch
                  checked={bases[index].isOccupied}
                  onCheckedChange={(checked) => handleBaseClick(checked, index)}
                  className="data-[state=checked]:bg-[#4c3f82]"
                />
              </div>
            ))}
          </div>

          <div className="py-2 space-y-4">
            {getOccupiedBases().map(({ base, playerId }) => (
              <div key={base} className={cn('rounded-lg p-4 transition-all duration-200', 'bg-gray-700/30')}>
                <div className="flex items-center gap-3">
                  <Icon iconNode={hatBaseball} className="w-5 h-5" />
                  <span>{playerId ? currentTeam.lineup.find((player) => player._id === playerId)?.name : "Corredor"} en {baseNames[base]}</span>
                </div>
              </div>
            ))}
          </div>

          <AdvanceRunners />
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Desmarcar base?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Quieres marcar un out al desmarcar la {returnNameBae(selectedBase as number)}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleBaseChange(selectedBase as number, false)}>
              Solo desmarcar base
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleMarkOut}>Desmarcar y marcar out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ControlBase;
