import { useGameStore } from '@/app/store/gameStore'

const CurrentPitcher = () => {
  const { getCurrentPitcher } = useGameStore()
  const currentPitcher = getCurrentPitcher()

  return (
    <div className="px-4 flex items-center">
      {currentPitcher ? (
        <div className="text-sm">
          <span className="font-bold text-2xl truncate ...">
            P. {currentPitcher.name.split(' ').pop()?.toUpperCase()}
          </span>
        </div>
      ) : (
        <div className="text-sm">
          <span className="font-bold text-2xl truncate ...">
            Lanzador
          </span>
        </div>
      )}
    </div>
  )
}

export default CurrentPitcher
