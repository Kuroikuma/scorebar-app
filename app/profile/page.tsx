'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import DynamicList from '@/components/DynamicList'
import AvatarCropper from './AvatarCropper'
import ImageUpload from './ImageUploap'
import { BreadcrumbProfile } from './Breadcrumb'
import { updateUser } from '../service/api'
import { User } from '../types/user'
import { IOrganization } from '../types/organization'

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false)

  const { user, loading, setUser } = useAuth()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser({ ...(user as User), [name]: value })
  }

  const handleSave = async () => {
    // Here you would typically send the updated user data to your backend
    console.log('Saving user data:', user)

    await updateUser((user as User)?._id, user as User)

    setIsEditing(false)
  }

  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <BreadcrumbProfile />
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>
            Manage your account information and advertisements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="mb-4 flex flex-col justify-center items-center gap-4">
                <Label htmlFor="avatar">Avatar</Label>
                <AvatarCropper
                  currentImage={(user as User).avatar}
                  onImageChange={(newImage) =>
                    setUser({ ...(user as User), avatar: newImage })
                  }
                  alt={(user as User).username}
                  isEditing={isEditing}
                  className="w-24 h-24"
                />
              </div>
              <div className="mb-4 flex flex-col justify-center items-center">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <ImageUpload
                  currentImage={((user as User).organizationId as IOrganization).logo}
                  onImageChange={(newImage) =>
                    setUser({ ...(user as User)})
                  }
                  alt={(user as User).username}
                  isEditing={isEditing}
                  className="w-24 h-24"
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col justify-center items-start gap-2">
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  name="username"
                  value={(user as User).username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col justify-center items-start gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={(user as User).email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
          <DynamicList
            onTextChange={(newText) =>
              setUser({ ...(user as User), advertisements: newText })
            }
            advertisements={(user as User).advertisements}
            isEditing={isEditing}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              <Button variant="outline">Change Password</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
