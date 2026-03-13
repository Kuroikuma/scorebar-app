'use client';

import { useMemo, useState } from "react"
import ImprovedControlPanel from "./ImprovedControlPanel"
import PositionControl from "./PositionControl"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Type, Layers, Move, Sparkles, Users, AlertCircle, Edit3 } from "lucide-react"
import { useBannerStore } from "@/app/store/useBannerStore"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

type TabValue = "sponsors" | "design" | "colors" | "animation" | "fields" | "position";

interface TabConfig {
  value: TabValue;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const TABS_CONFIG: TabConfig[] = [
  { 
    value: "sponsors", 
    label: "Sponsor", 
    icon: Users,
    description: "Selecciona el sponsor a mostrar"
  },
  { 
    value: "design", 
    label: "Diseño", 
    icon: Layers,
    description: "Elige el estilo visual del banner"
  },
  { 
    value: "colors", 
    label: "Colores", 
    icon: Palette,
    description: "Personaliza la paleta de colores"
  },
  { 
    value: "animation", 
    label: "Animación", 
    icon: Sparkles,
    description: "Configura efectos de entrada"
  },
  { 
    value: "fields", 
    label: "Campos", 
    icon: Type,
    description: "Configura qué información mostrar"
  },
  { 
    value: "position", 
    label: "Posición", 
    icon: Move,
    description: "Ajusta la ubicación del banner"
  },
];

export default function BannerControlPanel() {
  const { updateSettings, bannerSelected } = useBannerStore()
  const { sponsorId, bannerSettingsId } = bannerSelected
  const [activeTab, setActiveTab] = useState<TabValue>("design");

  // Validación y extracción segura de datos
  const sponsor = useMemo(() => {
    if (!sponsorId) return null;
    return typeof sponsorId === 'string' ? null : sponsorId;
  }, [sponsorId]);

  const settings = useMemo(() => {
    if (!bannerSettingsId) return null;
    return typeof bannerSettingsId === 'string' ? null : bannerSettingsId;
  }, [bannerSettingsId]);

  const currentTabConfig = TABS_CONFIG.find(t => t.value === activeTab);

  // Validación de datos requeridos
  if (!sponsor || !settings) {
    return (
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
          <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-blue-500" />
            Panel de Control
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            Personaliza todos los aspectos de tu banner publicitario
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {!sponsor && !settings 
                ? "No hay datos de banner disponibles. Selecciona un sponsor y configura el banner."
                : !sponsor 
                ? "No hay sponsor seleccionado. Por favor, selecciona un sponsor."
                : "No hay configuración de banner disponible. Por favor, configura el banner."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-500" />
              Panel de Control
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 mt-1">
              {currentTabConfig?.description || "Personaliza tu banner publicitario"}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Modo Simplificado
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full">
          <TabsList className="w-full rounded-none border-b grid grid-cols-3 sm:grid-cols-6 h-auto">
            {TABS_CONFIG.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 flex-col sm:flex-row gap-1"
              >
                <Icon className="w-4 h-4 sm:mr-2" />
                <span className="text-xs sm:text-sm">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {TABS_CONFIG.slice(0, -1).map(({ value }) => (
            <TabsContent key={value} value={value} className="p-6">
              <ImprovedControlPanel
                sponsor={sponsor}
                settings={settings}
                onUpdateSettings={updateSettings}
                activeTab={value}
              />
            </TabsContent>
          ))}
          
          <TabsContent value="position" className="p-6">
            <PositionControl />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

