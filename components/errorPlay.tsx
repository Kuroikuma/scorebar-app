import { useGameStore } from '@/app/store/gameStore'
import {
  TypeAbbreviatedBatting,
  TypeHitting,
  useTeamsStore,
} from '@/app/store/teamsStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'

export function ErrorPlay() {
  const { handleErrorPlay, isTopInning, bases } = useGameStore()
  const { teams } = useTeamsStore()
  const [showAdvanceDialog, setShowAdvanceDialog] = useState(false)
  const [selectedDefensiveOrder, setSelectedDefensiveOrder] = useState<number | null>(null)
  const [showDropdownMenu, setShowDropdownMenu] = useState(false)

  const teamIndex = isTopInning ? 1 : 0
  const defensiveLineupTeam = teams[teamIndex].lineup

  const hasRunnersOnBase = bases.some(base => base.isOccupied)

  // ✅ Calcular qué corredores son FORZADOS vs. NO forzados
  // Un corredor es forzado solo si la cadena desde 1ra está completa
  const first = bases[0]
  const second = bases[1]
  const third = bases[2]

  const forcedRunners: string[] = []
  const nonForcedRunners: string[] = []

  if (first.isOccupied) {
    forcedRunners.push('1ra base')
    if (second.isOccupied) {
      forcedRunners.push('2da base')
      if (third.isOccupied) {
        forcedRunners.push('3ra base (anota)')
      }
    }
  }

  if (second.isOccupied && !first.isOccupied) nonForcedRunners.push('2da base')
  if (third.isOccupied && !(first.isOccupied && second.isOccupied)) nonForcedRunners.push('3ra base')

  const handleErrorSelection = async (defensiveOrder: number) => {
    setShowDropdownMenu(false)
    
    if (hasRunnersOnBase) {
      setSelectedDefensiveOrder(defensiveOrder)
      setShowAdvanceDialog(true)
    } else {
      await handleErrorPlay(defensiveOrder)
    }
  }

  const handleConfirmError = async () => {
    if (selectedDefensiveOrder !== null) {
      await handleErrorPlay(selectedDefensiveOrder)
      setShowAdvanceDialog(false)
      setSelectedDefensiveOrder(null)
    }
  }

  return (
    <>
      <DropdownMenu open={showDropdownMenu} onOpenChange={setShowDropdownMenu}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-[#4c3f82] hover:bg-[#5a4b99]" onClick={() => setShowDropdownMenu(!showDropdownMenu)}>
            Error
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-gray-800 border-[#2d2b3b]">
          <DropdownMenuLabel className="text-white">Error de</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-600" />
          <DropdownMenuGroup className="text-white">
            {defensiveLineupTeam.map((player) => (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => handleErrorSelection(player.defensiveOrder)}
                key={player._id}
              >
                {player.name}
                <DropdownMenuShortcut>{player.position}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showAdvanceDialog} onOpenChange={setShowAdvanceDialog}>
        <DialogContent className="bg-gray-800/95 backdrop-blur-sm text-white border-[#2d2b3b] rounded-xl shadow-2xl max-w-md">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              Error Defensivo
            </DialogTitle>
            <DialogDescription className="text-gray-300 space-y-3">
              <p>
                El bateador avanzará a primera base por el error defensivo.
              </p>

              {/* ✅ NUEVO: Mostrar qué corredores son forzados y cuáles no */}
              {hasRunnersOnBase && (
                <div className="space-y-2">

                  {forcedRunners.length > 0 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-sm font-medium text-green-300 mb-1">
                        ✅ Avance forzado automático (Regla 5.06(b)(3)):
                      </p>
                      <ul className="text-sm text-green-200/80 space-y-0.5">
                        {forcedRunners.map(r => (
                          <li key={r}>• Corredor en {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {nonForcedRunners.length > 0 && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm font-medium text-yellow-300 mb-1">
                        ⚠️ No forzados — quedan en su base:
                      </p>
                      <ul className="text-sm text-yellow-200/80 space-y-0.5">
                        {nonForcedRunners.map(r => (
                          <li key={r}>• Corredor en {r}</li>
                        ))}
                      </ul>
                      <p className="text-xs text-yellow-200/60 mt-2">
                        Si avanzaron en la jugada, usa "Avanzar Corredores" después de confirmar.
                      </p>
                    </div>
                  )}

                </div>
              )}

              <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <h4 className="font-medium mb-2 text-purple-300">Reglas aplicadas:</h4>
                <ul className="text-sm space-y-1 text-purple-200/70">
                  <li>• El bateador llega a 1ra base</li>
                  <li>• NO se cuenta como hit (Regla 9.05)</li>
                  <li>• Se incrementa error del equipo defensivo (Regla 9.12)</li>
                  <li>• Solo se fuerzan corredores en cadena desde 1ra (Regla 5.06(b)(3))</li>
                  <li>• Corredores no forzados avanzan bajo su propio riesgo</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-between md:gap-0 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAdvanceDialog(false)
                setSelectedDefensiveOrder(null)
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white border-0"
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              onClick={handleConfirmError}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Confirmar Error
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}