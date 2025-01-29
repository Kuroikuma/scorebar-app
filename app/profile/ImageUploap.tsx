import React from 'react'
import { ImageUploadProps } from './AvatarCropper'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'

const ImageUpload = ({
  currentImage,
  onImageChange,
  alt,
  isEditing,
  className,
}: ImageUploadProps) => {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        onImageChange(reader.result as string)
      }
    }
  }

  return (
    <div className="relative w-52 h-52 flex items-center justify-center">
      <img
        src={currentImage || '/placeholder.svg'}
        alt="Company Logo"
        width={200}
        height={200}
        className="rounded-lg object-cover"
      />

      {isEditing && (
        <>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />

          <Upload className="absolute w-8 h-8 p-1.5 bg-white bg-opacity-70 rounded-full text-gray-600 hover:bg-opacity-100 transition-opacity" />
        </>
      )}
    </div>
  )
}

export default ImageUpload
