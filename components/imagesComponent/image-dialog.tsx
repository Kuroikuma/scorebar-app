import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Plus, Maximize2, Download, Trash2, Grid, LayoutList } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Añadir estilos globales para ocultar la barra de desplazamiento
// pero mantener la funcionalidad de desplazamiento
import "./scrollbar-hide.css"
import { cn } from "@/app/lib/utils"

interface ImageDialogProps {
  initialImages?: string[]
  title?: string
  onAddImages?: (files: FileList) => void
  onDownload?: (url: string) => void
  className?: string
}

export function ImageDialog({
  initialImages = [
    "/placeholder.svg?height=600&width=800&text=Image+1",
    "/placeholder.svg?height=600&width=800&text=Image+2",
    "/placeholder.svg?height=600&width=800&text=Image+3",
  ],
  title = "Image Gallery",
  onAddImages,
  onDownload,
  className,
}: ImageDialogProps) {
  const [images, setImages] = useState<string[]>(initialImages)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [open, setOpen] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"preview" | "grid">("preview")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, you would upload these files to a server
      // Here we're just creating object URLs for demonstration
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages([...images, ...newImages])

      if (onAddImages) {
        onAddImages(e.target.files)
      }
    }
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleDownload = () => {
    if (onDownload && images[selectedIndex]) {
      onDownload(images[selectedIndex])
    } else {
      // Basic download functionality
      const link = document.createElement("a")
      link.href = images[selectedIndex]
      link.download = `image-${selectedIndex}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const newImages = [...images]
      newImages.splice(deleteIndex, 1)
      setImages(newImages)

      // Adjust selected index if needed
      if (selectedIndex >= newImages.length) {
        setSelectedIndex(Math.max(0, newImages.length - 1))
      } else if (deleteIndex === selectedIndex && newImages.length > 0) {
        // Keep the same selected index unless we deleted the selected image
        setSelectedIndex(Math.min(selectedIndex, newImages.length - 1))
      }
    }

    // Close the delete dialog but keep the main dialog open
    setDeleteDialogOpen(false)
    setDeleteIndex(null)
  }

  const cancelDelete = () => {
    // Just close the delete dialog without affecting the main dialog
    setDeleteDialogOpen(false)
    setDeleteIndex(null)
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          // Only allow closing if the delete dialog is not open
          if (!deleteDialogOpen || !newOpen) {
            setOpen(newOpen)
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className={cn("gap-2", className)}>
            <Plus className="h-4 w-4" />
            Abrir galería
          </Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            "w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] p-0 gap-0 transition-all duration-300",
            fullscreen ? "w-screen h-screen max-h-screen max-w-screen rounded-none" : "max-h-[90vh]",
          )}
          // Prevent closing when clicking outside if delete dialog is open
          onPointerDownOutside={(e) => {
            if (deleteDialogOpen) {
              e.preventDefault()
            }
          }}
          // Prevent closing when pressing escape if delete dialog is open
          onEscapeKeyDown={(e) => {
            if (deleteDialogOpen) {
              e.preventDefault()
            }
          }}
        >
          <DialogHeader className="p-2 sm:p-4 flex flex-row items-center justify-between border-b">
            <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
            <div className="flex items-center gap-1 sm:gap-2">
              <Tabs
                defaultValue="preview"
                className="w-auto"
                onValueChange={(value) => setViewMode(value as "preview" | "grid")}
              >
                <TabsList className="grid w-auto grid-cols-2">
                  <TabsTrigger value="preview" className="px-2 sm:px-3">
                    <LayoutList className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Preview</span>
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="px-2 sm:px-3">
                    <Grid className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Grid</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-7 w-7 sm:h-8 sm:w-8">
                <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Toggle fullscreen</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-7 w-7 sm:h-8 sm:w-8">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-col h-full">
            {viewMode === "preview" ? (
              <>
                {/* Main image display */}
                <div className="relative flex-1 bg-black/5 flex items-center justify-center overflow-hidden">
                  {images.length > 0 ? (
                    <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                      <Image
                        src={images[selectedIndex] || "/placeholder.svg"}
                        alt={`Image ${selectedIndex + 1}`}
                        className="object-contain max-h-full w-auto"
                        style={{
                          maxHeight: fullscreen ? "calc(100vh - 180px)" : "min(calc(90vh - 180px), calc(100vw - 20px))",
                        }}
                        width={1200}
                        height={800}
                        priority
                      />

                      {/* Navigation buttons - adaptados para móvil */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 hover:bg-background/90 shadow-sm"
                        onClick={handlePrevious}
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
                        <span className="sr-only">Previous image</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-background/80 hover:bg-background/90 shadow-sm"
                        onClick={handleNext}
                      >
                        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                        <span className="sr-only">Next image</span>
                      </Button>

                      {/* Image counter - adaptado para móvil */}
                      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm shadow-sm">
                        {selectedIndex + 1} / {images.length}
                      </div>

                      {/* Delete button for current image */}
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                        onClick={() => handleDeleteClick(selectedIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete image</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center p-4 sm:p-8 text-muted-foreground">No images to display</div>
                  )}
                </div>

                {/* Thumbnails and actions */}
                <div className="border-t p-4 flex flex-col gap-4">
                  {/* Thumbnails with improved mobile handling */}
                  <div className="relative">
                    <div className="overflow-x-auto scrollbar-hide flex gap-2 pb-2 max-h-20 snap-x snap-mandatory scroll-px-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <button
                            onClick={() => setSelectedIndex(index)}
                            className={cn(
                              "relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all snap-start",
                              selectedIndex === index ? "border-primary" : "border-transparent hover:border-primary/50",
                            )}
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="object-cover"
                              fill
                            />
                          </button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteClick(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete image</span>
                          </Button>
                        </div>
                      ))}
                      <label className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex items-center justify-center cursor-pointer bg-muted/30 snap-start">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                        <input type="file" accept="image/*" multiple className="sr-only" onChange={handleFileChange} />
                      </label>
                    </div>

                    {/* Scroll indicators for mobile */}
                    {images.length > 4 && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                      </>
                    )}
                  </div>

                  {/* Actions row */}
                  <div className="flex gap-2 justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {images.length} {images.length === 1 ? "image" : "images"}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={handleDownload}
                      disabled={images.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // Grid View
              <div className="flex-1 overflow-y-auto p-4">
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative group aspect-square">
                        <div className="relative h-full w-full rounded-md overflow-hidden border border-muted">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Image ${index + 1}`}
                            className="object-cover"
                            fill
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-background/90"
                                onClick={() => {
                                  setSelectedIndex(index)
                                  setViewMode("preview")
                                }}
                              >
                                <Maximize2 className="h-4 w-4" />
                                <span className="sr-only">View image</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full bg-destructive/90"
                                onClick={() => handleDeleteClick(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete image</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-center text-muted-foreground truncate">Image {index + 1}</div>
                      </div>
                    ))}
                    <label className="relative aspect-square rounded-md overflow-hidden border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer bg-muted/30">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Add Images</span>
                      <input type="file" accept="image/*" multiple className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center p-8 text-muted-foreground">No images to display</div>
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium">Add Images</span>
                      <input type="file" accept="image/*" multiple className="sr-only" onChange={handleFileChange} />
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>
          {deleteDialogOpen && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-background border rounded-lg shadow-lg max-w-md w-full p-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Delete Image</h2>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this image? This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={cancelDelete}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDelete}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

