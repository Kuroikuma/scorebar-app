import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'


const OutsCircle = () => {
  const { isTopInning, outs } = useGameStore()

  const { teams } = useTeamsStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color


  return (
    <div className="col-start-1 row-start-2 flex items-center translate-x-[-1%] translate-y-[-6%] rotate-45">
      <div className="flex gap-1">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            style={{
              backgroundColor: index < outs ? currentTeamColor : 'white',
            }}
            className={`w-4 h-4 rounded-full border border-white ${
              index < outs ? 'bg-transparent' : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default OutsCircle
