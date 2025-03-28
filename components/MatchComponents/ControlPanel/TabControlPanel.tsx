import { TabsList, TabsTrigger } from '../../ui/tabs'

export function TabControlPanel() {
  return (
    <TabsList className="w-full justify-start bg-transparent border-b rounded-none h-12 overflow-auto">
      <TabsTrigger value="score" className="tab_panel">
        Score
      </TabsTrigger>
      <TabsTrigger value="match-time" className="tab_panel">
        Match Time
      </TabsTrigger>
      <TabsTrigger value="team-setup" className="tab_panel">
        Team Setup
      </TabsTrigger>
      <TabsTrigger value="match-events" className="tab_panel">
        Match Events
      </TabsTrigger>
      <TabsTrigger value="customize" className="tab_panel">
        Customize
      </TabsTrigger>
      <TabsTrigger value="overlays" className="tab_panel">
        Overlays
      </TabsTrigger>
    </TabsList>
  )
}
