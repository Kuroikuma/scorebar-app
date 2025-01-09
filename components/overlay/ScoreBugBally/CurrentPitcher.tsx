import { useGameStore } from '@/app/store/gameStore'

const CurrentPitcher = () => {
  const { getCurrentPitcher } = useGameStore()
  const currentPitcher = getCurrentPitcher()

  return (
    <div className="px-4 flex items-center min-w-[120px]">
      {currentPitcher && (
        <div className="text-sm">
          <span className="font-bold">
            P. {currentPitcher.name.split(' ').pop()?.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  )
}

export default CurrentPitcher
