'use client';

import { useMemo } from "react"
import ControlPanel from "./ControlPanel"
import PositionControl from "./PositionControl"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Type, Layers, Move, Sparkles, Users, AlertCircle, Edit3 } from "lucide-react"
import { useBannerStore } from "@/app/store/useBannerStore"
import { useSponsorStore } from "@/app/store/useSponsor"
import { ISponsor } from "@/app/types/sponsor"
import { IBannerSettings } from "@/app/types/Banner"
import { Alert, AlertDescription } from "@/components/ui/alert"

type TabValue = "sponsors" | "design" | "colors" | "fields" | "animation" | "position";

interface TabConfig {
  value: TabValue;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS_CONFIG: TabConfig[] = [
  { value: "sponsors", label: "Sponsors", icon: Users },
  { value: "design", label: "Diseño", icon: Layers },
  { value: "colors", label: "Colores", icon: Palette },
  { value: "fields", label: "Campos", icon: Type },
  { value: "animation", label: "Animación", icon: Sparkles },
  { value: "position", label: "Posición", icon: Move },
];

export default function BannerControlPanel() {
  const { updateSponsor, updateSettings, bannerSelected } = useBannerStore()
  const { sponsors } = useSponsorStore()
  const { sponsorId, bannerSettingsId } = bannerSelected

  // Validación y extracción segura de datos
  const sponsor = useMemo(() => {
    if (!sponsorId) return null;
    return typeof sponsorId === 'string' ? null : sponsorId;
  }, [sponsorId]);

  const settings = useMemo(() => {
    if (!bannerSettingsId) return null;
    return typeof bannerSettingsId === 'string' ? null : bannerSettingsId;
  }, [bannerSettingsId]);

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
        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-blue-500" />
          Panel de Control
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          Personaliza todos los aspectos de tu banner publicitario
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="sponsors" className="w-full">
          <TabsList className="w-full rounded-none border-b grid grid-cols-6 h-auto">
            {TABS_CONFIG.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
              >
                <Icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {TABS_CONFIG.slice(0, -1).map(({ value }) => (
            <TabsContent key={value} value={value} className="p-6">
              <ControlPanel
                sponsor={sponsor}
                sponsors={sponsors}
                updateSponsor={updateSponsor}
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

