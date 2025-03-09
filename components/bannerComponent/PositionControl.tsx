"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Maximize2 } from "lucide-react"
import { useBannerStore } from "@/app/store/useBannerStore"

export default function PositionControl() {
  const { updatePosition, bannerSelected,  } = useBannerStore()
  const { position } = bannerSelected

  const handleXChange = (value: number[]) => {
    updatePosition({ ...position, x: value[0] })
  }

  const handleYChange = (value: number[]) => {
    updatePosition({ ...position, y: value[0] })
  }

  const moveStep = (direction: "left" | "right" | "up" | "down", step = 5) => {
    const newPosition = { ...position }

    switch (direction) {
      case "left":
        newPosition.x = Math.max(0, position.x - step)
        break
      case "right":
        newPosition.x = Math.min(100, position.x + step)
        break
      case "up":
        newPosition.y = Math.max(0, position.y - step)
        break
      case "down":
        newPosition.y = Math.min(100, position.y + step)
        break
    }

    updatePosition(newPosition)
  }

  const resetPosition = () => {
    updatePosition({ x: 50, y: 50 })
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Posición del Banner</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" onClick={resetPosition} className="h-8 px-2" title="Centrar">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="position-x">Posición Horizontal</Label>
            <span className="text-sm text-slate-500">{Math.round(position.x)}%</span>
          </div>
          <Slider id="position-x" min={0} max={100} step={1} value={[position.x]} onValueChange={handleXChange} />
          <div className="flex justify-between gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => moveStep("left")} className="flex-1 h-8">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Izquierda
            </Button>
            <Button variant="outline" size="sm" onClick={() => moveStep("right")} className="flex-1 h-8">
              <ArrowRight className="h-4 w-4 mr-1" />
              Derecha
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="position-y">Posición Vertical</Label>
            <span className="text-sm text-slate-500">{Math.round(position.y)}%</span>
          </div>
          <Slider id="position-y" min={0} max={100} step={1} value={[position.y]} onValueChange={handleYChange} />
          <div className="flex justify-between gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => moveStep("up")} className="flex-1 h-8">
              <ArrowUp className="h-4 w-4 mr-1" />
              Arriba
            </Button>
            <Button variant="outline" size="sm" onClick={() => moveStep("down")} className="flex-1 h-8">
              <ArrowDown className="h-4 w-4 mr-1" />
              Abajo
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        También puedes arrastrar directamente el banner en la vista previa
      </div>
    </div>
  )
}

