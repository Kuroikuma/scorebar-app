import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { ArrowRight, Check, ChevronRight, MonitorIcon as Running, X, AlertCircle, ArrowRightLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGameStore } from "@/app/store/gameStore"
import { cn } from "@/app/lib/utils"
import { Icon } from 'lucide-react';
import { hatBaseball } from '@lucide/lab';

interface RunnerAdvance {
  fromBase: number
  toBase: number | null
  isOut?: boolean
  dependsOn?: number[] // Ahora es un array de bases de las que depende
  blockedBy?: number[] // Bases que bloquean el avance
}

export function AdvanceRunners() {
  const { bases, outs, handleAdvanceRunners } = useGameStore()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [currentOuts, setCurrentOuts] = useState<number>(outs)
  const [runnerAdvances, setRunnerAdvances] = useState<RunnerAdvance[]>([])
  const [step, setStep] = useState<"select-runners" | "resolve-advances">("select-runners")

  useEffect(() => {
    setCurrentOuts(outs)
  }, [outs]);

  const baseNames = ["1st", "2nd", "3rd", "Home"]

  // Efecto para manejar cancelaciones en cadena
  useEffect(() => {
    const handleDependentCancellations = () => {
      const updatedAdvances = runnerAdvances.filter((advance) => {
        // Incluir avances que no dependen de otros
        if (!advance.dependsOn?.length) return true;
      
        // Verificar si alguna dependencia está ausente o cancelada
        const hasCancelledDependency = advance.dependsOn.some((depBase) => {
          const depAdvance = runnerAdvances.find((a) => a.fromBase === depBase);
          return !depAdvance || depAdvance.toBase === null;
        });
      
        // Incluir solo si no hay dependencias canceladas O el avance ya estaba cancelado
        return !hasCancelledDependency;
      });

      if (JSON.stringify(updatedAdvances) !== JSON.stringify(runnerAdvances)) {
        setRunnerAdvances(updatedAdvances)
      }
    }

    handleDependentCancellations()
  }, [runnerAdvances])

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      resetState()
    }
  }

  const resetState = () => {
    setStep("select-runners")
    setRunnerAdvances([])
    setCurrentOuts(outs)
  }

  const getOccupiedBases = () => {
    return bases
      .map((base, index) => ({ base: index, isOccupied: base.isOccupied }))
      .filter((base) => base.isOccupied)
      .sort((a, b) => b.base - a.base) // Ordenar de 3ra a 1ra
  }

  // Función para verificar si un corredor puede avanzar basado en sus dependencias
  const canAdvanceBasedOnDependencies = (fromBase: number): boolean => {
    const advance = runnerAdvances.find((adv) => adv.fromBase === fromBase)
    if (!advance) return true

    // Obtener dependencias actualizadas
    const currentDependencies = getAllDependencies(fromBase)
    // Verificar cada dependencia
    return currentDependencies.every((depBase) => {
      const depAdvance = runnerAdvances.find((adv) => adv.fromBase === depBase)

      // La dependencia debe existir y tener un destino válido
      if (!depAdvance || depAdvance.toBase === null) return false

      // Verificar que el destino de la dependencia no interfiera
      // con las posibles rutas de este corredor
      const possibleBases = getAvailableBasesWithoutDeps(fromBase)
      return !possibleBases.includes(depAdvance.toBase)
    })
  }

  // Función auxiliar para obtener bases disponibles sin considerar dependencias
  const getAvailableBasesWithoutDeps = (fromBase: number): number[] => {
    const availableBases: number[] = []
    for (let i = fromBase + 1; i < 4; i++) {
      if (isLegalAdvance(fromBase, i)) {
        availableBases.push(i)
      }
    }

    return availableBases
  }

  // Función principal para obtener las bases disponibles para un corredor
  const getAvailableBases = (fromBase: number): number[] => {
    // Si el corredor no puede avanzar por dependencias, retornar vacío
    if (!canAdvanceBasedOnDependencies(fromBase)) {
      return []
    }

    const availableBases: number[] = []
    const dependencies = getAllDependencies(fromBase)

    // Obtener todas las bases posibles sin considerar dependencias
    const possibleBases = getAvailableBasesWithoutDeps(fromBase)

    // Filtrar bases basadas en las dependencias
    for (const base of possibleBases) {
      let isValid = true

      // Verificar que no haya conflictos con las dependencias
      for (const depBase of dependencies) {
        const depAdvance = runnerAdvances.find((adv) => adv.fromBase === depBase)
        if (depAdvance) {
          // Si la dependencia va a la misma base o una anterior, no es válido
          if (depAdvance.toBase !== null && depAdvance.toBase <= base) {
            isValid = false
            break
          }
        }
      }

      if (isValid) {
        availableBases.push(base)
      }
    }

    return availableBases
  }

  // Función para obtener todas las dependencias de un corredor
  const getAllDependencies = (fromBase: number): number[] => {
    const dependencies = new Set<number>()
    const visited = new Set<number>()

    const findDependencies = (base: number) => {
      if (visited.has(base)) return
      visited.add(base)

      // Verificar la siguiente base
      const nextBase = base + 1
      if (nextBase < 3 && bases[nextBase].isOccupied) {
        dependencies.add(nextBase)

        // Buscar dependencias del corredor en la siguiente base
        const nextAdvance = runnerAdvances.find((adv) => adv.fromBase === nextBase)
        if (nextAdvance?.toBase !== null) {
          // Si el corredor de adelante va a avanzar, necesitamos verificar su destino
          findDependencies(nextBase)
        }
      }
    }

    findDependencies(fromBase)
    return Array.from(dependencies)
  }

  // Función para verificar si un avance es legal considerando interferencias
  const isLegalAdvance = (fromBase: number, toBase: number): boolean => {
    // No se puede avanzar hacia atrás
    if (toBase <= fromBase) return false

    // Verificar cada base intermedia
    for (let i = fromBase + 1; i < toBase; i++) {
      // Si hay un corredor en esta base
      if (bases[i].isOccupied) {
        const intermediateAdvance = runnerAdvances.find((adv) => adv.fromBase === i)

        // Si el corredor intermedio no está avanzando, bloquea el paso
        if (!intermediateAdvance) return false

        // Si el corredor intermedio está avanzando, debe ir más allá de la base objetivo
        if (intermediateAdvance.toBase === null || intermediateAdvance.toBase <= toBase) {
          return false
        }
      }
    }

    // Verificar si la base destino está libre o será liberada
    const isBaseTargeted = runnerAdvances.some((advance) => advance.toBase === toBase && advance.fromBase !== fromBase)
    if (bases[toBase]?.isOccupied && !isBaseTargeted) {
        const intermediateAdvance = runnerAdvances.find((adv) => adv.fromBase === toBase)

        // Si el corredor intermedio no está avanzando, bloquea el paso
        if (!intermediateAdvance) return false

        // Si el corredor intermedio está avanzando, debe ir más allá de la base objetivo
        if (intermediateAdvance.toBase === null || intermediateAdvance.toBase <= toBase) {
          return false
        }
    }

    return true
  }

  const handleSelectRunner = (fromBase: number) => {
    if (runnerAdvances.some((advance) => advance.fromBase === fromBase)) {
      return // Evitar selección duplicada
    }

    const dependencies = getAllDependencies(fromBase)
    const blockedBy = dependencies.filter((dep) => {
      const depAdvance = runnerAdvances.find((adv) => adv.fromBase === dep)
      return !depAdvance || depAdvance.toBase === null
    })

    const newAdvance: RunnerAdvance = {
      fromBase,
      toBase: null,
      dependsOn: dependencies,
      blockedBy,
    }

    setRunnerAdvances((prev) => [...prev, newAdvance])
  }

  const handleSelectBase = (runner: RunnerAdvance, toBase: number | null) => {
    setRunnerAdvances((prev) => {
      let newAdvances = [...prev]

      // Actualizar el avance del corredor actual
      newAdvances = newAdvances.map((advance) => {
        if (advance.fromBase === runner.fromBase) {
          return { ...advance, toBase }
        }
        return advance
      })

      // Si se está cancelando el avance
      if (toBase === null) {
        // Encontrar todos los corredores que dependen de este
        const dependentRunners = newAdvances.filter((advance) => advance.dependsOn?.includes(runner.fromBase))

        // Cancelar los avances dependientes
        dependentRunners.forEach((depRunner) => {
          newAdvances = newAdvances.map((advance) => {
            if (advance.fromBase === depRunner.fromBase) {
              return { ...advance, toBase: null }
            }
            return advance
          })
        })
      }

      return newAdvances
    })
  }

  const getDependencyChain = (fromBase: number): number[] => {
    const chain: number[] = []
    let currentBase = fromBase

    while (currentBase < 3) {
      const nextBase = currentBase + 1
      if (bases[nextBase].isOccupied) {
        chain.push(nextBase)
        currentBase = nextBase
      } else {
        break
      }
    }

    return chain
  }

  const getRunnerStatus = (base: number): string => {
    const availableBases = getAvailableBases(base)
    if (availableBases.length === 0) {
      const dependencies = getAllDependencies(base)
      if (dependencies.length > 0) {
        const blockingBases = dependencies.filter((dep) => {
          const depAdvance = runnerAdvances.find((adv) => adv.fromBase === dep)
          return !depAdvance || depAdvance.toBase === null
        })

        if (blockingBases.length > 0) {
          const basesNames = blockingBases.map((b) => baseNames[b]).join(" → ")
          return `Esperando avance de: ${basesNames}`
        }
      }
      return "No hay bases disponibles para avanzar"
    }
    return `Puede avanzar a: ${availableBases.map((b) => baseNames[b]).join(", ")}`
  }

  const renderRunnerCard = ({ base }: { base: number }) => {
    const advance = runnerAdvances.find((adv) => adv.fromBase === base)
    const availableBases = getAvailableBases(base)
    const dependencies = getAllDependencies(base)
    const isBlocked = !canAdvanceBasedOnDependencies(base)

    return (
      <div
        key={base}
        className={cn("rounded-lg p-4 transition-all duration-200", isBlocked ? "bg-gray-700/20" : "bg-gray-700/30")}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon iconNode={hatBaseball} className="w-5 h-5" />
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
                        className={cn(
                          "border-purple-500 text-purple-400 hover:bg-purple-500/20",
                          isBlocked && "opacity-50",
                        )}
                        onClick={() => handleSelectRunner(base)}
                        disabled={availableBases.length === 0}
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
                {availableBases.map((toBase) => (
                  <Button
                    key={toBase}
                    size="sm"
                    variant="outline"
                    className={cn(
                      "min-w-[60px]",
                      advance?.toBase === toBase
                        ? "bg-purple-500 text-white"
                        : "border-purple-500 text-purple-400 hover:bg-purple-500/20",
                    )}
                    onClick={() => handleSelectBase(advance!, toBase)}
                  >
                    {baseNames[toBase]}
                  </Button>
                ))}
                {advance?.toBase !== null && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-gray-300"
                    onClick={() => handleSelectBase(advance!, null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {dependencies.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <ArrowRightLeft className="w-4 h-4" />
              <span>Depende de: {dependencies.map((b) => baseNames[b]).join(" → ")}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleResolveAdvances = () => {
    if (runnerAdvances.some((advance) => advance.toBase === null)) {
      return
    }
    setStep("resolve-advances")
  }

  const handleRunnerResult = (fromBase: number, isOut: boolean) => {
    if (currentOuts >= 3) return

    // Verificar el orden de resolución
    const shouldResolveFirst = runnerAdvances
      .filter((advance) => advance.isOut === undefined)
      .some((advance) => advance.fromBase > fromBase)

    if (shouldResolveFirst) {
      return // No permitir resolver este corredor aún
    }

    setRunnerAdvances((prev) =>
      prev.map((advance) => (advance.fromBase === fromBase ? { ...advance, isOut } : advance)),
    )

    if (isOut) {
      setCurrentOuts((prev) => prev + 1)
    }

    const updatedAdvances = runnerAdvances.map((advance) =>
      advance.fromBase === fromBase ? { ...advance, isOut } : advance,
    )

    // Si todos los avances han sido resueltos o hay 3 outs
    if (updatedAdvances.every((advance) => advance.isOut !== undefined) || currentOuts + 1 >= 3) {
      handleAdvanceRunners(updatedAdvances)
      setIsModalOpen(false)
    }
  }

  const isRunnerSelected = (base: number) => {
    return runnerAdvances.some((advance) => advance.fromBase === base)
  }

  const canResolveRunner = (fromBase: number): boolean => {
    return !runnerAdvances
      .filter((advance) => advance.isOut === undefined)
      .some((advance) => advance.fromBase > fromBase)
  }

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
          {step === "select-runners" ? (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">Avanzar Corredores</DialogTitle>
                <DialogDescription className="text-gray-300">
                  <p>Selecciona los corredores que intentarán avanzar y a qué base.</p>
                  <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-medium mb-2 text-purple-300">Reglas de Avance:</h4>
                    <ul className="text-sm space-y-1 text-purple-200/70">
                      <li>• Los corredores solo pueden avanzar cuando el corredor de adelante avanza</li>
                      <li>• Si un corredor cancela su avance, los corredores que dependen de él también se cancelan</li>
                      <li>• Las bases deben resolverse en orden (3ra → 1ra)</li>
                    </ul>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">{getOccupiedBases().map(({ base }) => renderRunnerCard({ base }))}</div>

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
                  onClick={() => setStep("resolve-advances")}
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
                            "w-3 h-3 rounded-full transition-all duration-300",
                            i < currentOuts ? "bg-red-500 scale-110" : "bg-gray-600",
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
                    const canResolve = canResolveRunner(advance.fromBase)

                    return (
                      <div
                        key={advance.fromBase}
                        className={cn(
                          "relative rounded-lg p-4 transition-all duration-200",
                          advance.isOut !== undefined ? "opacity-50" : canResolve ? "bg-gray-700/30" : "bg-gray-700/10",
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
                                variant={advance.isOut === false ? "default" : "outline"}
                                size="sm"
                                disabled={advance.isOut !== undefined || currentOuts >= 3 || !canResolve}
                                className={cn(
                                  "transition-all duration-200",
                                  advance.isOut === false
                                    ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20"
                                    : "border-green-600 text-green-600 hover:bg-green-900/20",
                                )}
                                onClick={() => handleRunnerResult(advance.fromBase, false)}
                              >
                                <Check className="mr-1 h-4 w-4" />
                                Safe
                              </Button>
                              <Button
                                variant={advance.isOut === true ? "default" : "outline"}
                                size="sm"
                                disabled={advance.isOut !== undefined || currentOuts >= 3 || !canResolve}
                                className={cn(
                                  "transition-all duration-200",
                                  advance.isOut === true
                                    ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20"
                                    : "border-red-600 text-red-600 hover:bg-red-900/20",
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
                    )
                  })}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setStep("select-runners")}
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
  )
}

