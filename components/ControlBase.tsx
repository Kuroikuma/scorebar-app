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

const ControlBase = () => {
  const { bases, setBase, handleOutsChange, outs } = useGameStore();

  const handleBaseChange = (index: number, checked: boolean) => {
    const newBases = [...bases];
    newBases[index] = checked;
    setBase(checked, index);
  };

  const handleBaseClick = (base: boolean, index: number) => {
    if (base) {
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

  return (
    <>
      <div className="space-y-4">
        {['1st', '2nd', '3rd'].map((base, index) => (
          <div key={base} className="flex items-center justify-between">
            <span className="text-sm text-white font-semibold">{base} Base Runner</span>
            <Switch
              checked={bases[index]}
              onCheckedChange={(checked) => handleBaseClick(checked, index)}
              className="data-[state=checked]:bg-[#4c3f82]"
            />
          </div>
        ))}
      </div>

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
