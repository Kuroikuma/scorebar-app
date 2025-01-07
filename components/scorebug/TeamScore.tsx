import { useTeamsStore } from '@/app/store/teamsStore'
import TeamLogo from './TeamLogo'
import TeamName from './TeamName'
import Runs from './Runs'

const TeamScore = () => {
  const { teams } = useTeamsStore()

  return (
    <div className="flex flex-col">
      {teams.map((team) => (
        <div
          key={team.name}
          style={{ backgroundColor: team.color, color: team.textColor }}
          className="flex  justify-between items-center gap-2"
        >
          <div className="flex items-center gap-2">
            <TeamLogo logo={team.logo} name={team.name} />
            <TeamName name={team.name} />
          </div>
          <Runs team={team} />
        </div>
      ))}
    </div>
  )
}

export default TeamScore
