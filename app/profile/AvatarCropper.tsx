import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import './App.css'
import getCroppedImg from '../utils/cropImage'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export interface ImageUploadProps {
  currentImage: string
  onImageChange: (newImage: string) => void
  alt: string
  className?: string
  isEditing: boolean
}

const AvatarCropper = ({
  currentImage,
  onImageChange,
  alt,
  className,
  isEditing,
}: ImageUploadProps) => {
  const [imageSrc, setImageSrc] = useState<string>(currentImage) // Imagen cargada
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [isCropping, setIsCropping] = useState(false)

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        setImageSrc(reader.result as string)
        setIsCropping(true)
      }
    }
  }

  const handleCancel = () => {
    setImageSrc(currentImage)
    setIsCropping(false)
  }

  const handleCrop = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc!, croppedAreaPixels!)
      onImageChange(croppedImage) // Este es el resultado final
      setImageSrc(croppedImage)
      setIsCropping(false)
    } catch (error) {
      console.error('Error al recortar la imagen: ', error)
      setIsCropping(false)
    }
  }, [croppedAreaPixels, imageSrc])

  return (
    <div className={`relative ${className}`}>
      {isCropping ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-[90vw] max-w-md">
            <div className="relative w-full h-64 mb-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="zoom"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zoom
              </label>
              <Slider
                id="zoom"
                min={1}
                max={3}
                step={0.1}
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleCrop}>Crop & Save</Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-24 h-24 flex items-center justify-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={imageSrc || '/placeholder.svg'} alt={alt} />
              <AvatarFallback>{alt.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

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
        </>
      )}
    </div>
  )
}

export default AvatarCropper
