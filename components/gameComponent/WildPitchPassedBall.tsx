import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Wind, HandMetal } from 'lucide-react'

/**
 * Modal para seleccionar entre Wild Pitch y Passed Ball
 * cuando corredores avanzan por lanzamiento no atrapado.
 * 
 * Regla 9.13:
 * - WP: lanzamiento tan desviado que el catcher no puede detenerlo
 * - PB: lanzamiento catcheable que el catcher no retuvo
 * 
 * Uso:
 *   const [showWPPBModal, setShowWPPBModal] = useState(false)
 *   const [pendingAdvances, setPendingAdvances] = useState<RunnerAdvance[]>([])
 *   
 *   <WildPitchPassedBallModal
 *     open={showWPPBModal}
 *     onOpenChange={setShowWPPBModal}
 *     advances={pendingAdvances}
 *   />
 */

interface WildPitchPassedBallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  advances: Array<{
    fromBase: number
    toBase: number | null
    isOut?: boolean
    isForced?: boolean
    playerId?: string
  }>
}

export function WildPitchPassedBallModal({
  open,
  onOpenChange,
  advances,
}: WildPitchPassedBallModalProps) {
  const { handleWildPitch, handlePassedBall, isTopInning } = useGameStore()
  const { teams } = useTeamsStore()

  const defensiveTeamIndex = isTopInning ? 1 : 0
  const defensiveTeam = teams[defensiveTeamIndex]

  const pitcher = defensiveTeam.lineup.find((p) => p.position === 'P')
  const catcher = defensiveTeam.lineup.find((p) => p.position === 'C')

  const handleSelect = async (type: 'WP' | 'PB') => {
    if (type === 'WP') {
      await handleWildPitch(advances)
    } else {
      await handlePassedBall(advances)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800/95 backdrop-blur-sm text-white border-[#2d2b3b] rounded-xl shadow-2xl max-w-md">
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
            onClick={() => handleSelect('WP')}
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
            onClick={() => handleSelect('PB')}
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

        <div className="pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white border-0"
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
