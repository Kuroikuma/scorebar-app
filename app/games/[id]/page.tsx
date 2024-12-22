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
    return null;
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

  const { getCurrentBatter, getCurrentPitcher, status, startGame, endGame } = useGameStore()
  const { teams } = useTeamsStore()
  const { activeTab, scoreboardStyle } = useUIStore()
 
  const currentBatter = getCurrentBatter()
  const currentPitcher = getCurrentPitcher()
  const isLineupComplete = teams[0].lineupSubmitted && teams[1].lineupSubmitted

  return (
    <div className="min-h-screen bg-black md:p-4 font-['Roboto_Condensed'] flex max-[768px]:flex-col pt-4 pb-4">
      {/* Scoreboard */}
      <div className="flex-1 max-w-[400px] md:mx-auto bg-black text-white max-[768px]:px-4 flex flex-col">
        {scoreboardStyle === "classic" && (
          <ClassicScoreboard />
        )}
        {scoreboardStyle === "modern" && (
          <ModernScoreboard />
        )}
        <div className="bg-gray-800 p-4 rounded-md mb-4 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Game Status: {status}</h2>
          {status === 'upcoming' && isLineupComplete && (
            <Button onClick={startGame} className="bg-green-500 hover:bg-green-600">
              Start Game
            </Button>
          )}
          {status === 'in_progress' && (
            <Button onClick={endGame} className="bg-red-500 hover:bg-red-600">
              End Game
            </Button>
          )}
        </div>
      </div>
      {!isLineupComplete && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lineup no completado</AlertTitle>
          <AlertDescription>
          Por favor, asegúrese de que ambos equipos tienen al menos 9 jugadores en su alineación antes de comenzar el partido.
          </AlertDescription>
        </Alert>
      )}
      {status === 'in_progress' && (
        <div className="bg-gray-800 p-4 rounded-md mb-4 text-white">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold">Current Batter</h3>
              <p>{currentBatter ? `${currentBatter.name} (#${currentBatter.number})` : 'N/A'}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Current Pitcher</h3>
              <p>{currentPitcher ? `${currentPitcher.name} (#${currentPitcher.number})` : 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
      </div>  

      {/* Side Panel */}
      <div className="w-[350px] ml-4">
        <TabsLayout />
        <ToggleOverlays />
        {activeTab === "controls" && <ControlPanel />}
        {activeTab === "customize" && <CustomizePanel />}
        {activeTab === "lineup" && <LineupPanel />}
      </div>
    </div>
  )
}

const BaseballScoreboardMovil = () => {
 
  const { activeTab, scoreboardStyle } = useUIStore()

  return (
    <div className="h-screen bg-black p-4 font-['Roboto_Condensed'] flex flex-col">
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
          </div>
      </div>
      <ToggleOverlays />
    </div>
  )
}

