import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import { Button } from './ui/button'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Slider } from './ui/slider'
import { cn } from '@/app/lib/utils'

let timeoutId: NodeJS.Timeout | null = null

export const StatusGame = () => {
  const {
    getCurrentBatter,
    getCurrentPitcher,
    status,
    startGame,
    endGame,
    handleVisibleOverlay,
  } = useGameStore()
  const { teams } = useTeamsStore()

  const currentBatter = getCurrentBatter()
  const currentPitcher = getCurrentPitcher()
  const isLineupComplete = teams[0].lineupSubmitted && teams[1].lineupSubmitted
  const [segShow, setSegShow] = useState<number>(10)

  console.log(isLineupComplete);
  

  const showBattingOrder = () => {
    handleVisibleOverlay('playerStats', true)
    // Limpiar temporizador anterior si existe
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // Configurar un nuevo temporizador
    timeoutId = setTimeout(() => {
      handleVisibleOverlay('playerStats', false)
      timeoutId = null // Restablecer referencia después de ejecución
    }, segShow * 1000)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gray-800 p-4 rounded-md mb-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Game Status: {status}</h2>
          {status === 'upcoming' && isLineupComplete && (
            <Button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600"
            >
              Start Game
            </Button>
          )}
          {status === 'in_progress' && (
            <Button onClick={endGame} className="bg-red-500 hover:bg-red-600">
              End Game
            </Button>
          )}
        </div>
      </div>
      {!isLineupComplete && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lineup no completado</AlertTitle>
          <AlertDescription>
            Por favor, asegúrese de que ambos equipos tienen al menos 9
            jugadores en su alineación antes de comenzar el partido.
          </AlertDescription>
        </Alert>
      )}
      {status === 'in_progress' && (
        <>
        <div className="bg-gray-800 p-4 rounded-md mb-4 text-white">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">Current Batter</h3>
              <p>
                {currentBatter
                  ? `${currentBatter.name} (#${currentBatter.number})`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Current Pitcher</h3>
              <p>
                {currentPitcher
                  ? `${currentPitcher.name} (#${currentPitcher.number})`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center w-full gap-2 mb-4">
          <p className='text-white'>Tiempo de mostrar bateador al turno {segShow} seg.</p>
          <Slider
            defaultValue={[segShow]}
            max={100}
            step={1}
            className={cn("w-full")}
            onValueChange={(value) => setSegShow(value[0])}
          />
        </div>
        <Button
          onClick={showBattingOrder}
          className="bg-green-500 hover:bg-green-600"
        >
          Mostrar bateador al turno
        </Button>
        </>
      )}
    </div>
  )
}
