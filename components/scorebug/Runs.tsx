import { Team } from '@/app/store/teamsStore'
import AnimatePopLayout from '../ui/AnimatePopLayout'

interface RunsProps {
  team: Team
  classes?: string
}


const Runs = ({ team, classes = "" }: RunsProps) => {
  return (
    <AnimatePopLayout dataNumber={team.runs}>
      <span className={`text-3xl font-bold ${classes}`}>{team.runs}</span>
    </AnimatePopLayout>
  )
}

export default Runs
