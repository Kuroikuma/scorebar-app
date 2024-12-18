"use client"

import { ControlPanel } from "./control-panel"
import { CustomizePanel } from "./customize-panel"
import { TabsLayout } from "./tabs-layout"
import { ClassicScoreboard } from "./classic-scoreboard"
import { ModernScoreboard } from "./modern-scoreboard"
import { useUIStore } from "@/store/uiStore"
import { cn } from "@/lib/utils"

export default function BaseballScoreboard() {
  return (
    <div>
      <div className="max-[768px]:hidden">
        <BaseballScoreboardDestok />
      </div>
      <div className="min-[768px]:hidden">
        <BaseballScoreboardMovil />
      </div>
    </div>
  )
}

const  BaseballScoreboardDestok = () => {
 
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

const BaseballScoreboardMovil = () => {
 
  const { activeTab, scoreboardStyle } = useUIStore()

  return (
    <div className="h-screen bg-black p-4 font-['Roboto_Condensed'] flex flex-col">
      {/* Scoreboard */}
      <div className="flex-shrink-0 mb-4">
        {scoreboardStyle === "classic" ? (
          <ClassicScoreboard />
        ) : (
          <ModernScoreboard />
        )}
      </div>

      {/* Side Panel */}

      <TabsLayout />
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className={cn(
            "w-full md:w-1/2 lg:w-1/3 md:mt-0 md:ml-4 transition-all duration-300 ease-in-out overflow-y-auto",
            "md:order-2",
            "flex-1"
          )}>
            {activeTab === "controls" && <ControlPanel />}
            {activeTab === "customize" && <CustomizePanel />}
          </div>
      </div>
    </div>
  )
}

