"use client"

import { ControlPanel } from "./control-panel"
import { CustomizePanel } from "./customize-panel"
import { TabsLayout } from "./tabs-layout"
import { ClassicScoreboard } from "./classic-scoreboard"
import { ModernScoreboard } from "./modern-scoreboard"
import { useUIStore } from "@/store/uiStore"

export default function BaseballScoreboard() {
 
  const { activeTab, scoreboardStyle } = useUIStore()

  return (
    <div className="min-h-screen bg-black md:p-4 font-['Roboto_Condensed'] flex max-[768px]:flex-col pt-4 pb-4">
      {/* Scoreboard */}
      <div className="flex-1 max-w-[400px] md:mx-auto bg-black text-white max-[768px]:px-4">
        {scoreboardStyle === "classic" ? (
          <ClassicScoreboard />
        ) : (
          <ModernScoreboard />
        )}
      </div>

      {/* Side Panel */}
      <div className="w-[350px] ml-4">
        <TabsLayout />
        {activeTab === "controls" ? (
          <ControlPanel />
        ) : activeTab === "customize" ? (
          <CustomizePanel />
        ) : null}
      </div>
    </div>
  )
}

