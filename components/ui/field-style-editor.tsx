"use client"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColorPicker } from "@/components/ui/color-picker"
import { GradientEditor } from "@/components/ui/gradient-editor"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import { FieldStyleConfig, GradientStop, GradientType } from "@/app/types/Banner"
import { cn } from "@/app/lib/utils"

interface FieldStyleEditorProps {
  fieldName: string
  settings: FieldStyleConfig
  onChange: (settings: Partial<FieldStyleConfig>) => void
  onReset: () => void
  className?: string
  globalTextColor: string
}

export function FieldStyleEditor({
  fieldName,
  settings,
  onChange,
  onReset,
  className,
  globalTextColor,
}: FieldStyleEditorProps) {
  // Font weights
  const fontWeights = [
    { name: "Heredado", value: "inherit" },
    { name: "Thin (100)", value: "100" },
    { name: "Extra Light (200)", value: "200" },
    { name: "Light (300)", value: "300" },
    { name: "Regular (400)", value: "400" },
    { name: "Medium (500)", value: "500" },
    { name: "Semi Bold (600)", value: "600" },
    { name: "Bold (700)", value: "700" },
    { name: "Extra Bold (800)", value: "800" },
    { name: "Black (900)", value: "900" },
  ]

  // Font sizes
  const fontSizes = [
    { name: "Heredado", value: "inherit" },
    { name: "Muy pequeño", value: "0.75rem" },
    { name: "Pequeño", value: "0.875rem" },
    { name: "Normal", value: "1rem" },
    { name: "Medio", value: "1.125rem" },
    { name: "Grande", value: "1.25rem" },
    { name: "Muy grande", value: "1.5rem" },
    { name: "Extra grande", value: "1.875rem" },
  ]

  // Handle text gradient toggle
  const handleGradientToggle = (enabled: boolean) => {
    if (enabled && !settings.gradient) {
      // Initialize gradient settings if enabling for the first time
      onChange({
        useGradient: true,
        gradient: {
          type: GradientType.linear,
          angle: 135,
          stops: [
            { color: "#f59e0b", position: 0 },
            { color: "#ef4444", position: 100 },
          ],
        },
      })
    } else {
      onChange({ useGradient: enabled })
    }
  }

  // Handle gradient settings change
  const handleGradientChange = (updates: {
    stops?: GradientStop[]
    type?: GradientType
    angle?: number
  }) => {
    if (!settings.gradient) return

    onChange({
      gradient: {
        ...settings.gradient,
        ...updates,
      },
    })
  }

  // Check if using custom color
  const isUsingCustomColor = !!settings.color

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">{fieldName}</h3>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Restablecer
        </Button>
      </div>

      {/* Color customization */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={`use-custom-color-${fieldName}`} className="cursor-pointer">
            Usar color personalizado
          </Label>
          <Switch
            id={`use-custom-color-${fieldName}`}
            checked={isUsingCustomColor}
            onCheckedChange={(checked) => {
              if (checked) {
                onChange({ color: globalTextColor })
              } else {
                onChange({ color: undefined })
              }
            }}
          />
        </div>

        {isUsingCustomColor && (
          <div className="flex gap-3 items-center mt-2">
            <ColorPicker color={settings.color || globalTextColor} onChange={(color) => onChange({ color })} />
            <div className="text-sm">Color personalizado para este campo</div>
          </div>
        )}
      </div>

      {/* Font weight */}
      <div className="space-y-2">
        <Label>Grosor de fuente</Label>
        <Select
          value={settings.fontWeight || "inherit"}
          onValueChange={(value) => onChange({ fontWeight: value === "inherit" ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar grosor" />
          </SelectTrigger>
          <SelectContent>
            {fontWeights.map((weight) => (
              <SelectItem key={weight.value} value={weight.value}>
                <span style={{ fontWeight: weight.value === "inherit" ? "inherit" : weight.value }}>{weight.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font size */}
      <div className="space-y-2">
        <Label>Tamaño de fuente</Label>
        <Select
          value={settings.fontSize || "inherit"}
          onValueChange={(value) => onChange({ fontSize: value === "inherit" ? undefined : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tamaño" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Text gradient toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor={`use-gradient-${fieldName}`} className="cursor-pointer">
          Usar gradiente en texto
        </Label>
        <Switch
          id={`use-gradient-${fieldName}`}
          checked={settings.useGradient || false}
          onCheckedChange={handleGradientToggle}
        />
      </div>

      {/* Text gradient editor (when enabled) */}
      {settings.useGradient && settings.gradient && (
        <div className="p-3 border rounded-md space-y-3 bg-slate-50 dark:bg-slate-900">
          <Label>Gradiente de texto</Label>
          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
            <p
              className="text-2xl font-bold text-center py-2"
              style={{
                fontWeight: settings.fontWeight || "bold",
                backgroundImage: `linear-gradient(${settings.gradient.angle}deg, ${settings.gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {fieldName}
            </p>
          </div>
          <GradientEditor
            stops={settings.gradient.stops}
            type={settings.gradient.type}
            angle={settings.gradient.angle}
            onChange={handleGradientChange}
          />
        </div>
      )}

      {/* Preview */}
      <div className="p-3 border rounded-md">
        <Label className="block mb-2">Vista previa</Label>
        <div className="p-3 bg-white dark:bg-slate-800 rounded border">
          <p
            style={{
              fontWeight: settings.fontWeight || "inherit",
              fontSize: settings.fontSize || "inherit",
              color: settings.color || globalTextColor,
              ...(settings.useGradient && settings.gradient
                ? {
                    backgroundImage: `linear-gradient(${settings.gradient.angle}deg, ${settings.gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }
                : {}),
            }}
          >
            Texto de ejemplo para {fieldName}
          </p>
        </div>
      </div>
    </div>
  )
}

