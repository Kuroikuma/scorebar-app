import { Team } from "@/app/store/teamsStore"

interface NameProps {
  team: Team
}

export function Name({ team }: NameProps) {
  return (
    <div className="py-4 text-2xl font-bold text-center tracking-wide">
      {team.name}
    </div>
  )
}
