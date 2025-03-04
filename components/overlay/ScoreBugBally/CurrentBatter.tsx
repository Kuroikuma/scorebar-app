import { useGameStore } from '@/app/store/gameStore'

const CurrentBatter = () => {
  const { getCurrentBatter } = useGameStore()
  const currentBatter = getCurrentBatter()

  return (
    <div className="px-4 flex items-center border-r border-white/20">
      {currentBatter ? (
        <div className="text-sm">
          <span className="font-bold mr-2 text-2xl truncate ...">
           {currentBatter.number}. {currentBatter.name.split(' ').pop()?.toUpperCase()}
          </span>
        </div>
      ) : (
        <div className="text-sm">
          <span className="font-bold mr-2 text-2xl truncate ...">
           Bateador
          </span>
        </div>
      )}
    </div>
  )
}

export default CurrentBatter
