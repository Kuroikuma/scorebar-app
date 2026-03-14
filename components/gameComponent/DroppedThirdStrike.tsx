import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Check, X, Wind, HandMetal } from 'lucide-react'

/**
 * Modal de Dropped Third Strike (K-WP / K-PB)
 *
 * Se monta una sola vez en el panel de control y observa el flag
 * `pendingDroppedThirdStrike` del gameStore. Cuando es true, se abre solo.
 *
 * Uso en control-panel.tsx:
 *   <DroppedThirdStrike />
 *
 * No requiere props — lee y escribe directamente en el store.
 */
export function DroppedThirdStrike() {
  const {
    pendingDroppedThirdStrike,
    setPendingDroppedThirdStrike,
    handleDroppedThirdStrike,
    bases,
    outs,
    isTopInning,
    getCurrentBatter,
  } = useGameStore()

  const { teams, recordDroppedThirdStrikeStats } = useTeamsStore()

  // ── Paso del modal ───────────────────────────────────────────────────────
  const [step, setStep] = useState<'type' | 'result'>('type')
  const [selectedType, setSelectedType] = useState<'WP' | 'PB' | null>(null)

  // ── Datos del juego en este momento ─────────────────────────────────────
  const firstBaseEmpty = !bases[0].isOccupied
  const twoOuts = outs === 2
  const batterCanRun = firstBaseEmpty || twoOuts

  const defensiveTeamIndex = isTopInning ? 1 : 0
  const defensiveTeam = teams[defensiveTeamIndex]

  const pitcher = defensiveTeam.lineup.find((p) => p.position === 'P')
  const catcher = defensiveTeam.lineup.find((p) => p.position === 'C')
  const currentBatter = getCurrentBatter()

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSelectType = (type: 'WP' | 'PB') => {
    setSelectedType(type)

    if (!batterCanRun) {
      // 1ra ocupada con <2 outs → bateador siempre es out, no hay paso 2
      confirmAndClose(type, false)
      return
    }

    // El bateador puede intentar correr → ir al paso 2
    setStep('result')
  }

  const confirmAndClose = async (type: 'WP' | 'PB', batterSafe: boolean) => {
    // Usar la nueva función del teamsStore para registrar estadísticas
    await recordDroppedThirdStrikeStats(type, batterSafe)
    
    // Luego manejar el estado del juego (bases, outs, etc.)
    await handleDroppedThirdStrike(type, batterSafe)
    
    resetModal()
  }

  const resetModal = () => {
    setStep('type')
    setSelectedType(null)
    setPendingDroppedThirdStrike(false)
  }

  const handleCancel = () => {
    // El operador canceló — necesitamos cerrar sin dejar el estado colgado.
    // Procesamos como out normal sin estadística de WP/PB.
    // Esto evita que el juego quede bloqueado.
    handleDroppedThirdStrike('WP', false)
    resetModal()
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={pendingDroppedThirdStrike}
      onOpenChange={(open) => { if (!open) handleCancel() }}
    >
      <DialogContent className="bg-gray-800/95 backdrop-blur-sm text-white border-[#2d2b3b] rounded-xl shadow-2xl max-w-md">

        {/* ── PASO 1: WP o PB ────────────────────────────────────────────── */}
        {step === 'type' && (
          <>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="text-2xl">K</span>
                Strike 3 — Catcher no atrapó
              </DialogTitle>
              <DialogDescription asChild>
                <div className="text-gray-300 space-y-3">
                  {/* Bateador actual */}
                  <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-sm">
                      Bateador:{' '}
                      <span className="font-medium text-white">
                        {currentBatter?.name ?? '—'}
                      </span>
                    </p>
                    {!batterCanRun && (
                      <p className="text-xs text-yellow-400 mt-1">
                        1ra base ocupada con {outs} out(s) — el bateador es out
                        de todas formas, pero se registra la estadística.
                        <span className="text-gray-500 ml-1">(Regla 5.05(a)(2))</span>
                      </p>
                    )}
                    {batterCanRun && (
                      <p className="text-xs text-green-400 mt-1">
                        {firstBaseEmpty
                          ? '1ra base vacía — el bateador puede intentar llegar.'
                          : '2 outs — el bateador puede intentar llegar.'}
                        <span className="text-gray-500 ml-1">(Regla 5.05(a)(2))</span>
                      </p>
                    )}
                  </div>

                  {/* Explicación WP vs PB */}
                  <p className="text-xs text-gray-400">
                    ¿De quién fue la responsabilidad del lanzamiento no atrapado?
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-3">

              {/* Botón WP */}
              <button
                onClick={() => handleSelectType('WP')}
                className="w-full group text-left px-4 py-4 rounded-lg transition-all duration-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-700/20"
              >
                <div className="flex items-start gap-3">
                  <Wind className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Lanzamiento Salvaje</span>
                      <span className="text-xs font-mono text-blue-400 bg-blue-900/30 px-1.5 py-0.5 rounded">WP</span>
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
                onClick={() => handleSelectType('PB')}
                className="w-full group text-left px-4 py-4 rounded-lg transition-all duration-200 hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-700/20"
              >
                <div className="flex items-start gap-3">
                  <HandMetal className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Passed Ball</span>
                      <span className="text-xs font-mono text-orange-400 bg-orange-900/30 px-1.5 py-0.5 rounded">PB</span>
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
                onClick={handleCancel}
                className="bg-gray-700 hover:bg-gray-600 text-white border-0"
              >
                Cancelar (registrar out normal)
              </Button>
            </DialogFooter>
          </>
        )}

        {/* ── PASO 2: ¿El bateador llegó safe? ────────────────────────────── */}
        {step === 'result' && selectedType && (
          <>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <span className="text-2xl">K-{selectedType}</span>
                ¿El bateador llegó a 1ra?
              </DialogTitle>
              <DialogDescription asChild>
                <div className="text-gray-300 space-y-2">
                  <p className="text-sm">
                    El catcher no atrapó el strike 3 ({selectedType === 'WP' ? 'Lanzamiento Salvaje' : 'Passed Ball'}).
                    El bateador intentó llegar a primera base.
                  </p>
                  <p className="text-sm">
                    Bateador:{' '}
                    <span className="font-medium text-white">
                      {currentBatter?.name ?? '—'}
                    </span>
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="py-6 flex gap-3 justify-center">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20 px-8"
                onClick={() => confirmAndClose(selectedType, true)}
              >
                <Check className="mr-2 h-5 w-5" />
                Safe — llegó a 1ra
              </Button>
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 px-8"
                onClick={() => confirmAndClose(selectedType, false)}
              >
                <X className="mr-2 h-5 w-5" />
                Out en 1ra
              </Button>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep('type')}
                className="bg-gray-700 hover:bg-gray-600 text-white border-0"
              >
                Volver
              </Button>
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
  )
}