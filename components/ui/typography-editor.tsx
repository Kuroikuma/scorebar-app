"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GradientEditor } from "@/components/ui/gradient-editor"
import { FontSettings, GradientStop, GradientType } from "@/app/types/Banner"
import { cn } from "@/app/lib/utils"

interface TypographyEditorProps {
  settings: FontSettings
  onChange: (settings: Partial<FontSettings>) => void
  className?: string
}

export function TypographyEditor({ settings, onChange, className }: TypographyEditorProps) {
  // Font families grouped by category
  const fontFamilies = {
    "Sans-serif": [
      { name: "Inter", value: "'Inter', sans-serif" },
      { name: "Poppins", value: "'Poppins', sans-serif" },
      { name: "Montserrat", value: "'Montserrat', sans-serif" },
      { name: "Roboto", value: "'Roboto', sans-serif" },
      { name: "Open Sans", value: "'Open Sans', sans-serif" },
    ],
    Serif: [
      { name: "Playfair Display", value: "'Playfair Display', serif" },
      { name: "Merriweather", value: "'Merriweather', serif" },
      { name: "Georgia", value: "'Georgia', serif" },
      { name: "Lora", value: "'Lora', serif" },
      { name: "Baskerville", value: "'Baskerville', serif" },
    ],
    Monospace: [
      { name: "Roboto Mono", value: "'Roboto Mono', monospace" },
      { name: "Fira Code", value: "'Fira Code', monospace" },
      { name: "Source Code Pro", value: "'Source Code Pro', monospace" },
      { name: "Courier New", value: "'Courier New', monospace" },
    ],
    Display: [
      { name: "Bebas Neue", value: "'Bebas Neue', cursive" },
      { name: "Pacifico", value: "'Pacifico', cursive" },
      { name: "Lobster", value: "'Lobster', cursive" },
      { name: "Comfortaa", value: "'Comfortaa', cursive" },
    ],
  }

  // Font weights
  const fontWeights = [
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

  // Handle text gradient toggle
  const handleGradientToggle = (enabled: boolean) => {
    if (enabled && !settings.textGradient) {
      // Initialize gradient settings if enabling for the first time
      onChange({
        useGradient: true,
        textGradient: {
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
    if (!settings.textGradient) return

    onChange({
      textGradient: {
        ...settings.textGradient,
        ...updates,
      },
    })
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Font family selection */}
      <div className="space-y-2">
        <Label>Familia tipográfica</Label>
        <Select value={settings.family} onValueChange={(value) => onChange({ family: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar fuente" />
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {Object.entries(fontFamilies).map(([category, fonts]) => (
              <React.Fragment key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">{category}</div>
                {fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </SelectItem>
                ))}
                <div className="h-px my-1 bg-slate-100 dark:bg-slate-800" />
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font weight */}
      <div className="space-y-2">
        <Label>Grosor de fuente</Label>
        <Select value={settings.weight} onValueChange={(value) => onChange({ weight: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar grosor" />
          </SelectTrigger>
          <SelectContent>
            {fontWeights.map((weight) => (
              <SelectItem key={weight.value} value={weight.value}>
                <span style={{ fontWeight: weight.value }}>{weight.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Letter spacing */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Espaciado entre letras</Label>
          <span className="text-sm text-slate-500">{settings.letterSpacing}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Slider
            value={[Number.parseFloat(settings.letterSpacing) || 0]}
            min={-0.05}
            max={0.5}
            step={0.01}
            onValueChange={(value) => onChange({ letterSpacing: value[0].toString() })}
          />
          <Select value={settings.letterSpacing} onValueChange={(value) => onChange({ letterSpacing: value })}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Espaciado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="-0.05em">Compacto</SelectItem>
              <SelectItem value="0.05em">Amplio</SelectItem>
              <SelectItem value="0.1em">Muy amplio</SelectItem>
              <SelectItem value="0.2em">Expandido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Line height */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Altura de línea</Label>
          <span className="text-sm text-slate-500">{settings.lineHeight}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Slider
            value={[Number.parseFloat(settings.lineHeight) || 1]}
            min={0.8}
            max={2}
            step={0.1}
            onValueChange={(value) => onChange({ lineHeight: value[0].toString() })}
          />
          <Select value={settings.lineHeight} onValueChange={(value) => onChange({ lineHeight: value })}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Altura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Normal</SelectItem>
              <SelectItem value="0.8">Compacto</SelectItem>
              <SelectItem value="1.2">Cómodo</SelectItem>
              <SelectItem value="1.5">Amplio</SelectItem>
              <SelectItem value="2">Doble</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Text gradient toggle */}
      <div className="flex items-center justify-between">
        <Label htmlFor="use-gradient" className="cursor-pointer">
          Usar gradiente en texto
        </Label>
        <Switch id="use-gradient" checked={settings.useGradient} onCheckedChange={handleGradientToggle} />
      </div>

      {/* Text gradient editor (when enabled) */}
      {settings.useGradient && settings.textGradient && (
        <div className="p-3 border rounded-md space-y-3 bg-slate-50 dark:bg-slate-900">
          <Label>Gradiente de texto</Label>
          <div className="p-3 bg-white dark:bg-slate-800 rounded border">
            <p
              className="text-2xl font-bold text-center py-2"
              style={{
                fontFamily: settings.family,
                fontWeight: settings.weight,
                letterSpacing: settings.letterSpacing,
                lineHeight: settings.lineHeight,
                backgroundImage: `linear-gradient(${settings.textGradient.angle}deg, ${settings.textGradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Vista previa de texto
            </p>
          </div>
          <GradientEditor
            stops={settings.textGradient.stops}
            type={settings.textGradient.type}
            angle={settings.textGradient.angle}
            onChange={handleGradientChange}
          />
        </div>
      )}

      {/* Preview */}
      <div className="p-3 border rounded-md">
        <Label className="block mb-2">Vista previa</Label>
        <div
          className="p-3 bg-white dark:bg-slate-800 rounded border"
          style={{
            fontFamily: settings.family,
            fontWeight: settings.weight,
            letterSpacing: settings.letterSpacing,
            lineHeight: settings.lineHeight,
          }}
        >
          <p className="text-lg">Texto de ejemplo</p>
          <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.</p>
        </div>
      </div>
    </div>
  )
}

