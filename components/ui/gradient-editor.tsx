"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ColorPicker } from "@/components/ui/color-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, RotateCcw } from "lucide-react"
import { GradientStop, GradientType } from "@/app/types/Banner"
import { cn } from "@/app/lib/utils"

interface GradientEditorProps {
  stops: GradientStop[]
  type: GradientType
  angle: number
  onChange: (updates: {
    stops?: GradientStop[]
    type?: GradientType
    angle?: number
  }) => void
  className?: string
}

export function GradientEditor({ stops, type, angle, onChange, className }: GradientEditorProps) {
  const [selectedStopIndex, setSelectedStopIndex] = React.useState<number | null>(stops.length > 0 ? 0 : null)

  // Generate the CSS gradient string for preview
  const gradientCSS = React.useMemo(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    const stopsString = sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")

    if (type === "linear") {
      return `linear-gradient(${angle}deg, ${stopsString})`
    } else if (type === "radial") {
      return `radial-gradient(circle, ${stopsString})`
    } else if (type === "conic") {
      return `conic-gradient(from ${angle}deg, ${stopsString})`
    }

    return ""
  }, [stops, type, angle])

  // Handle adding a new stop
  const handleAddStop = () => {
    if (stops.length >= 10) return // Limit to 10 stops

    // Find a position between existing stops or at the end
    let position = 50
    if (stops.length > 0) {
      if (stops.length === 1) {
        position = stops[0].position < 50 ? 100 : 0
      } else {
        // Find the largest gap between stops
        const sortedStops = [...stops].sort((a, b) => a.position - b.position)
        let maxGap = 0
        let gapPosition = 50

        for (let i = 0; i < sortedStops.length - 1; i++) {
          const gap = sortedStops[i + 1].position - sortedStops[i].position
          if (gap > maxGap) {
            maxGap = gap
            gapPosition = sortedStops[i].position + gap / 2
          }
        }

        position = Math.round(gapPosition)
      }
    }

    const newColor = stops.length > 0 ? stops[stops.length - 1].color : "#ffffff"
    const newStops = [...stops, { color: newColor, position }]
    onChange({ stops: newStops })
    setSelectedStopIndex(newStops.length - 1)
  }

  // Handle removing a stop
  const handleRemoveStop = (index: number) => {
    if (stops.length <= 2) return // Keep at least 2 stops

    const newStops = stops.filter((_, i) => i !== index)
    onChange({ stops: newStops })

    if (selectedStopIndex === index) {
      setSelectedStopIndex(index === 0 ? 0 : index - 1)
    } else if (selectedStopIndex !== null && selectedStopIndex > index) {
      setSelectedStopIndex(selectedStopIndex - 1)
    }
  }

  // Handle updating a stop's color
  const handleStopColorChange = (color: string) => {
    if (selectedStopIndex === null) return

    const newStops = [...stops]
    newStops[selectedStopIndex] = { ...newStops[selectedStopIndex], color }
    onChange({ stops: newStops })
  }

  // Handle updating a stop's position
  const handleStopPositionChange = (position: number) => {
    if (selectedStopIndex === null) return

    const newStops = [...stops]
    newStops[selectedStopIndex] = { ...newStops[selectedStopIndex], position }
    onChange({ stops: newStops })
  }

  // Handle gradient type change
  const handleTypeChange = (newType: GradientType) => {
    onChange({ type: newType })
  }

  // Handle angle change
  const handleAngleChange = (newAngle: number) => {
    onChange({ angle: newAngle })
  }

  // Handle blend mode change

  // Reset to default gradient
  const handleReset = () => {
    onChange({
      stops: [
        { color: "#3b82f6", position: 0 },
        { color: "#1e40af", position: 100 },
      ],
      type: GradientType.linear,
      angle: 135,
    })
    setSelectedStopIndex(0)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Gradient preview */}
      <div
        className="w-full h-16 rounded-lg shadow-inner relative"
        style={{ background: gradientCSS }}
      >
        {/* Stop markers */}
        <div className="absolute bottom-0 left-0 right-0 h-4">
          {stops.map((stop, index) => (
            <button
              key={index}
              className={cn(
                "absolute bottom-0 w-4 h-4 -ml-2 rounded-full border-2 border-white shadow-sm transform translate-y-1/2 cursor-pointer transition-all",
                selectedStopIndex === index && "ring-2 ring-blue-500 scale-125",
              )}
              style={{
                left: `${stop.position}%`,
                backgroundColor: stop.color,
              }}
              onClick={() => setSelectedStopIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo de gradiente</Label>
          <Select value={type} onValueChange={(value) => handleTypeChange(value as GradientType)}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Lineal</SelectItem>
              <SelectItem value="radial">Radial</SelectItem>
              <SelectItem value="conic">Cónico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Angle control (for linear and conic gradients) */}
      {(type === "linear" || type === "conic") && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Ángulo</Label>
            <span className="text-sm text-slate-500">{angle}°</span>
          </div>
          <div className="flex gap-2 items-center">
            <Slider value={[angle]} min={0} max={359} step={1} onValueChange={(value) => handleAngleChange(value[0])} />
            <Input
              type="number"
              value={angle}
              onChange={(e) => handleAngleChange(Number(e.target.value))}
              className="w-16"
              min={0}
              max={359}
            />
          </div>
        </div>
      )}

      {/* Selected stop controls */}
      {selectedStopIndex !== null && (
        <div className="p-3 border rounded-md space-y-3 bg-slate-50 dark:bg-slate-900">
          <div className="flex justify-between items-center">
            <Label>Punto de color {selectedStopIndex + 1}</Label>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveStop(selectedStopIndex)}
              disabled={stops.length <= 2}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-3 items-center">
            <ColorPicker color={stops[selectedStopIndex].color} onChange={handleStopColorChange} />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Label>Posición</Label>
                <span className="text-sm text-slate-500">{stops[selectedStopIndex].position}%</span>
              </div>
              <Slider
                value={[stops[selectedStopIndex].position]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => handleStopPositionChange(value[0])}
              />
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleAddStop} disabled={stops.length >= 10}>
          <Plus className="h-4 w-4 mr-1" /> Añadir punto
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-1" /> Restablecer
        </Button>
      </div>
    </div>
  )
}

