"use client"

import { useEffect, useCallback } from "react"
import { Tabs } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import './styles.scss';
import { useTimeStore } from "@/matchStore/useTime"
import { TabControlPanel } from "./ControlPanel/TabControlPanel";
import { TabContentScore } from "./ControlPanel/Score";
import { TabContentMatchTime } from "./ControlPanel/TabContentMatchTime";
import { TabTeamSetup } from "./TeamManagement";
import { TabMatchEvents } from "./MatchEventsAndSubs";
import { TabMatchCustomize } from "./ControlPanel/TabMatchCustomize";

export function ControlPanel() {
  const { time, updateTime, period, pauseMatch } = useTimeStore()
  const activePeriod = period.find((p) => p.active)?.name || '1st Half'

  const updateMatchTime = useCallback(() => {
    if (time.seconds + 1 >= 60 && time.minutes + 1 >= (45 + time.stoppage) && activePeriod === '1st Half') {
      pauseMatch()
    }

    if (time.seconds + 1 >= 60 && time.minutes + 1 >= (90 + time.stoppage) && activePeriod === '2nd Half') {
      pauseMatch()
    }

    if (time.seconds + 1 >= 60) {
      updateTime({
        minutes: time.minutes + 1,
        seconds: 0,
      })
    } else {
      updateTime({
        minutes: time.minutes,
        seconds: time.seconds + 1,
      })
    }
  }, [time.minutes, time.seconds, updateTime])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (time.isRunning) {
      interval = setInterval(updateMatchTime, 1000)
    }
    return () => clearInterval(interval)
  }, [time.isRunning, updateMatchTime])

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



      
     
    

      

    

      

    

      

    