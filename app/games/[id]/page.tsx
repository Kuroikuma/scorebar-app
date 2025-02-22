"use client"

import { ControlPanel } from "../../../components/control-panel"
import { CustomizePanel } from "../../../components/customize-panel"
import { TabsLayout } from "../../../components/tabs-layout"
import { ClassicScoreboard } from "../../../components/classic-scoreboard"
import { ModernScoreboard } from "../../../components/modern-scoreboard"
import { useUIStore } from "@/app/store/uiStore"
import { cn } from "@/app/lib/utils"
import { useEffect, useState } from "react"
import { useGameStore } from "@/app/store/gameStore"
import { useAuth } from "@/app/context/AuthContext"
import { useParams } from "next/navigation"
import { ToggleOverlays } from "@/components/toogleOverlays"
import { LineupPanel } from "@/components/lineup-panel"
import { useTeamsStore } from "@/app/store/teamsStore"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { StatusGame } from "@/components/statusGame"
import { Navigation } from "@/components/navigation"
import { EnhancedRunsTable } from "@/components/overlay/enhanced-runs-table"
import CustomizeOverlays from "@/components/CustomizeOverlays"

export default function BaseballScoreboard() {

  const { user, loading } = useAuth();
  const paramas = useParams();
  const id = paramas?.id as string;

  const [gameId, setGameId] = useState<string | null>(id);

  const { loadGame } = useGameStore()


  useEffect(() => {
    if (user && id) {
      loadGame(id);
      setGameId(id);
    }
  }, [user, gameId, loadGame, setGameId, loading, paramas, id]);

   if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <></>;
  }

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
    <div className="min-h-screen md:p-4 font-['Roboto_Condensed'] flex max-[768px]:flex-col pt-4 pb-4">
      {/* <Navigation /> */}
      {/* Scoreboard */}

      <div className="flex-1 max-w-[400px] md:mx-auto max-[768px]:px-4 flex flex-col">
        {scoreboardStyle === "classic" && (
          <ClassicScoreboard />
        )}
        {scoreboardStyle === "modern" && (
          <ModernScoreboard />
        )}
        <StatusGame />
      </div>  

      {/* Side Panel */}
      <div className="w-[350px] ml-4">
        <TabsLayout />
        {activeTab === "controls" && <ControlPanel />}
        {activeTab === "customize" && <CustomizePanel />}
        {activeTab === "lineup" && <LineupPanel />}
        {activeTab === 'overlays' && <CustomizeOverlays />}
      </div>
    </div>
  )
}

const BaseballScoreboardMovil = () => {
 
  const { activeTab, scoreboardStyle } = useUIStore()

  return (
    <div className="h-screen p-4 font-['Roboto_Condensed'] flex flex-col">
      {/* Scoreboard */}
      <div className="flex-shrink-0">
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
            {activeTab === "lineup" && <LineupPanel />}
            {activeTab === 'status' && <StatusGame />}
            {activeTab === 'overlays' && <CustomizeOverlays />}
          </div>
      </div>
    </div>
  )
}

