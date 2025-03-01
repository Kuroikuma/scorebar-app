import { Team } from '@/app/store/teamsStore'

interface ErrorsGameProps {
  team: Team
}

export function ErrorsGame({ team }: ErrorsGameProps) {

  return (
    <td className="px-3 py-2 text-center font-bold bg-[#4c3f82]">
      {team.errorsGame}
    </td>
  )
}
