"use client"
import { useState, useEffect } from "react"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Info, AlertCircle, Eye, EyeOff, Search, RotateCcw } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Añadir importación del nuevo componente
import { ISponsor, SponsorBanner } from "@/app/types/sponsor"
import { AnimationType, EasingType, FieldAnimationConfig, FieldAnimationType, FieldStyleConfig, GradientStop, GradientType, IBannerSettings, LowerThirdDesign } from "@/app/types/Banner"
import { ColorPicker } from "../ui/color-picker"
import { GradientEditor } from "../ui/gradient-editor"
import { TypographyEditor } from "../ui/typography-editor"
import { FieldStyleEditor } from "../ui/field-style-editor"
import { defaultFieldStyles } from "@/app/store/useBannerStore"

// Añadir sponsors, updateSponsor y activeTab a los props
interface ControlPanelProps {
  sponsor: ISponsor
  sponsors: ISponsor[]
  updateSponsor: (sponsorId: string) => Promise<void>
  settings: IBannerSettings
  onUpdateSettings: (settings: IBannerSettings) => Promise<void>
  activeTab: string
}

export default function ControlPanel({
  sponsor,
  sponsors,
  updateSponsor,
  settings,
  onUpdateSettings,
  activeTab,
}: ControlPanelProps) {
  const [selectedField, setSelectedField] = useState<keyof SponsorBanner | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const selectedSponsorId = sponsor._id
  

  const handleSponsorChange = async (sponsorId: string) => {
    await updateSponsor(sponsorId)
  }

  const handleFieldToggle = (field: keyof SponsorBanner) => {
    onUpdateSettings({
      ...settings,
      displayFields: settings.displayFields.includes(field)
        ? settings.displayFields.filter((f) => f !== field)
        : [...settings.displayFields, field],
    })
  }

  const handleAnimationChange = (key: string, value: any) => {
    onUpdateSettings ({
      ...settings,
      animationSettings: {
        ...settings.animationSettings,
        [key]: value,
      },
    })
  }

  const handleFieldAnimationChange = (key: string, value: any) => {

    const prev = settings

    onUpdateSettings({
      ...prev,
      animationSettings: {
        ...prev.animationSettings,
        fieldAnimations: {
          ...prev.animationSettings.fieldAnimations,
          defaultConfig: {
            ...prev.animationSettings.fieldAnimations.defaultConfig,
            [key]: value,
          },
        },
      },
    })
  }

  const handlePerFieldAnimationChange = (field: keyof SponsorBanner, key: keyof FieldAnimationConfig, value: any) => {

    const prev = settings

    onUpdateSettings({
      ...prev,
      animationSettings: {
        ...prev.animationSettings,
        fieldAnimations: {
          ...prev.animationSettings.fieldAnimations,
          perFieldConfig: {
            ...prev.animationSettings.fieldAnimations.perFieldConfig,
            [field]: {
              ...prev.animationSettings.fieldAnimations.perFieldConfig[field],
              [key]: value,
            },
          },
        },
      },
    })
  }

  const handleStyleChange = (key: string, value: string) => {

    const prev = settings

    onUpdateSettings({
      ...prev,
      styleSettings: { ...prev.styleSettings, [key]: value },
    })
  }

  function mapSponsorToBanner(sponsor: ISponsor): SponsorBanner {
    const { name, logo, link, ad, phone, address, owner, email } = sponsor;
    return { name, logo, link, ad, phone, address, owner, email };
  }

  const handleGradientChange = (updates: {
    stops?: GradientStop[];
    type?: GradientType;
    angle?: number;
}) => {
    const prev = settings
    
    onUpdateSettings({
      ...prev,
      styleSettings: {
        ...prev.styleSettings,
        gradient: {
          ...(prev.styleSettings.gradient || {
            type: GradientType.linear,
            angle: 135,
            stops: [
              { color: prev.styleSettings.backgroundColor, position: 0 },
              {
                color: prev.styleSettings.gradientColor || prev.styleSettings.backgroundColor,
                position: 100,
              },
            ],
          }),
          ...updates,
        },
      },
    })
  }

  const handleFieldStyleChange = (fieldStyleUpdates: Partial<FieldStyleConfig>) => {
    if (!selectedField) return;
    
    const currentFieldStyles = settings.styleSettings.fieldStyles || defaultFieldStyles;
    
    onUpdateSettings({
      ...settings,
      styleSettings: {
        ...settings.styleSettings,
        fieldStyles: {
          ...currentFieldStyles,
          [selectedField]: {
            ...(currentFieldStyles[selectedField] || {}),  // Add any existing custom styles
            ...fieldStyleUpdates  // Add new updates
          }
        }
      }
    });
  };

  const handleFieldsStyleReset = () => {

    if (!selectedField) return;

    const prev = settings

    const newFieldStyles = { ...prev.styleSettings.fieldStyles }
    
    if (newFieldStyles) {
      delete newFieldStyles[selectedField]
    }

    onUpdateSettings({
      ...prev,
      styleSettings: {
        ...prev.styleSettings,
        //@ts-ignore
        fieldStyles: newFieldStyles,
      },
    })
  }

  // Filtrar sponsors según el término de búsqueda
  const filteredSponsors = sponsors.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Diseños con imágenes de previsualización
  const designPreviews: Record<LowerThirdDesign, string> = {
    classic: "/placeholder.svg?height=120&width=200&text=Classic",
    modern: "/placeholder.svg?height=120&width=200&text=Modern",
    minimal: "/placeholder.svg?height=120&width=200&text=Minimal",
    elegant: "/placeholder.svg?height=120&width=200&text=Elegant",
    playful: "/placeholder.svg?height=120&width=200&text=Playful",
    sports: "/placeholder.svg?height=120&width=200&text=Sports",
    contact: "/placeholder.svg?height=120&width=200&text=Contact",
    flipCard: "/placeholder.svg?height=120&width=200&text=FlipCard",
  }

  // Nombres de diseños en español
  const designNames: Record<LowerThirdDesign, string> = {
    classic: "Clásico",
    modern: "Moderno",
    minimal: "Minimalista",
    elegant: "Elegante",
    playful: "Divertido",
    sports: "Deportes",
    contact: "Contacto",
    flipCard: "Tarjeta 3D",
  }

  // Nombres de animaciones en español
  const animationNames: Record<AnimationType, string> = {
    fadeIn: "Desvanecer",
    slideIn: "Deslizar",
    zoomIn: "Zoom",
    bounceIn: "Rebotar",
    rotateIn: "Rotar",
    slideUp: "Deslizar arriba",
    slideDown: "Deslizar abajo",
    flipIn: "Voltear",
    expandIn: "Expandir",
    blurIn: "Desenfocar",
    flipCard: "Voltear 3D",
  }

  // Nombres de easing en español
  const easingNames: Record<EasingType, string> = {
    linear: "Lineal",
    easeOut: "Suavizado final",
    easeIn: "Suavizado inicial",
    easeInOut: "Suavizado completo",
    circIn: "Circular inicial",
    circOut: "Circular final",
    circInOut: "Circular completo",
    backIn: "Retroceso inicial",
    backOut: "Retroceso final",
    backInOut: "Retroceso completo",
    anticipate: "Anticipado",
    bounce: "Rebote",
  }

  // Nombres de animaciones de campo en español
  const fieldAnimationNames: Record<FieldAnimationType, string> = {
    none: "Ninguna",
    fadeIn: "Desvanecer",
    slideIn: "Deslizar",
    typewriter: "Máquina de escribir",
    scaleIn: "Escalar",
    blurIn: "Desenfocar",
    flipIn: "Voltear",
    bounceIn: "Rebotar",
    zoomIn: "Zoom",
  }

  // Nombres de campos en español
  const fieldNames: Record<keyof SponsorBanner, string> = {
    name: "Nombre",
    logo: "Logo",
    link: "Enlace",
    ad: "Anuncio",
    phone: "Teléfono",
    address: "Dirección",
    owner: "Propietario",
    email: "Correo",
  }

  // Descripciones de campos
  const fieldDescriptions: Record<keyof SponsorBanner, string> = {
    name: "Nombre del sponsor o empresa",
    logo: "Logotipo o imagen representativa",
    link: "Enlace al sitio web",
    ad: "Texto publicitario o eslogan",
    phone: "Número de teléfono de contacto",
    address: "Dirección física",
    owner: "Nombre del propietario o responsable",
    email: "Correo electrónico de contacto",
  }

  // Renderizar el contenido según el tab activo
  if (activeTab === "sponsors") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">Seleccionar Sponsor</h3>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar sponsor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <RadioGroup value={selectedSponsorId} onValueChange={handleSponsorChange} className="space-y-3">
            {filteredSponsors.length > 0 ? (
              filteredSponsors.map((s) => (
                <div
                  key={s._id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                    selectedSponsorId === s._id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <RadioGroupItem value={s._id} id={`sponsor-${s._id}`} />
                  <Label htmlFor={`sponsor-${s._id}`} className="flex flex-1 items-center cursor-pointer">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                        <img src={s.logo || "/placeholder.svg"} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-900 dark:text-slate-100">{s.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{s.email}</div>
                      </div>
                      {selectedSponsorId === s._id && (
                        <Badge
                          variant="outline"
                          className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        >
                          Seleccionado
                        </Badge>
                      )}
                    </div>
                  </Label>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No se encontraron sponsors que coincidan con la búsqueda
              </div>
            )}
          </RadioGroup>

          {selectedSponsorId && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Detalles del Sponsor</h4>
              <div className="space-y-2">
                {Object.entries(sponsors.find((s) => s._id === selectedSponsorId) || {})
                  .filter(([key]) => key === "name" || key === "link" || key === "ad" || key === "phone" || key === "address" || key === "owner" || key === "email")
                  .map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 w-24">
                        {fieldNames[key as keyof SponsorBanner] || key}:
                      </span>
                      <span className="text-sm text-slate-800 dark:text-slate-200 flex-1">{String(value)}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (activeTab === "design") {
    return (
      <div>
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">Estilo del Banner</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(Object.keys(designPreviews) as LowerThirdDesign[]).map((design) => (
              <div key={design} className="relative">
                <input
                  type="radio"
                  id={`design-${design}`}
                  name="design"
                  value={design}
                  checked={settings.styleSettings.design === design}
                  onChange={() => handleStyleChange("design", design)}
                  className="sr-only peer"
                />
                <label
                  htmlFor={`design-${design}`}
                  className="block cursor-pointer rounded-lg overflow-hidden border-2 transition-all peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-500/30 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                >
                  <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={designPreviews[design] || "/placeholder.svg"}
                      alt={designNames[design]}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-700 text-center">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                      {designNames[design]}
                    </span>
                  </div>
                </label>
                {settings.styleSettings.design === design && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Los cambios se aplican automáticamente en tiempo real
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === "colors") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">Colores y Tipografía</h3>

          <Tabs defaultValue="colors">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="colors" className="flex-1">
                Colores
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex-1">
                Tipografía
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="backgroundType" className="flex items-center gap-1">
                  Tipo de fondo
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Elige entre un color sólido o un degradado para el fondo del banner</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Select
                  value={settings.styleSettings.backgroundType}
                  onValueChange={(value) => handleStyleChange("backgroundType", value)}
                >
                  <SelectTrigger id="backgroundType">
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Sólido</SelectItem>
                    <SelectItem value="gradient">Gradiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {settings.styleSettings.backgroundType === "solid" ? (
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor" className="flex items-center gap-1">
                    Color de fondo
                  </Label>
                  <div className="flex gap-3 items-center">
                    <ColorPicker
                      color={settings.styleSettings.backgroundColor}
                      onChange={(color) => handleStyleChange("backgroundColor", color)}
                    />
                    <Input
                      type="text"
                      value={settings.styleSettings.backgroundColor}
                      onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-900">
                    <h4 className="text-sm font-medium mb-3">Editor de gradiente</h4>
                    <GradientEditor
                      stops={
                        settings.styleSettings.gradient?.stops || [
                          { color: settings.styleSettings.backgroundColor, position: 0 },
                          {
                            color: settings.styleSettings.gradientColor || settings.styleSettings.backgroundColor,
                            position: 100,
                          },
                        ]
                      }
                      type={settings.styleSettings.gradient?.type || GradientType.linear}
                      angle={settings.styleSettings.gradient?.angle || 135}
                      onChange={handleGradientChange}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="textColor" className="flex items-center gap-1">
                  Color de texto principal
                </Label>
                <div className="flex gap-3 items-center">
                  <ColorPicker
                    color={settings.styleSettings.textColor}
                    onChange={(color) => handleStyleChange("textColor", color)}
                  />
                  <Input
                    type="text"
                    value={settings.styleSettings.textColor}
                    onChange={(e) => handleStyleChange("textColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Vista previa de colores */}
              <div className="mt-6 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium mb-3">Vista previa de colores</h4>
                <div className="flex gap-3 flex-wrap">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-md shadow-sm"
                      style={{ backgroundColor: settings.styleSettings.backgroundColor }}
                    ></div>
                    <span className="text-xs mt-1">Principal</span>
                  </div>

                  {settings.styleSettings.backgroundType === "gradient" && (
                    <div className="flex flex-col items-center">
                      <div
                        className="w-12 h-12 rounded-md shadow-sm"
                        style={{
                          background: settings.styleSettings.gradient
                            ? `linear-gradient(${settings.styleSettings.gradient.angle}deg, ${settings.styleSettings.gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`
                            : `linear-gradient(135deg, ${settings.styleSettings.backgroundColor}, ${settings.styleSettings.gradientColor || settings.styleSettings.backgroundColor})`,
                        }}
                      ></div>
                      <span className="text-xs mt-1">Gradiente</span>
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-md shadow-sm flex items-center justify-center"
                      style={{
                        background:
                          settings.styleSettings.backgroundType === "gradient"
                            ? settings.styleSettings.gradient
                              ? `linear-gradient(${settings.styleSettings.gradient.angle}deg, ${settings.styleSettings.gradient.stops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`
                              : `linear-gradient(135deg, ${settings.styleSettings.backgroundColor}, ${settings.styleSettings.gradientColor || settings.styleSettings.backgroundColor})`
                            : settings.styleSettings.backgroundColor,
                      }}
                    >
                      <span
                        style={{
                          color: settings.styleSettings.textColor,
                          fontFamily: settings.styleSettings.typography?.family || settings.styleSettings.fontFamily,
                          fontWeight: settings.styleSettings.typography?.weight || "normal",
                        }}
                      >
                        Aa
                      </span>
                    </div>
                    <span className="text-xs mt-1">Combinado</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-md shadow-sm flex items-center justify-center bg-white dark:bg-slate-800">
                      <span
                        style={{
                          color: settings.styleSettings.textColor,
                          fontFamily: settings.styleSettings.typography?.family || settings.styleSettings.fontFamily,
                          fontWeight: settings.styleSettings.typography?.weight || "normal",
                        }}
                      >
                        Aa
                      </span>
                    </div>
                    <span className="text-xs mt-1">Texto</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-6">
              <TypographyEditor
                settings={
                  settings.styleSettings.typography || {
                    family: settings.styleSettings.fontFamily,
                    weight: "500",
                    letterSpacing: "normal",
                    lineHeight: "1.5",
                    useGradient: false,
                  }
                }
                onChange={(typographyUpdates) => {
                  const prev = settings
                  onUpdateSettings({
                    ...prev,
                    styleSettings: {
                      ...prev.styleSettings,
                      // Update fontFamily for backward compatibility
                      fontFamily:
                        typographyUpdates.family ||
                        prev.styleSettings.typography?.family ||
                        prev.styleSettings.fontFamily,
                      typography: {
                        ...(prev.styleSettings.typography || {
                          family: prev.styleSettings.fontFamily,
                          weight: "500",
                          letterSpacing: "normal",
                          lineHeight: "1.5",
                          useGradient: false,
                        }),
                        ...typographyUpdates,
                      },
                    },
                  })
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Los cambios se aplican automáticamente en tiempo real
          </div>
        </div>
      </div>
    )
  }

  // Añadir una nueva pestaña para la personalización de campos
  if (activeTab === "fields") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-4">Campos a mostrar</h3>

          <Tabs defaultValue="visibility">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="visibility" className="flex-1">
                Visibilidad
              </TabsTrigger>
              <TabsTrigger value="styles" className="flex-1">
                Estilos por campo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="visibility" className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Selecciona los campos que deseas mostrar en el banner. Puedes activar o desactivar campos según tus
                    necesidades.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(Object.keys(mapSponsorToBanner(sponsor)) as (keyof SponsorBanner)[])
                  .filter((field) => field !== "logo")   
                  .map((field) => (
                    <div
                      key={field}
                      className={`flex items-center p-4 rounded-lg border transition-colors ${
                        settings.displayFields.includes(field)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700"
                          : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{fieldNames[field]}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-3.5 h-3.5 text-slate-400 ml-1" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{fieldDescriptions[field]}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate max-w-md">
                          {String(sponsor[field])}
                        </p>
                      </div>

                      <div className="flex items-center ml-4">
                        <Switch
                          checked={settings.displayFields.includes(field)}
                          onCheckedChange={() => handleFieldToggle(field)}
                          className="data-[state=checked]:bg-blue-600"
                        />
                        <span className="ml-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                          {settings.displayFields.includes(field) ? (
                            <span className="flex items-center text-blue-600 dark:text-blue-400">
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Visible
                            </span>
                          ) : (
                            <span className="flex items-center text-slate-500 dark:text-slate-500">
                              <EyeOff className="w-3.5 h-3.5 mr-1" />
                              Oculto
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Logo</h4>
                  <Switch
                    checked={settings.displayFields.includes("logo")}
                    onCheckedChange={() => handleFieldToggle("logo")}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </div>

                {sponsor.logo && (
                  <div className="mt-3 flex items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 mr-3">
                      <img src={sponsor.logo || "/placeholder.svg"} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {settings.displayFields.includes("logo")
                        ? "El logo se mostrará en el banner"
                        : "El logo está oculto actualmente"}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Orden de los campos</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Los campos se mostrarán en el orden en que aparecen en esta lista. Arrastra para reordenar.
                </p>

                {settings.displayFields.length > 0 ? (
                  <div className="space-y-2">
                    {settings.displayFields.map((field, index) => (
                      <div
                        key={field}
                        className="flex items-center p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700"
                      >
                        <div className="w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded mr-2 text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium text-sm">{fieldNames[field]}</span>
                        <div className="ml-auto flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            disabled={index === 0}
                            onClick={() => {
                              const newFields = [...settings.displayFields]
                              ;[newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]]
                              const prev = settings
                              onUpdateSettings({
                                ...prev,
                                displayFields: newFields,
                              })
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m18 15-6-6-6 6" />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            disabled={index === settings.displayFields.length - 1}
                            onClick={() => {
                              const newFields = [...settings.displayFields]
                              ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
                              const prev = settings
                              onUpdateSettings({
                                ...prev,
                                displayFields: newFields,
                              })
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                    No hay campos seleccionados para mostrar
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="styles" className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Personaliza el estilo de cada campo individualmente. Puedes cambiar el color, tamaño, grosor y
                    aplicar gradientes a cada campo.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Selecciona un campo para personalizar
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {

                      const prev = settings

                      onUpdateSettings({
                        ...prev,
                        styleSettings: {
                          ...prev.styleSettings,
                          fieldStyles: prev.styleSettings.fieldStyles,
                        },
                      })
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restablecer todos
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {Object.keys(fieldNames)
                    .filter((field) => field !== "id")
                    .map((field) => (
                      <Button
                        key={field}
                        type="button"
                        variant={selectedField === field ? "default" : "outline"}
                        size="sm"
                        className="justify-start"
                        onClick={() => setSelectedField(field as keyof SponsorBanner)}
                      >
                        <span className="truncate">{fieldNames[field as keyof SponsorBanner]}</span>
                        {settings.styleSettings.fieldStyles &&
                          settings.styleSettings.fieldStyles[field as keyof SponsorBanner] && (
                            <Badge variant="secondary" className="ml-auto text-xs">
                              Personalizado
                            </Badge>
                          )}
                      </Button>
                    ))}
                </div>

                {selectedField && (
                  <div className="border rounded-md p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                    <FieldStyleEditor
                      fieldName={fieldNames[selectedField as keyof SponsorBanner]}
                      settings={settings.styleSettings.fieldStyles?.[selectedField as keyof SponsorBanner] || {}}
                      onChange={handleFieldStyleChange}
                      onReset={handleFieldsStyleReset}
                      globalTextColor={settings.styleSettings.textColor}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">
            Los cambios se aplican automáticamente en tiempo real
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === "animation") {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-slate-800 dark:text-white mb4">Configuración de animación</h3>

        <Accordion type="single" collapsible defaultValue="main">
          <AccordionItem value="main">
            <AccordionTrigger className="text-base font-medium">Animación principal</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <Label htmlFor="animationType">Tipo de animación</Label>
                  <Select
                    value={settings.animationSettings.type}
                    onValueChange={(value) => handleAnimationChange("type", value as AnimationType)}
                  >
                    <SelectTrigger id="animationType">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(animationNames).map(([key, name]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="duration">Duración (segundos)</Label>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {settings.animationSettings.duration}s
                    </span>
                  </div>
                  <Slider
                    id="duration"
                    min={0.1}
                    max={2}
                    step={0.1}
                    value={[settings.animationSettings.duration]}
                    onValueChange={(value) => handleAnimationChange("duration", value[0])}
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Rápido (0.1s)</span>
                    <span>Lento (2.0s)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label htmlFor="delay">Retraso (segundos)</Label>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {settings.animationSettings.delay}s
                    </span>
                  </div>
                  <Slider
                    id="delay"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[settings.animationSettings.delay]}
                    onValueChange={(value) => handleAnimationChange("delay", value[0])}
                  />
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Sin retraso (0s)</span>
                    <span>Retraso máximo (1s)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="easing">Función de aceleración</Label>
                  <Select
                    value={settings.animationSettings.easing}
                    onValueChange={(value) => handleAnimationChange("easing", value as EasingType)}
                  >
                    <SelectTrigger id="easing">
                      <SelectValue placeholder="Selecciona una función" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(easingNames).map(([key, name]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                    <div
                      className="h-full bg-blue-500/20 dark:bg-blue-500/40 rounded-md"
                      style={{
                        width: "100%",
                        backgroundImage: `url('/placeholder.svg?height=32&width=300&text=${settings.animationSettings.easing}')`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="fields">
            <AccordionTrigger className="text-base font-medium">Animación de campos</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="fieldAnimationsEnabled" className="cursor-pointer">
                    Activar animaciones de campos
                  </Label>
                  <Switch
                    id="fieldAnimationsEnabled"
                    checked={settings.animationSettings.fieldAnimations.enabled}
                    onCheckedChange={(checked) => handleFieldAnimationChange("enabled", checked)}
                  />
                </div>

                {settings.animationSettings.fieldAnimations.enabled && (
                  <>
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Configuración por campo
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          Personalizado
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {Object.keys(fieldNames)
                          .filter((field) => field !== "id")
                          .map((field) => (
                            <Button
                              key={field}
                              type="button"
                              variant={selectedField === field ? "default" : "outline"}
                              size="sm"
                              className="justify-start"
                              onClick={() => setSelectedField(field as keyof SponsorBanner)}
                            >
                              <span className="truncate">{fieldNames[field as keyof SponsorBanner]}</span>
                              {settings.displayFields.includes(field as keyof SponsorBanner) && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  Activo
                                </Badge>
                              )}
                            </Button>
                          ))}
                      </div>

                      {selectedField && (
                        <div className="border rounded-md p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
                          <div className="flex justify-between items-center">
                            <h5 className="font-medium">Animación para: {fieldNames[selectedField]}</h5>
                            {!settings.displayFields.includes(selectedField) && (
                              <Badge variant="outline" className="text-xs text-yellow-600 dark:text-yellow-400">
                                Campo no visible
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="fieldType">Tipo de animación</Label>
                            <Select
                              value={
                                settings.animationSettings.fieldAnimations.perFieldConfig[selectedField]?.type || "none"
                              }
                              onValueChange={(value) =>
                                handlePerFieldAnimationChange(selectedField, "type", value as FieldAnimationType)
                              }
                            >
                              <SelectTrigger id="fieldType">
                                <SelectValue placeholder="Selecciona un tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(fieldAnimationNames).map(([key, name]) => (
                                  <SelectItem key={key} value={key}>
                                    {name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label htmlFor="fieldDuration">Duración (segundos)</Label>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {settings.animationSettings.fieldAnimations.perFieldConfig[selectedField]?.duration ||
                                  0.3}
                                s
                              </span>
                            </div>
                            <Slider
                              id="fieldDuration"
                              min={0.1}
                              max={1}
                              step={0.1}
                              value={[
                                settings.animationSettings.fieldAnimations.perFieldConfig[selectedField]?.duration ||
                                  0.3,
                              ]}
                              onValueChange={(value) =>
                                handlePerFieldAnimationChange(selectedField, "duration", value[0])
                              }
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label htmlFor="fieldDelay">Retraso (segundos)</Label>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {settings.animationSettings.fieldAnimations.perFieldConfig[selectedField]?.delay || 0}s
                              </span>
                            </div>
                            <Slider
                              id="fieldDelay"
                              min={0}
                              max={1}
                              step={0.1}
                              value={[
                                settings.animationSettings.fieldAnimations.perFieldConfig[selectedField]?.delay || 0,
                              ]}
                              onValueChange={(value) => handlePerFieldAnimationChange(selectedField, "delay", value[0])}
                            />
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="fieldEasing">Función de aceleración</Label>
                            <Select
                              value={
                                settings.animationSettings.fieldAnimations.perFieldConfig[selectedField]?.easing ||
                                "easeOut"
                              }
                              onValueChange={(value) =>
                                handlePerFieldAnimationChange(selectedField, "easing", value as EasingType)
                              }
                            >
                              <SelectTrigger id="fieldEasing">
                                <SelectValue placeholder="Selecciona una función" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(easingNames).map(([key, name]) => (
                                  <SelectItem key={key} value={key}>
                                    {name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      <Separator className="my-4" />

                      <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                          Configuración predeterminada
                        </h4>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                          Esta configuración se aplicará a los campos que no tengan una configuración personalizada.
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-3">
                            <Label htmlFor="defaultType">Tipo de animación predeterminado</Label>
                            <Select
                              value={settings.animationSettings.fieldAnimations.defaultConfig.type}
                              onValueChange={(value) => handleFieldAnimationChange("type", value as FieldAnimationType)}
                            >
                              <SelectTrigger id="defaultType">
                                <SelectValue placeholder="Selecciona un tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(fieldAnimationNames).map(([key, name]) => (
                                  <SelectItem key={key} value={key}>
                                    {name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label htmlFor="defaultDuration">Duración predeterminada (segundos)</Label>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {settings.animationSettings.fieldAnimations.defaultConfig.duration}s
                              </span>
                            </div>
                            <Slider
                              id="defaultDuration"
                              min={0.1}
                              max={1}
                              step={0.1}
                              value={[settings.animationSettings.fieldAnimations.defaultConfig.duration]}
                              onValueChange={(value) => handleFieldAnimationChange("duration", value[0])}
                            />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <Label htmlFor="staggerAmount">Intervalo entre campos (segundos)</Label>
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {settings.animationSettings.fieldAnimations.defaultConfig.staggerAmount}s
                              </span>
                            </div>
                            <Slider
                              id="staggerAmount"
                              min={0}
                              max={0.5}
                              step={0.05}
                              value={[settings.animationSettings.fieldAnimations.defaultConfig.staggerAmount]}
                              onValueChange={(value) => handleFieldAnimationChange("staggerAmount", value[0])}
                            />
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                              <span>Simultáneo (0s)</span>
                              <span>Secuencial (0.5s)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  }

  return null
}

