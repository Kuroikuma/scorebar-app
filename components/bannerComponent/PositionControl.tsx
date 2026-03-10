"use client"

import { useCallback, useMemo } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Maximize2, AlertCircle } from "lucide-react"
import { useBannerStore } from "@/app/store/useBannerStore"
import { Alert, AlertDescription } from "@/components/ui/alert"

const STEP_SIZE = 5;
const MIN_POSITION = 0;
const MAX_POSITION = 100;
const DEFAULT_POSITION = { x: 50, y: 50 };

export default function PositionControl() {
  const { updatePosition, bannerSelected } = useBannerStore()
  const { position } = bannerSelected

  // Validación de posición
  const safePosition = useMemo(() => {
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
      return DEFAULT_POSITION;
    }
    return {
      x: Math.max(MIN_POSITION, Math.min(MAX_POSITION, position.x)),
      y: Math.max(MIN_POSITION, Math.min(MAX_POSITION, position.y))
    };
  }, [position]);

  const handleXChange = useCallback((value: number[]) => {
    if (!bannerSelected._id) {
      console.error('No banner selected');
      return;
    }
    updatePosition({ ...safePosition, x: value[0] });
  }, [updatePosition, safePosition, bannerSelected._id]);

  const handleYChange = useCallback((value: number[]) => {
    if (!bannerSelected._id) {
      console.error('No banner selected');
      return;
    }
    updatePosition({ ...safePosition, y: value[0] });
  }, [updatePosition, safePosition, bannerSelected._id]);

  const moveStep = useCallback((direction: "left" | "right" | "up" | "down", step = STEP_SIZE) => {
    if (!bannerSelected._id) {
      console.error('No banner selected');
      return;
    }

    const newPosition = { ...safePosition };

    switch (direction) {
      case "left":
        newPosition.x = Math.max(MIN_POSITION, safePosition.x - step);
        break;
      case "right":
        newPosition.x = Math.min(MAX_POSITION, safePosition.x + step);
        break;
      case "up":
        newPosition.y = Math.max(MIN_POSITION, safePosition.y - step);
        break;
      case "down":
        newPosition.y = Math.min(MAX_POSITION, safePosition.y + step);
        break;
    }

    updatePosition(newPosition);
  }, [safePosition, updatePosition, bannerSelected._id]);

  const resetPosition = useCallback(() => {
    if (!bannerSelected._id) {
      console.error('No banner selected');
      return;
    }
    updatePosition(DEFAULT_POSITION);
  }, [updatePosition, bannerSelected._id]);

  // Validación de banner seleccionado
  if (!bannerSelected._id) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No hay banner seleccionado para ajustar la posición.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium">Posición del Banner</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetPosition} 
          className="h-8 px-2" 
          title="Centrar banner"
        >
          <Maximize2 className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Centrar</span>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="position-x">Posición Horizontal</Label>
            <span className="text-sm text-slate-500 font-medium">{Math.round(safePosition.x)}%</span>
          </div>
          <Slider 
            id="position-x" 
            min={MIN_POSITION} 
            max={MAX_POSITION} 
            step={1} 
            value={[safePosition.x]} 
            onValueChange={handleXChange}
            className="cursor-pointer"
          />
          <div className="flex justify-between gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => moveStep("left")} 
              className="flex-1 h-8"
              disabled={safePosition.x <= MIN_POSITION}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Izquierda</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => moveStep("right")} 
              className="flex-1 h-8"
              disabled={safePosition.x >= MAX_POSITION}
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Derecha</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="position-y">Posición Vertical</Label>
            <span className="text-sm text-slate-500 font-medium">{Math.round(safePosition.y)}%</span>
          </div>
          <Slider 
            id="position-y" 
            min={MIN_POSITION} 
            max={MAX_POSITION} 
            step={1} 
            value={[safePosition.y]} 
            onValueChange={handleYChange}
            className="cursor-pointer"
          />
          <div className="flex justify-between gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => moveStep("up")} 
              className="flex-1 h-8"
              disabled={safePosition.y <= MIN_POSITION}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Arriba</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => moveStep("down")} 
              className="flex-1 h-8"
              disabled={safePosition.y >= MAX_POSITION}
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Abajo</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
        💡 También puedes arrastrar directamente el banner en la vista previa
      </div>
    </div>
  )
}

