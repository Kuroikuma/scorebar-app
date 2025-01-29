import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { DoorClosed, User2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

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
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center justify-center w-10 h-10 text-white bg-white rounded-full cursor-pointer">
                  <span className="text-lg font-semibold text-black font-onest">
                    {user?.username &&
                      user.username
                        .split(' ')
                        .slice(0, 2)
                        .map((word) => word.charAt(0).toUpperCase())
                        .join('')}
                  </span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-22 flex flex-col items-center justify-center">
              <Button
                  variant="secondary"
                  className="font-onest"
                  onClick={handleProfileEdit}
                >
                  <User2 className="w-4 h-4" />
                  Perfil
                  </Button>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="font-onest"
                >
                  <DoorClosed className="w-4 h-4" />
                  Salir
                </Button>
                
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  )
}
