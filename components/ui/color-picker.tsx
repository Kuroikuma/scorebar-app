"use client"

import * as React from "react"
import { Paintbrush } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/app/lib/utils"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
  presetColors?: string[]
  disabled?: boolean
}

export function ColorPicker({ color, onChange, className, presetColors, disabled = false }: ColorPickerProps) {
  const [value, setValue] = React.useState(color)

  // Default preset colors if none provided
  const defaultPresetColors = [
    "#000000",
    "#ffffff",
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
  ]

  const finalPresetColors = presetColors || defaultPresetColors

  // Update local state when color prop changes
  React.useEffect(() => {
    setValue(color)
  }, [color])

  // Handle color change and propagate to parent
  const handleColorChange = (newColor: string) => {
    setValue(newColor)
    onChange(newColor)
  }

  // Handle hex input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setValue(newColor)

    // Only propagate valid hex colors
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
      onChange(newColor)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-10 h-10 p-0 border-2", className)}
          style={{ backgroundColor: value }}
          disabled={disabled}
        >
          <Paintbrush className="h-4 w-4 text-white mix-blend-difference" />
          <span className="sr-only">Pick a color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <Tabs defaultValue="picker">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="picker" className="flex-1">
              Selector
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex-1">
              Presets
            </TabsTrigger>
          </TabsList>
          <TabsContent value="picker" className="space-y-4">
            <div>
              <div
                className="w-full h-32 rounded-md mb-3 relative overflow-hidden"
                style={{
                  background: `linear-gradient(to top, #000, transparent), 
                               linear-gradient(to right, #fff, transparent), 
                               ${value}`,
                }}
              >
                <Input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: value }} />
                <Input value={value} onChange={handleHexChange} className="flex-1" placeholder="#000000" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="presets">
            <div className="grid grid-cols-6 gap-2">
              {finalPresetColors.map((presetColor, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-8 h-8 rounded-md border border-slate-200 cursor-pointer",
                    value === presetColor && "ring-2 ring-slate-950 ring-offset-2",
                  )}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => handleColorChange(presetColor)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

