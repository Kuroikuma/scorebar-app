import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { Check, X } from "lucide-react"
import { useGameStore } from "@/app/store/gameStore"
import { TypeAbbreviatedBatting, TypeHitting } from "@/app/store/teamsStore"

export function HitPlay() {
  const { handleSingle, handleDouble, handleTriple, handleHomeRun, handleHitByPitch, bases, outs } = useGameStore()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [hitType, setHitType] = useState<TypeHitting | null>(null)
  const [baseRunners, setBaseRunners] = useState<{ base: number; isOccupied: boolean }[]>([])
  const [pendingRuns, setPendingRuns] = useState<number>(0)
  const [runnerResults, setRunnerResults] = useState<{ base: number; isOut: boolean }[]>([])
  const [currentOuts, setCurrentOuts] = useState<number>(outs)

  const returnNameBase = (index: number) => {
    return index === 0 ? "1st" : index === 1 ? "2nd" : index === 2 ? "3rd" : "Home"
  }

  const handleHitAction = (hitType: TypeHitting) => {
    // Store the hit type and reset outs counter for this play
    setHitType(hitType)
    setCurrentOuts(outs)

    // Determine which bases are occupied
    const occupiedBases = bases
      .map((base, index) => ({ base: index, isOccupied: base.isOccupied }))
      .filter((base) => base.isOccupied)

    // If no bases are occupied and it's not a home run, just execute the hit
    if (occupiedBases.length === 0 && hitType !== TypeHitting.HomeRun) {
      executeHit(hitType, 0)
      return
    }

    // For home runs, we know all runners score
    if (hitType === TypeHitting.HomeRun) {
      executeHit(hitType, occupiedBases.length + 1) // +1 for the batter
      return
    }

    // For hit by pitch, just advance the runner
    if (hitType === TypeHitting.HitByPitch) {
      handleHitByPitch()
      return
    }

    // Calculate potential runs based on hit type and occupied bases
    let potentialRuns = 0
    const runnersToCheck: { base: number; isOccupied: boolean }[] = []

    if (hitType === TypeHitting.Single) {
      // On a single, only the runner on 3rd might score
      if (bases[2].isOccupied) {
        potentialRuns = 1
        runnersToCheck.push({ base: 2, isOccupied: true })
      }
    } else if (hitType === TypeHitting.Double) {
      // On a double, runners on 2nd and 3rd might score
      if (bases[2].isOccupied) {
        potentialRuns++
        runnersToCheck.push({ base: 2, isOccupied: true })
      }
      if (bases[1].isOccupied) {
        potentialRuns++
        runnersToCheck.push({ base: 1, isOccupied: true })
      }
    } else if (hitType === TypeHitting.Triple) {
      // On a triple, all runners might score
      for (let i = 0; i < 3; i++) {
        if (bases[i].isOccupied) {
          potentialRuns++
          runnersToCheck.push({ base: i, isOccupied: true })
        }
      }
    }

    // Sort runners from 3rd to 1st
    runnersToCheck.sort((a, b) => b.base - a.base)

    // If there are potential runs, open the modal
    if (potentialRuns > 0) {
      setBaseRunners(runnersToCheck)
      setPendingRuns(potentialRuns)
      setRunnerResults([])
      setIsModalOpen(true)
    } else {
      // Otherwise, just execute the hit
      executeHit(hitType, 0)
    }
  }

  const executeHit = (hitType: TypeHitting, runsScored: number) => {
    switch (hitType) {
      case TypeHitting.Single:
        handleSingle(runsScored)
        break
      case TypeHitting.Double:
        handleDouble(runsScored)
        break
      case TypeHitting.Triple:
        handleTriple(runsScored)
        break
      case TypeHitting.HomeRun:
        handleHomeRun()
        break
      default:
        break
    }
  }

  const handleRunnerResult = (base: number, isOut: boolean) => {
    // Check if we can interact with this base
    const canInteract = canInteractWithBase(base)
    if (!canInteract) return

    // Check if we've reached 3 outs
    if (currentOuts >= 3) return

    // Add or update the result for this runner
    const updatedResults = [...runnerResults]
    const existingIndex = updatedResults.findIndex((r) => r.base === base)

    if (existingIndex >= 0) {
      // If changing from safe to out, increment outs
      if (!updatedResults[existingIndex].isOut && isOut) {
        setCurrentOuts((prev) => prev + 1)
      }
      // If changing from out to safe, decrement outs
      else if (updatedResults[existingIndex].isOut && !isOut) {
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

    // If all runners have been decided or we've reached 3 outs, close the modal and execute the hit
    if (updatedResults.length === baseRunners.length || currentOuts >= 3) {
      const actualRuns = updatedResults.filter((r) => !r.isOut).length
      setIsModalOpen(false)
      executeHit(hitType as TypeHitting, actualRuns)
    }
  }

  const canInteractWithBase = (base: number): boolean => {
    // Get all bases that should be decided before this one
    const previousBases = baseRunners.filter((runner) => runner.base > base).map((runner) => runner.base)

    // Check if all previous bases have been decided
    const allPreviousBasesDecided = previousBases.every((prevBase) =>
      runnerResults.some((result) => result.base === prevBase),
    )

    return allPreviousBasesDecided
  }

  const isBaseDisabled = (base: number): boolean => {
    return !canInteractWithBase(base) || currentOuts >= 3
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-[#4c3f82] hover:bg-[#5a4b99]">
            Hit
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-800 border-[#2d2b3b]">
          <DropdownMenuLabel className="text-white">Hits</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-600" />
          <DropdownMenuGroup className="text-white">
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleHitAction(TypeHitting.Single)}>
              {TypeHitting.Single}
              <DropdownMenuShortcut>{TypeAbbreviatedBatting.Single}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleHitAction(TypeHitting.Double)}>
              {TypeHitting.Double}
              <DropdownMenuShortcut>{TypeAbbreviatedBatting.Double}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleHitAction(TypeHitting.Triple)}>
              {TypeHitting.Triple}
              <DropdownMenuShortcut>{TypeAbbreviatedBatting.Triple}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleHitAction(TypeHitting.HomeRun)}>
              {TypeHitting.HomeRun}
              <DropdownMenuShortcut>{TypeAbbreviatedBatting.HomeRun}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => handleHitByPitch()}>
              {TypeHitting.HitByPitch}
              <DropdownMenuShortcut>{TypeAbbreviatedBatting.HitByPitch}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal for runner outcomes */}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="bg-gray-800 text-white border-[#2d2b3b]">
          <AlertDialogHeader>
            <AlertDialogTitle>Resultado de los corredores</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Indica si los corredores anotaron o fueron eliminados en esta jugada.
              {currentOuts < 3 ? (
                <div className="mt-2">Outs en el inning: {currentOuts}</div>
              ) : (
                <div className="mt-2 text-red-500 font-semibold">¡3 Outs! Inning terminado</div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4 space-y-4">
            {baseRunners.map((runner, index) => {
              const result = runnerResults.find((r) => r.base === runner.base)
              const isDisabled = isBaseDisabled(runner.base)

              return (
                <div key={index} className={`flex items-center justify-between ${isDisabled ? "opacity-50" : ""}`}>
                  <span>Corredor de {returnNameBase(runner.base)} a Home:</span>
                  <div className="flex gap-2">
                    <Button
                      variant={result?.isOut === false ? "default" : "outline"}
                      size="sm"
                      disabled={isDisabled}
                      className={
                        result?.isOut === false
                          ? "bg-green-600 hover:bg-green-700"
                          : "border-green-600 text-green-600 hover:bg-green-900/20"
                      }
                      onClick={() => handleRunnerResult(runner.base, false)}
                    >
                      <Check className="mr-1 h-4 w-4" /> Safe
                    </Button>
                    <Button
                      variant={result?.isOut === true ? "default" : "outline"}
                      size="sm"
                      disabled={isDisabled}
                      className={
                        result?.isOut === true
                          ? "bg-red-600 hover:bg-red-700"
                          : "border-red-600 text-red-600 hover:bg-red-900/20"
                      }
                      onClick={() => handleRunnerResult(runner.base, true)}
                    >
                      <X className="mr-1 h-4 w-4" /> Out
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white">Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

