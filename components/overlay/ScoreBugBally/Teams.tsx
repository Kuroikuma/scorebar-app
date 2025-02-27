import { useGameStore } from '@/app/store/gameStore'
import { useTeamsStore } from '@/app/store/teamsStore'
import CurrentPlayer from './CurrentPlayer'
import { darkenColor } from '@/app/lib/utils'
import { ShortName } from '@/components/scoreboard/ShortName'
import Runs from '@/components/scorebug/Runs'

const Teams = () => {
  const { isTopInning } = useGameStore()
  const { teams } = useTeamsStore()
  const currentTeamColor = teams[isTopInning ? 0 : 1].color

  return (
    <div className="flex relative top-[-86%] h-[90px] gap-1">
      {teams.map((team, index) => (
        <div className="flex flex-col">
          <CurrentPlayer teamIndex={index} color={team.color} />
          <div className="flex h-[68px] border-y-4 border-white">
            <div
              key={team.name}
              className="flex items-stretch w-full h-[60px] gap-1 px-1 border-2 border-white"
            >
              {/* Team Info */}
              <div className={`flex flex-1 items-center justify-center`}>
                <ShortName team={team} classes='text-2xl' />
              </div>
              {/* Score */}
              <div  className="w-[40px] flex items-center justify-center text-2xl font-bold">
                <Runs team={team} classes='text-4xl' />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Teams
