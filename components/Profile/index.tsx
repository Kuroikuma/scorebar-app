import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { DoorClosed, User2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export const ProfileUser = () => {
  const { user, logout } = useAuth()

  const router = useRouter()
  const handleLogout = async () => {
    try {
      logout()
      router.push('/login')
    } catch (error) {
      console.error('Error trying to logout: ', error)
    }
  }

  const handleProfileEdit = async () => {
    router.push('/profile')
  }

  return (
    <>
      <div className="flex items-center justify-center gap-3 p-2">
        <div className="flex items-center justify-center gap-3 p-2">
          <div className="container-profile__actions">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src={user?.avatar} alt="@shadcn" />
                  <AvatarFallback>
                    {user?.username &&
                      user.username
                        .split(' ')
                        .slice(0, 2)
                        .map((word) => word.charAt(0).toUpperCase())
                        .join('')}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-24 bg-gray-800 border-[#2d2b3b]">
                <DropdownMenuGroup className="text-white">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleProfileEdit()}
                  >
                    <User2 className="w-4 h-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleLogout()}
                  >
                    <DoorClosed className="w-4 h-4" />
                    Salir
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
