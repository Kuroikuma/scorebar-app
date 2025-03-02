import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronRight, MonitorIcon as Running, X, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGameStore } from '@/app/store/gameStore';
import { cn } from '@/app/lib/utils';

interface RunnerAdvance {
  fromBase: number;
  toBase: number | null;
  isOut?: boolean;
}

interface BaseOccupancy {
  base: number;
  isOccupied: boolean;
  runnerId?: string;
}

export function AdvanceRunners() {
  const { bases, outs, handleAdvanceRunners } = useGameStore();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentOuts, setCurrentOuts] = useState<number>(outs);
  const [runnerAdvances, setRunnerAdvances] = useState<RunnerAdvance[]>([]);
  const [step, setStep] = useState<'select-runners' | 'resolve-advances'>('select-runners');

  const baseNames = ['1st', '2nd', '3rd', 'Home'];

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
  };

  const resetState = () => {
    setStep('select-runners');
    setRunnerAdvances([]);
    setCurrentOuts(outs);
  };

  useEffect(() => {
    if (!isModalOpen) {
      resetState();
    }
  }, [isModalOpen]);

  const getOccupiedBases = () => {
    return bases.map((base, index) => ({ base: index, isOccupied: base.isOccupied })).filter((base) => base.isOccupied);
  };

  // Función para verificar si un avance es legal
  const isLegalAdvance = (fromBase: number, toBase: number): boolean => {
    // No se puede avanzar hacia atrás
    if (toBase <= fromBase) return false;

    // Verificar interferencia con otros corredores
    for (let i = fromBase + 1; i < toBase; i++) {
      // Si hay un corredor en una base intermedia
      if (bases[i].isOccupied) {
        // Verificar si ese corredor está intentando avanzar
        const intermediateRunnerAdvance = runnerAdvances.find((adv) => adv.fromBase === i);

        // Si el corredor intermedio no está avanzando o está avanzando menos que el corredor actual,
        // no se permite el avance (regla de interferencia)
        if (!intermediateRunnerAdvance || intermediateRunnerAdvance.toBase! <= toBase) {
          return false;
        }
      }
    }

    // No se pueden saltar bases vacías
    if (toBase - fromBase > 1) {
      for (let i = fromBase + 1; i < toBase; i++) {
        const isBaseOccupied = bases[i].isOccupied;
        const isBaseTargeted = runnerAdvances.some((adv) => adv.toBase === i);

        // Si la base intermedia no está ocupada ni será ocupada, no se permite el avance
        if (!isBaseOccupied && !isBaseTargeted) {
          return false;
        }
      }
    }

    // Verificar si la base destino ya está ocupada o será ocupada por otro corredor
    const isBaseTargeted = runnerAdvances.some((advance) => advance.toBase === toBase && advance.fromBase !== fromBase);
    if (bases[toBase]?.isOccupied || isBaseTargeted) return false;

    // Verificar que no haya corredores bloqueando el avance
    const blockingRunners = runnerAdvances.filter(
      (advance) => advance.fromBase > fromBase && advance.fromBase < toBase && advance.toBase === null
    );
    if (blockingRunners.length > 0) return false;

    return true;
  };

  const getAvailableBases = (fromBase: number): number[] => {
    const availableBases: number[] = [];

    // Primero, verificar la siguiente base (avance normal)
    if (isLegalAdvance(fromBase, fromBase + 1)) {
      availableBases.push(fromBase + 1);
    }

    // Luego, verificar bases adicionales solo si las condiciones lo permiten
    for (let i = fromBase + 2; i < 4; i++) {
      // Verificar si todos los corredores intermedios están avanzando más allá de esta base
      const canAdvanceToBase = isLegalAdvance(fromBase, i);
      if (canAdvanceToBase) {
        const allIntermediateRunnersAdvancing = Array.from(
          { length: i - fromBase - 1 },
          (_, idx) => fromBase + idx + 1
        ).every((intermediateBase) => {
          if (bases[intermediateBase].isOccupied) {
            const intermediateAdvance = runnerAdvances.find((adv) => adv.fromBase === intermediateBase);
            return intermediateAdvance && intermediateAdvance.toBase! > i;
          }
          return true;
        });

        if (allIntermediateRunnersAdvancing) {
          availableBases.push(i);
        }
      }
    }

    return availableBases;
  };

  const handleSelectRunner = (fromBase: number) => {
    if (!runnerAdvances.some((advance) => advance.fromBase === fromBase)) {
      setRunnerAdvances((prev) => [...prev, { fromBase, toBase: null }]);
    }
  };

  const handleSelectBase = (runner: RunnerAdvance, toBase: number) => {
    // Verificar si el avance es legal
    if (!isLegalAdvance(runner.fromBase, toBase)) {
      return;
    }

    setRunnerAdvances((prev) =>
      prev.map((advance) => (advance.fromBase === runner.fromBase ? { ...advance, toBase } : advance))
    );
  };

  const handleResolveAdvances = () => {
    if (runnerAdvances.some((advance) => advance.toBase === null)) {
      return;
    }
    setStep('resolve-advances');
  };

  const handleRunnerResult = (fromBase: number, isOut: boolean) => {
    if (currentOuts >= 3) return;

    // Verificar el orden de resolución
    const shouldResolveFirst = runnerAdvances
      .filter((advance) => advance.isOut === undefined)
      .some((advance) => advance.fromBase > fromBase);

    if (shouldResolveFirst) {
      return; // No permitir resolver este corredor aún
    }

    setRunnerAdvances((prev) =>
      prev.map((advance) => (advance.fromBase === fromBase ? { ...advance, isOut } : advance))
    );

    if (isOut) {
      setCurrentOuts((prev) => prev + 1);
    }

    const updatedAdvances = runnerAdvances.map((advance) =>
      advance.fromBase === fromBase ? { ...advance, isOut } : advance
    );

    // Si todos los avances han sido resueltos o hay 3 outs
    if (updatedAdvances.every((advance) => advance.isOut !== undefined) || currentOuts + 1 >= 3) {
      handleAdvanceRunners(updatedAdvances);
      setIsModalOpen(false);
    }
  };

  const isRunnerSelected = (base: number) => {
    return runnerAdvances.some((advance) => advance.fromBase === base);
  };

  const canResolveRunner = (fromBase: number): boolean => {
    return !runnerAdvances
      .filter((advance) => advance.isOut === undefined)
      .some((advance) => advance.fromBase > fromBase);
  };

  const getRunnerStatus = (base: number): string => {
    const availableBases = getAvailableBases(base);
    if (availableBases.length === 0) {
      // Explicar por qué no hay bases disponibles
      if (base < 2 && bases[base + 1].isOccupied) {
        const nextBase = baseNames[base + 1];
        const isAdvancing = runnerAdvances.some((adv) => adv.fromBase === base + 1 && adv.toBase !== null);
        if (!isAdvancing) {
          return `No puede avanzar: Corredor en ${nextBase} bloqueando el avance`;
        }
      }
      return 'No hay bases disponibles para avanzar';
    }
    return `Puede avanzar a: ${availableBases.map((b) => baseNames[b]).join(', ')}`;
  };

  return (
    <>
      <Button
        variant="outline"
        className="bg-[#4c3f82] hover:bg-[#5a4b99] text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95"
        onClick={() => setIsModalOpen(true)}
        disabled={!getOccupiedBases().length}
      >
        <Running className="w-5 h-5 mr-2" />
        Avanzar Corredores
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-gray-800/95 backdrop-blur-sm text-white border-[#2d2b3b] rounded-xl shadow-2xl max-w-md w-full mx-auto">
          {step === 'select-runners' ? (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">Avanzar Corredores</DialogTitle>
                <DialogDescription className="text-gray-300">
                  <p>Selecciona los corredores que intentarán avanzar y a qué base.</p>
                  <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-medium mb-2 text-purple-300">Reglas de Avance:</h4>
                    <ul className="text-sm space-y-1 text-purple-200/70">
                      <li>• Los corredores solo pueden avanzar a bases disponibles</li>
                      <li>• No se pueden saltar bases a menos que estén ocupadas</li>
                      <li>• Las bases deben resolverse en orden (3ra → 1ra)</li>
                    </ul>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                {getOccupiedBases().map(({ base }) => (
                  <div key={base} className="rounded-lg bg-gray-700/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Running className="w-5 h-5" />
                        <span>Corredor en {baseNames[base]}</span>
                      </div>
                      {!isRunnerSelected(base) ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-purple-500 text-purple-400 hover:bg-purple-500/20"
                                  onClick={() => handleSelectRunner(base)}
                                  disabled={getAvailableBases(base).length === 0}
                                >
                                  Seleccionar
                                </Button>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{getRunnerStatus(base)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Avanzar a:</span>
                          {getAvailableBases(base).map((toBase) => (
                            <Button
                              key={toBase}
                              size="sm"
                              variant="outline"
                              className={cn(
                                'min-w-[60px]',
                                runnerAdvances.find((r) => r.fromBase === base)?.toBase === toBase
                                  ? 'bg-purple-500 text-white'
                                  : 'border-purple-500 text-purple-400 hover:bg-purple-500/20'
                              )}
                              onClick={() => handleSelectBase(runnerAdvances.find((r) => r.fromBase === base)!, toBase)}
                            >
                              {baseNames[toBase]}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <DialogFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-0"
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  onClick={handleResolveAdvances}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!runnerAdvances.length || runnerAdvances.some((r) => r.toBase === null)}
                >
                  Resolver Avances
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">Resolver Avances</DialogTitle>
                <DialogDescription className="text-gray-300 space-y-4">
                  <p className="text-sm">
                    Indica si cada corredor fue safe o out en su intento de avance. Resuelve los avances en orden,
                    comenzando desde tercera base.
                  </p>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                    <span className="text-sm font-medium">Outs en el inning:</span>
                    <div className="flex items-center gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'w-3 h-3 rounded-full transition-all duration-300',
                            i < currentOuts ? 'bg-red-500 scale-110' : 'bg-gray-600'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  {currentOuts >= 3 && (
                    <div className="text-red-400 font-semibold text-center p-2 rounded-lg bg-red-500/20 border border-red-500/30">
                      ¡3 Outs! Inning terminado
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 space-y-4">
                {runnerAdvances
                  .sort((a, b) => b.fromBase - a.fromBase) // Ordenar de 3ra a 1ra
                  .map((advance) => {
                    const canResolve = canResolveRunner(advance.fromBase);

                    return (
                      <div
                        key={advance.fromBase}
                        className={cn(
                          'relative rounded-lg p-4 transition-all duration-200',
                          advance.isOut !== undefined ? 'opacity-50' : canResolve ? 'bg-gray-700/30' : 'bg-gray-700/10'
                        )}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{baseNames[advance.fromBase]}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{baseNames[advance.toBase!]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {!canResolve && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Resuelve primero los corredores de bases superiores</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <div className="flex gap-2">
                              <Button
                                variant={advance.isOut === false ? 'default' : 'outline'}
                                size="sm"
                                disabled={advance.isOut !== undefined || currentOuts >= 3 || !canResolve}
                                className={cn(
                                  'transition-all duration-200',
                                  advance.isOut === false
                                    ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20'
                                    : 'border-green-600 text-green-600 hover:bg-green-900/20'
                                )}
                                onClick={() => handleRunnerResult(advance.fromBase, false)}
                              >
                                <Check className="mr-1 h-4 w-4" />
                                Safe
                              </Button>
                              <Button
                                variant={advance.isOut === true ? 'default' : 'outline'}
                                size="sm"
                                disabled={advance.isOut !== undefined || currentOuts >= 3 || !canResolve}
                                className={cn(
                                  'transition-all duration-200',
                                  advance.isOut === true
                                    ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20'
                                    : 'border-red-600 text-red-600 hover:bg-red-900/20'
                                )}
                                onClick={() => handleRunnerResult(advance.fromBase, true)}
                              >
                                <X className="mr-1 h-4 w-4" />
                                Out
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setStep('select-runners')}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-0"
                >
                  Volver
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
