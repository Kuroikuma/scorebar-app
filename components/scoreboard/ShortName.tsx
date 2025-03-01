import { Team } from '@/app/store/teamsStore'

interface ShortNameProps {
  team: Team
  classes?: string
}

export function ShortName({ team, classes = "" }: ShortNameProps) {
  return <div className={`font-bold ${classes}`}>{team.shortName}</div>
}
