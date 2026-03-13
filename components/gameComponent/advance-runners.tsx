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
import { ArrowRight, Check, ChevronRight, MonitorIcon as Running, X, AlertCircle, ArrowRightLeft, Wind, HandMetal, Zap, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useGameStore } from "@/app/store/gameStore"
import { cn } from "@/app/lib/utils"
import { Icon } from 'lucide-react';
import { hatBaseball } from '@lucide/lab';
import { useTeamsStore } from "@/app/store/teamsStore"

interface RunnerAdvance {
  fromBase: number // -1 para bateador, 0-2 para bases
  toBase: number | null
  isOut?: boolean
  isForced?: boolean // Indica si el avance es forzado (necesario para Regla 5.08(a))
  dependsOn?: number[] // Ahora es un array de bases de las que depende
  blockedBy?: number[] // Bases que bloquean el avance
  playerId?: string
}

export function AdvanceRunners() {
  const { bases, outs, handleAdvanceRunners, isTopInning, handleWildPitch, handlePassedBall, handleStolenBase, handleBalk } = useGameStore()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [currentOuts, setCurrentOuts] = useState<number>(outs)
  const [runnerAdvances, setRunnerAdvances] = useState<RunnerAdvance[]>([])
  const [step, setStep] = useState<"select-mode" | "select-runners" | "resolve-advances" | "wp-pb-select" | "stolen-base" | "balk-confirm">("select-mode")
  const [advanceMode, setAdvanceMode] = useState<"normal" | "wp-pb" | "stolen-base" | "balk" | null>(null)
  const [wpPbType, setWpPbType] = useState<'WP' | 'PB' | null>(null)
  const { teams } = useTeamsStore();

  const teamIndex = isTopInning ? 0 : 1;
  const currentTeam = teams[teamIndex];
  const defensiveTeamIndex = isTopInning ? 1 : 0
  const defensiveTeam = teams[defensiveTeamIndex]
  const pitcher = defensiveTeam.lineup.find((p) => p.position === 'P')
  const catcher = defensiveTeam.lineup.find((p) => p.position === 'C')

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
    setStep("select-mode")
    setAdvanceMode(null)
    setRunnerAdvances([])
    setCurrentOuts(outs)
    setWpPbType(null)
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
    // Para bases robadas, lógica especial
    if (advanceMode === 'stolen-base') {
      const available: number[] = []
      
      // Puede robar la siguiente base o home
      for (let i = fromBase + 1; i <= 3; i++) {
        // Si es home (3) siempre está disponible
        if (i === 3) {
          available.push(i)
          break
        }
        // Si la base está vacía, está disponible
        if (!bases[i].isOccupied) {
          available.push(i)
        } else {
          // Si la base está ocupada, no puede robar más allá
          break
        }
      }
      
      return available
    }

    // Lógica normal para avances regulares
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
    // Para bases robadas, solo permitir un corredor
    if (advanceMode === 'stolen-base' && runnerAdvances.length > 0) {
      // Reemplazar el corredor seleccionado
      setRunnerAdvances([])
    }

    if (runnerAdvances.some((advance) => advance.fromBase === fromBase)) {
      return // Evitar selección duplicada
    }

    const dependencies = getAllDependencies(fromBase)
    const blockedBy = dependencies.filter((dep) => {
      const depAdvance = runnerAdvances.find((adv) => adv.fromBase === dep)
      return !depAdvance || depAdvance.toBase === null
    })

    // Determinar si el avance es forzado
    // Un corredor está forzado si hay un corredor detrás que debe avanzar
    const isForced = fromBase === 0 ? false : bases[fromBase - 1].isOccupied

    const newAdvance: RunnerAdvance = {
      fromBase,
      toBase: null,
      dependsOn: dependencies,
      blockedBy,
      isForced, // 🆕 Agregar información de forzado
      playerId: bases[fromBase].playerId || undefined
    }

    if (advanceMode === 'stolen-base') {
      // Para bases robadas, reemplazar cualquier selección anterior
      setRunnerAdvances([newAdvance])
    } else {
      setRunnerAdvances((prev) => [...prev, newAdvance])
    }
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
    const advance = runnerAdvances.find((adv) => adv.fromBase === base);
    const availableBases = getAvailableBases(base);
    const dependencies = getAllDependencies(base);
    const isBlocked = !canAdvanceBasedOnDependencies(base);
    const playerId = bases[base].playerId;
    const runnerBase = playerId ? currentTeam.lineup.find((player) => player._id === playerId)?.name : "Corredor" as string;
    const player = playerId ? currentTeam.lineup.find((player) => player._id === playerId) : null;

    return (
      <div
        key={base}
        className={cn("rounded-lg p-4 transition-all duration-200", isBlocked ? "bg-gray-700/20" : "bg-gray-700/30")}
      >
        <div className="flex flex-col gap-2">
          <div className={cn("flex items-center justify-between", isRunnerSelected(base) && "flex-col items-start gap-1")}>
            <div className="flex items-center gap-3">
              <Icon iconNode={hatBaseball} className="w-5 h-5" />
              <div>
                <span>{runnerBase} en {baseNames[base]}</span>
                {advanceMode === 'stolen-base' && player && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    SB: {player.stolenBases ?? 0}, CS: {player.caughtStealing ?? 0}
                  </div>
                )}
              </div>
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
                          advanceMode === 'stolen-base' 
                            ? "border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                            : "border-purple-500 text-purple-400 hover:bg-purple-500/20",
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
                        ? advanceMode === 'stolen-base'
                          ? "bg-yellow-500 text-white"
                          : "bg-purple-500 text-white"
                        : advanceMode === 'stolen-base'
                        ? "border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
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

          {dependencies.length > 0 && advanceMode !== 'stolen-base' && (
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
      // Procesar según el modo
      if (advanceMode === 'wp-pb') {
        // Ya tenemos el tipo WP/PB seleccionado, procesar directamente
        if (wpPbType === 'WP') {
          handleWildPitch(updatedAdvances)
        } else if (wpPbType === 'PB') {
          handlePassedBall(updatedAdvances)
        }
      } else {
        // Modo normal
        handleAdvanceRunners(updatedAdvances)
      }
      setIsModalOpen(false)
      resetState()
    }
  }

  const handleStolenBaseAttempt = async (wasSuccessful: boolean) => {

    if (runnerAdvances.length !== 1 || runnerAdvances[0].toBase === null) return

    const advance = runnerAdvances[0]
    const runnerId = bases[advance.fromBase].playerId

    if (!runnerId) return

    await handleStolenBase(runnerId, advance.fromBase, advance.toBase!, wasSuccessful)
    setIsModalOpen(false)
    resetState()
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
        className="bg-[#4c3f82] w-full hover:bg-[#5a4b99] text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95"
        onClick={() => setIsModalOpen(true)}
        disabled={!getOccupiedBases().length}
      >
        <Icon iconNode={hatBaseball} className="w-5 h-5 mr-2" />
        Avanzar Corredores
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-gray-800/95 backdrop-blur-sm text-white border-[#2d2b3b] rounded-xl shadow-2xl max-w-md w-full mx-auto">
          
          {/* ── PASO 0: Seleccionar modo de avance ────────────────────────── */}
          {step === "select-mode" && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">Tipo de Avance</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Selecciona el tipo de avance de corredores
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-3">
                {/* Avance Normal */}
                <button
                  onClick={() => {
                    setAdvanceMode("normal")
                    setStep("select-runners")
                  }}
                  className="w-full group text-left px-4 py-4 rounded-lg transition-all duration-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-700/20"
                >
                  <div className="flex items-start gap-3">
                    <Icon iconNode={hatBaseball} className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Avance Normal</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Por hit, error, jugada defensiva o situación general.
                        Permite resolver safe/out para cada corredor.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Wild Pitch / Passed Ball */}
                <button
                  onClick={() => {
                    setAdvanceMode("wp-pb")
                    setStep("wp-pb-select")
                  }}
                  className="w-full group text-left px-4 py-4 rounded-lg transition-all duration-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-gray-700/20"
                >
                  <div className="flex items-start gap-3">
                    <Wind className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Wild Pitch / Passed Ball</span>
                        <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded">WP/PB</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Lanzamiento no atrapado por el catcher. Registra estadística
                        del pitcher (WP) o catcher (PB).
                      </p>
                    </div>
                  </div>
                </button>

                {/* Base Robada */}
                <button
                  onClick={() => {
                    setAdvanceMode("stolen-base")
                    setStep("select-runners")
                  }}
                  className="w-full group text-left px-4 py-4 rounded-lg transition-all duration-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 bg-gray-700/20"
                >
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Base Robada</span>
                        <span className="text-xs font-mono text-yellow-400 bg-yellow-900/30 px-1.5 py-0.5 rounded">SB</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Corredor avanza por iniciativa propia sin ayuda de hit, error,
                        WP, PB o balk. Registra SB o CS.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Balk */}
                <button
                  onClick={() => {
                    setAdvanceMode("balk")
                    setStep("balk-confirm")
                  }}
                  className="w-full group text-left px-4 py-4 rounded-lg transition-all duration-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-gray-700/20"
                  disabled={!getOccupiedBases().length}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Balk</span>
                        <span className="text-xs font-mono text-red-400 bg-red-900/30 px-1.5 py-0.5 rounded">BALK</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        Movimiento ilegal del pitcher. Todos los corredores avanzan
                        una base automáticamente.
                      </p>
                      {!getOccupiedBases().length && (
                        <p className="text-xs text-gray-500 mt-1">
                          (No hay corredores en base)
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-0"
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </>
          )}

          {/* ── PASO WP/PB: Seleccionar tipo ───────────────────────────────── */}
          {step === "wp-pb-select" && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">
                  Lanzamiento no atrapado
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="text-gray-300 space-y-3">
                    <p className="text-sm">
                      Los corredores avanzaron porque el catcher no atrapó el lanzamiento.
                    </p>
                    <p className="text-xs text-gray-400">
                      ¿De quién fue la responsabilidad?
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-3">
                {/* Botón WP */}
                <button
                  onClick={() => {
                    setWpPbType('WP')
                    setStep('select-runners')
                  }}
                  className="w-full group text-left px-4 py-4 rounded-lg transition-all duration-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-700/20"
                >
                  <div className="flex items-start gap-3">
                    <Wind className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Lanzamiento Salvaje</span>
                        <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded">
                          WP
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        El lanzamiento fue tan alto, bajo o desviado que el catcher
                        no podía atraparlo con esfuerzo ordinario.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Se carga al pitcher:{' '}
                        <span className="text-white">{pitcher?.name ?? 'Pitcher'}</span>
                        {pitcher?.wildPitches !== undefined && (
                          <span className="text-gray-400 ml-1">
                            (WP actuales: {pitcher.wildPitches})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Botón PB */}
                <button
                  onClick={() => {
                    setWpPbType('PB')
                    setStep('select-runners')
                  }}
                  className="w-full group text-left px-4 py-4 rounded-lg transition-all duration-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-700/20"
                >
                  <div className="flex items-start gap-3">
                    <HandMetal className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Passed Ball</span>
                        <span className="text-xs font-mono text-orange-400 bg-orange-900/30 px-1.5 py-0.5 rounded">
                          PB
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        El lanzamiento era catcheable con esfuerzo ordinario,
                        pero el catcher no lo retuvo.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Se carga al catcher:{' '}
                        <span className="text-white">{catcher?.name ?? 'Catcher'}</span>
                        {catcher?.passedBalls !== undefined && (
                          <span className="text-gray-400 ml-1">
                            (PB actuales: {catcher.passedBalls})
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setStep("select-mode")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-0"
                >
                  Volver
                </Button>
              </DialogFooter>
            </>
          )}

          {/* ── PASO 1: Seleccionar corredores y bases ─────────────────────── */}
          {step === "select-runners" && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">
                  {advanceMode === 'stolen-base' ? 'Base Robada' : 
                   advanceMode === 'wp-pb' ? `${wpPbType === 'WP' ? 'Wild Pitch' : 'Passed Ball'}` : 
                   'Avanzar Corredores'}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  {advanceMode === 'stolen-base' ? (
                    <>
                      <p>Selecciona el corredor que intenta robar y la base destino.</p>
                      <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <h4 className="font-medium mb-2 text-yellow-300">Regla 9.07:</h4>
                        <p className="text-sm text-yellow-200/70">
                          Base robada es cuando el corredor avanza por iniciativa propia,
                          sin ayuda de hit, error, WP, PB o balk.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>Selecciona los corredores que intentarán avanzar y a qué base.</p>
                      <div className="mt-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                        <h4 className="font-medium mb-2 text-purple-300">Reglas de Avance:</h4>
                        <ul className="text-sm space-y-1 text-purple-200/70">
                          <li>• Los corredores solo pueden avanzar cuando el corredor de adelante avanza</li>
                          <li>• Si un corredor cancela su avance, los corredores que dependen de él también se cancelan</li>
                          <li>• Las bases deben resolverse en orden (3ra → 1ra)</li>
                        </ul>
                      </div>
                    </>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">{getOccupiedBases().map(({ base }) => renderRunnerCard({ base }))}</div>

              <DialogFooter className="flex justify-between md:gap-0 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(advanceMode === 'wp-pb' ? 'wp-pb-select' : 'select-mode')}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-0"
                >
                  Volver
                </Button>
                {advanceMode === 'stolen-base' ? (
                  <Button
                    variant="default"
                    onClick={() => setStep("stolen-base")}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    disabled={runnerAdvances.length !== 1 || runnerAdvances[0].toBase === null}
                  >
                    Resolver Robo
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => setStep("resolve-advances")}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!runnerAdvances.length || runnerAdvances.some((r) => r.toBase === null)}
                  >
                    Resolver Avances
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </DialogFooter>
            </>
          )}

          {/* ── PASO BALK: Confirmar balk ──────────────────────────────────── */}
          {step === "balk-confirm" && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  Balk del Pitcher
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="text-gray-300 space-y-3">
                    <p className="text-sm">
                      El pitcher realizó un movimiento ilegal. Todos los corredores
                      avanzan una base automáticamente.
                    </p>
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <h4 className="font-medium mb-2 text-red-300">Regla 6.02(a):</h4>
                      <p className="text-sm text-red-200/70">
                        Es un balk cuando el pitcher, mientras está tocando la goma,
                        hace cualquier movimiento naturalmente asociado con su
                        lanzamiento y no realiza tal lanzamiento.
                      </p>
                    </div>

                    {/* Mostrar corredores que avanzarán */}
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <h4 className="font-medium mb-2 text-gray-300">Corredores que avanzan:</h4>
                      <div className="space-y-2">
                        {getOccupiedBases().map(({ base }) => {
                          const playerId = bases[base].playerId
                          const runnerName = playerId 
                            ? currentTeam.lineup.find((player) => player._id === playerId)?.name 
                            : "Corredor"
                          const fromBaseName = baseNames[base]
                          const toBaseName = base === 2 ? "Home (anota)" : baseNames[base + 1]

                          return (
                            <div key={base} className="flex items-center gap-2 text-sm">
                              <Icon iconNode={hatBaseball} className="w-4 h-4 text-gray-400" />
                              <span>{runnerName}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-400">{fromBaseName} → {toBaseName}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {pitcher && (
                      <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-200">
                        Pitcher responsable: {pitcher.name}
                        {pitcher.balks !== undefined && (
                          <span className="ml-2">(Balks actuales: {pitcher.balks})</span>
                        )}
                      </div>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 flex justify-center">
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 px-8"
                  onClick={async () => {
                    await handleBalk()
                    setIsModalOpen(false)
                    resetState()
                  }}
                >
                  <Check className="mr-2 h-5 w-5" />
                  Confirmar Balk
                </Button>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setStep("select-mode")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-0"
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </>
          )}

          {/* ── PASO 2: Resolver base robada ───────────────────────────────── */}
          {step === "stolen-base" && runnerAdvances.length === 1 && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  Intento de Base Robada
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="text-gray-300 space-y-2">
                    <div className="p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium">
                          {currentTeam.lineup.find(p => p._id === bases[runnerAdvances[0].fromBase].playerId)?.name}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-yellow-400">
                          {baseNames[runnerAdvances[0].fromBase]} → {baseNames[runnerAdvances[0].toBase!]}
                        </span>
                      </div>
                    </div>
                    {catcher && (
                      <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-200">
                        Catcher defensivo: {catcher.name}
                        {catcher.caughtStealingBy !== undefined && (
                          <span className="ml-2">(CS atrapados: {catcher.caughtStealingBy})</span>
                        )}
                      </div>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="py-6 flex gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20 px-8"
                  onClick={() => handleStolenBaseAttempt(true)}
                >
                  <Check className="mr-2 h-5 w-5" />
                  Safe (SB)
                </Button>
                <Button
                  size="lg"
                  className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 px-8"
                  onClick={() => handleStolenBaseAttempt(false)}
                >
                  <X className="mr-2 h-5 w-5" />
                  Out (CS)
                </Button>
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

          {/* ── PASO 2: Resolver avances normales/WP/PB ────────────────────── */}
          {step === "resolve-advances" && (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">Resolver Avances</DialogTitle>
                <DialogDescription className="text-gray-300 space-y-4">
                  <p className="text-sm">
                    Indica si cada corredor fue safe o out en su intento de avance. Resuelve los avances en orden,
                    comenzando desde tercera base.
                  </p>
                  {advanceMode === 'wp-pb' && (
                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-200">
                      {wpPbType === 'WP' ? (
                        <>Wild Pitch - Se cargará al pitcher: {pitcher?.name}</>
                      ) : (
                        <>Passed Ball - Se cargará al catcher: {catcher?.name}</>
                      )}
                    </div>
                  )}
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