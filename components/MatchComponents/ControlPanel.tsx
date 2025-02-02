"use client"

import { Tabs } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import './styles.scss';
import { TabControlPanel } from "./ControlPanel/TabControlPanel";
import { TabContentScore } from "./ControlPanel/Score";
import { TabContentMatchTime } from "./ControlPanel/TabContentMatchTime";
import { TabTeamSetup } from "./TeamManagement";
import { TabMatchEvents } from "./MatchEventsAndSubs";
import { TabMatchCustomize } from "./ControlPanel/TabMatchCustomize";
import { useMatchStore } from "@/matchStore/matchStore";
import { useTimeStore } from "@/matchStore/useTime";
import { useEffect } from "react";
import socket from "@/app/service/socket";

export function ControlPanel() {

  const { id: matchId } = useMatchStore()
  const { resetMatch } = useTimeStore()

  useEffect(() => {
    // Escuchar actualizaciones del servidor
    socket.on(`@server:resetMatch${matchId}`, () => {
      resetMatch(false);
    });

    return () => {
      socket.off(`@server:resetMatch`);
    };
  }, [matchId, resetMatch]);
  
  return (
    <Card className="w-full bg-[#1a1625]">
      <Tabs defaultValue="score" className="w-full text-white">
        <TabControlPanel />
      
        <TabContentScore  />
        <TabContentMatchTime />
        <TabTeamSetup />
        <TabMatchEvents />
        <TabMatchCustomize />
      </Tabs>
    </Card>
  )
}



      
     
    

      

    

      

    

      

    