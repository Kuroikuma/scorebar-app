import { PlusCircleIcon, PlusSquareIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'

interface PopoverCreateGameProps {
  setOpenGame: Dispatch<SetStateAction<boolean>>
  setOpenMatch: Dispatch<SetStateAction<boolean>>
}

export const PopoverCreateGame = ({
  setOpenGame,
  setOpenMatch,
}: PopoverCreateGameProps) => {
  return (
    <>
      <div className="flex items-center justify-center gap-3 p-2">
        <div className="flex items-center justify-center gap-3 p-2">
          <div className="container-profile__actions">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#4c3f82] hover:bg-[#5a4b99] text-white"
                >
                  <PlusSquareIcon className="w-4 h-4" />
                  Create
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52 bg-gray-800 border-[#2d2b3b]">
                <DropdownMenuGroup className="text-white">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpenMatch(true)}
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                    Crear Partido De Fútbol
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpenGame(true)}
                  >
                    <PlusCircleIcon className="w-4 h-4" />
                    Crear Juego De Beisbol
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </>
  )
}
