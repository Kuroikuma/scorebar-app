"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUIStore } from "@/app/store/uiStore"

export function TabsLayout() {
  const { activeTab, setActiveTab } = useUIStore()
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-3 overflow-scroll">
      <TabsList className="bg-[#1a1625] border-b border-[#2d2b3b] max-[768px]:h-16">
        <TabsTrigger
          value="controls"
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white  h-11 flex items-center justify-center"
        >
          Baseball Scorebug
        </TabsTrigger>
        <TabsTrigger
          value="customize"
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white h-11 flex items-center justify-center"
        >
          Customize
        </TabsTrigger>
        <TabsTrigger
          value="lineup"
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white  h-11 flex items-center justify-center"
        >
          Lineup
        </TabsTrigger>
        <TabsTrigger
          value="status"
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white  h-11 flex items-center justify-center min-[768px]:hidden"
        >
          Status
        </TabsTrigger>
        <TabsTrigger
          value="overlays"
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white  h-11 flex items-center justify-center"
        >
          Personalizar Overlays
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

