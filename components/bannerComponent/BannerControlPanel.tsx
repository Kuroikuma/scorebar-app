import ControlPanel from "./ControlPanel"
import PositionControl from "./PositionControl"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Palette, Type, Layers, Move, Sparkles, Users } from "lucide-react"
import { useBannerStore } from "@/app/store/useBannerStore"
import { useSponsorStore } from "@/app/store/useSponsor"
import { ISponsor } from "@/app/types/sponsor"
import { IBannerSettings } from "@/app/types/Banner"

export default function BannerControlPanel() {
  const { updateSponsor, updateSettings, bannerSelected } = useBannerStore()
  const { sponsors } = useSponsorStore()
  const {sponsorId, bannerSettingsId } = bannerSelected

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b">
        <CardTitle className="text-xl font-semibold text-slate-800 dark:text-white flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-500"
          >
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          Panel de Control
        </CardTitle>
        <CardDescription className="text-slate-500 dark:text-slate-400">
          Personaliza todos los aspectos de tu banner publicitario
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="sponsors" className="w-full">
          <TabsList className="w-full rounded-none border-b grid grid-cols-6 h-auto">
            <TabsTrigger
              value="sponsors"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <Users className="w-4 h-4 mr-2" />
              Sponsors
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <Layers className="w-4 h-4 mr-2" />
              Diseño
            </TabsTrigger>
            <TabsTrigger
              value="colors"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <Palette className="w-4 h-4 mr-2" />
              Colores
            </TabsTrigger>
            <TabsTrigger
              value="fields"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <Type className="w-4 h-4 mr-2" />
              Campos
            </TabsTrigger>
            <TabsTrigger
              value="animation"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Animación
            </TabsTrigger>
            <TabsTrigger
              value="position"
              className="py-3 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800"
            >
              <Move className="w-4 h-4 mr-2" />
              Posición
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sponsors" className="p-6">
            <ControlPanel
              sponsor={sponsorId as ISponsor}
              sponsors={sponsors}
              updateSponsor={updateSponsor}
              settings={bannerSettingsId as IBannerSettings}
              onUpdateSettings={updateSettings}
              activeTab="sponsors"
            />
          </TabsContent>
          <TabsContent value="design" className="p-6">
            <ControlPanel
              sponsor={sponsorId as ISponsor}
              sponsors={sponsors}
              updateSponsor={updateSponsor}
              settings={bannerSettingsId as IBannerSettings}
              onUpdateSettings={updateSettings}
              activeTab="design"
            />
          </TabsContent>
          <TabsContent value="colors" className="p-6">
            <ControlPanel
              sponsor={sponsorId as ISponsor}
              sponsors={sponsors}
              updateSponsor={updateSponsor}
              settings={bannerSettingsId as IBannerSettings}
              onUpdateSettings={updateSettings}
              activeTab="colors"
            />
          </TabsContent>
          <TabsContent value="fields" className="p-6">
            <ControlPanel
             sponsor={sponsorId as ISponsor}
             sponsors={sponsors}
             updateSponsor={updateSponsor}
             settings={bannerSettingsId as IBannerSettings}
             onUpdateSettings={updateSettings}
              activeTab="fields"
            />
          </TabsContent>
          <TabsContent value="animation" className="p-6">
            <ControlPanel
              sponsor={sponsorId as ISponsor}
              sponsors={sponsors}
              updateSponsor={updateSponsor}
              settings={bannerSettingsId as IBannerSettings}
              onUpdateSettings={updateSettings}
              activeTab="animation"
            />
          </TabsContent>
          <TabsContent value="position" className="p-6">
            <PositionControl />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

