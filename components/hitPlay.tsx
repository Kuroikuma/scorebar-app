import { useGameStore } from "@/app/store/gameStore"
import { TypeAbbreviatedBatting, TypeHitting } from "@/app/store/teamsStore"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function HitPlay() {

  const { handleSingle, handleDouble, handleTriple, handleHomeRun, handleHitByPitch } = useGameStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-[#4c3f82] hover:bg-[#5a4b99]">Hit</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-800 border-[#2d2b3b]">
        <DropdownMenuLabel className="text-white">Hits</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuGroup className="text-white">
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleSingle()}>
            {TypeHitting.Single}
            <DropdownMenuShortcut>{TypeAbbreviatedBatting.Single}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleDouble()}>
            {TypeHitting.Double}
            <DropdownMenuShortcut>{TypeAbbreviatedBatting.Double}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleTriple()}>
            {TypeHitting.Triple}
            <DropdownMenuShortcut>{TypeAbbreviatedBatting.Triple}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleHomeRun()}>
            {TypeHitting.HomeRun}
            <DropdownMenuShortcut>{TypeAbbreviatedBatting.HomeRun}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => handleHitByPitch()}>
            {TypeHitting.HitByPitch}
            <DropdownMenuShortcut>{TypeAbbreviatedBatting.HitByPitch}</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
