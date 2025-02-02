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

export function ControlPanel() {
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



      
     
    

      

    

      

    

      

    