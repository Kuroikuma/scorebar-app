import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { BeerIcon as Baseball, Check, ChevronRight, X } from "lucide-react"
import { useGameStore } from "@/app/store/gameStore"
import { TypeAbbreviatedBatting, TypeHitting } from "@/app/store/teamsStore"
import { cn } from "@/app/lib/utils"

export function HitPlay() {
  const { handleSingle, handleDouble, handleTriple, handleHomeRun, handleHitByPitch, bases, outs } = useGameStore()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [hitType, setHitType] = useState<TypeHitting | null>(null)
  const [baseRunners, setBaseRunners] = useState<{ base: number; isOccupied: boolean }[]>([])
  const [pendingRuns, setPendingRuns] = useState<number>(0)
  const [runnerResults, setRunnerResults] = useState<{ base: number; isOut: boolean }[]>([])
  const [currentOuts, setCurrentOuts] = useState<number>(outs)
  const [step, setStep] = useState<"select-hit" | "runner-results">("select-hit")

  const returnNameBase = (index: number) => {
    return index === 0 ? "1st" : index === 1 ? "2nd" : index === 2 ? "3rd" : "Home"
  }

  const handleHitAction = async (hitType: TypeHitting) => {
    setHitType(hitType)
    setCurrentOuts(outs)

    const occupiedBases = bases
      .map((base, index) => ({ base: index, isOccupied: base.isOccupied }))
      .filter((base) => base.isOccupied)

    if (occupiedBases.length === 0 && hitType !== TypeHitting.HomeRun) {
      await executeHit(hitType, 0)
      setIsModalOpen(false)
      return
    }

    if (hitType === TypeHitting.HomeRun) {
      await executeHit(hitType, occupiedBases.length + 1)
      setIsModalOpen(false)
      return
    }

    if (hitType === TypeHitting.HitByPitch) {
      handleHitByPitch()
      setIsModalOpen(false)
      return
    }

    let potentialRuns = 0
    const runnersToCheck: { base: number; isOccupied: boolean }[] = []

    if (hitType === TypeHitting.Single) {
      if (bases[2].isOccupied) {
        potentialRuns = 1
        runnersToCheck.push({ base: 2, isOccupied: true })
      }
    } else if (hitType === TypeHitting.Double) {
      if (bases[2].isOccupied) {
        potentialRuns++
        runnersToCheck.push({ base: 2, isOccupied: true })
      }
      if (bases[1].isOccupied) {
        potentialRuns++
        runnersToCheck.push({ base: 1, isOccupied: true })
      }
    } else if (hitType === TypeHitting.Triple) {
      for (let i = 0; i < 3; i++) {
        if (bases[i].isOccupied) {
          potentialRuns++
          runnersToCheck.push({ base: i, isOccupied: true })
        }
      }
    }

    runnersToCheck.sort((a, b) => b.base - a.base)

    if (potentialRuns > 0) {
      setBaseRunners(runnersToCheck)
      setPendingRuns(potentialRuns)
      setRunnerResults([])
      setStep("runner-results")
    } else {
      await executeHit(hitType, 0)
      setIsModalOpen(false)
    }
  }

  const executeHit = async (hitType: TypeHitting, runsScored: number) => {
    switch (hitType) {
      case TypeHitting.Single:
        await handleSingle(runsScored)
        break
      case TypeHitting.Double:
        await handleDouble(runsScored)
        break
      case TypeHitting.Triple:
        await handleTriple(runsScored)
        break
      case TypeHitting.HomeRun:
        await handleHomeRun()
        break
      default:
        break
    }
  }

  const handleRunnerResult = async (base: number, isOut: boolean) => {
    const canInteract = canInteractWithBase(base)
    if (!canInteract) return

    if (currentOuts >= 3) return

    const updatedResults = [...runnerResults]
    const existingIndex = updatedResults.findIndex((r) => r.base === base)

    if (existingIndex >= 0) {
      if (!updatedResults[existingIndex].isOut && isOut) {
        setCurrentOuts((prev) => prev + 1)
      } else if (updatedResults[existingIndex].isOut && !isOut) {
        setCurrentOuts((prev) => prev - 1)
      }
      updatedResults[existingIndex] = { base, isOut }
    } else {
      if (isOut) {
        setCurrentOuts((prev) => prev + 1)
      }
      updatedResults.push({ base, isOut })
    }

    setRunnerResults(updatedResults)

    let sumOuts = isOut ? currentOuts + 1 : currentOuts

    if (updatedResults.length === baseRunners.length || sumOuts >= 3) {
      const actualRuns = updatedResults.filter((r) => !r.isOut).length
      setIsModalOpen(false)
      await executeHit(hitType as TypeHitting, actualRuns)
      await useGameStore.getState().handleOutsChange(sumOuts)
      setStep("select-hit")
    }
  }

  const canInteractWithBase = (base: number): boolean => {
    const previousBases = baseRunners.filter((runner) => runner.base > base).map((runner) => runner.base)

    const allPreviousBasesDecided = previousBases.every((prevBase) =>
      runnerResults.some((result) => result.base === prevBase),
    )

    return allPreviousBasesDecided
  }

  const isBaseDisabled = (base: number): boolean => {
    return !canInteractWithBase(base) || currentOuts >= 3
  }

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      // Reset state when closing
      setStep("select-hit")
      setHitType(null)
      setBaseRunners([])
      setRunnerResults([])
    }
  }

  const hitTypes = [
    {
      type: TypeHitting.Single,
      abbr: TypeAbbreviatedBatting.Single,
      description: "El bateador alcanza la primera base",
    },
    {
      type: TypeHitting.Double,
      abbr: TypeAbbreviatedBatting.Double,
      description: "El bateador alcanza la segunda base",
    },
    {
      type: TypeHitting.Triple,
      abbr: TypeAbbreviatedBatting.Triple,
      description: "El bateador alcanza la tercera base",
    },
    {
      type: TypeHitting.HomeRun,
      abbr: TypeAbbreviatedBatting.HomeRun,
      description: "¡Home run! Todos los corredores anotan",
    },
    {
      type: TypeHitting.HitByPitch,
      abbr: TypeAbbreviatedBatting.HitByPitch,
      description: "El bateador es golpeado por el lanzamiento",
    },
  ]

  return (
    <>
      <Button
        variant="outline"
        className="bg-[#4c3f82] hover:bg-[#5a4b99] text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 active:scale-95"
        onClick={() => setIsModalOpen(true)}
      >
        Hit
      </Button>

      <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-gray-800/95 backdrop-blur-sm text-white border-[#2d2b3b] rounded-xl shadow-2xl max-w-md w-full mx-auto">
          {step === "select-hit" ? (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">Seleccionar Tipo de Hit</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Elige el tipo de hit realizado por el bateador.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-2">
                {hitTypes.map((hit) => (
                  <button
                    key={hit.type}
                    onClick={() => handleHitAction(hit.type)}
                    className="w-full group text-left px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{hit.type}</span>
                          <span className="text-xs text-gray-400 font-mono">{hit.abbr}</span>
                        </div>
                        <p className="text-sm text-gray-400">{hit.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                    </div>
                  </button>
                ))}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold">Resultado de la Jugada ({hitType})</DialogTitle>
                <DialogDescription className="text-gray-300 space-y-4">
                  <p className="text-sm">
                    Selecciona si el corredor anotó (safe) o fue eliminado (out) al llegar a home, comenzando desde tercera base.
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
                {baseRunners.map((runner, index) => {
                  const result = runnerResults.find((r) => r.base === runner.base)
                  const isDisabled = isBaseDisabled(runner.base)
                  const canInteract = canInteractWithBase(runner.base)

                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative rounded-lg p-4 transition-all duration-200",
                        isDisabled ? "opacity-50" : "bg-gray-700/30",
                        !canInteract && !isDisabled && "animate-pulse",
                      )}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Corredor de {returnNameBase(runner.base)} a HP</span>
                          {!canInteract && !isDisabled && (
                            <span className="text-xs text-gray-400">Decide primero las bases anteriores</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={result?.isOut === false ? "default" : "outline"}
                            size="sm"
                            disabled={isDisabled}
                            className={cn(
                              "transition-all duration-200",
                              result?.isOut === false
                                ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20"
                                : "border-green-600 text-green-600 hover:bg-green-900/20",
                            )}
                            onClick={() => handleRunnerResult(runner.base, false)}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Safe
                          </Button>
                          <Button
                            variant={result?.isOut === true ? "default" : "outline"}
                            size="sm"
                            disabled={isDisabled}
                            className={cn(
                              "transition-all duration-200",
                              result?.isOut === true
                                ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20"
                                : "border-red-600 text-red-600 hover:bg-red-900/20",
                            )}
                            onClick={() => handleRunnerResult(runner.base, true)}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setStep("select-hit")}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
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

