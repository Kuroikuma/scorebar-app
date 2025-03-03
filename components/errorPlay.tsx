import { useGameStore } from '@/app/store/gameStore'
import {
  TypeAbbreviatedBatting,
  TypeHitting,
  useTeamsStore,
} from '@/app/store/teamsStore'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ErrorPlay() {
  const { handleErrorPlay, isTopInning } = useGameStore()
  const { teams } = useTeamsStore()

  const teamIndex = isTopInning ? 1 : 0
  const defensiveLineupTeam = teams[teamIndex].lineup

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-[#4c3f82] hover:bg-[#5a4b99]">
          Error
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-800 border-[#2d2b3b]">
        <DropdownMenuLabel className="text-white">Error de</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuGroup className="text-white">
          {defensiveLineupTeam.map((player) => (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleErrorPlay(player.defensiveOrder)}
              key={player._id}
            >
              {player.name}
              <DropdownMenuShortcut>{player.position}</DropdownMenuShortcut>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
