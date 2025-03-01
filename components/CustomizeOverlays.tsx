import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Minus, Plus, Clipboard } from 'lucide-react'
import { Input } from './ui/input'
import { IOverlays, useGameStore } from '@/app/store/gameStore'
import { Label } from './ui/label'
import { Switch } from './ui/switch'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'
import { toast } from 'sonner'

interface CustomizeOverlayProps {
  overlay: IOverlays
}

interface TabsLayoutProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const CustomizeOverlays = () => {
  const {  scorebugOverlay, scoreboardOverlay, scoreboardMinimalOverlay, formationAOverlay, formationBOverlay, playerStatsOverlay, id } = useGameStore()
  const [ activeTab, setActiveTab ] = useState<string>("Marc.")

  const copyToClipboard = async (): Promise<void> => {
    try {
      let overlaURL = `https://scoreboard-app-pi.vercel.app/overlay/game/${id}`
      await navigator.clipboard.writeText(overlaURL);
      toast.info("Overlay URL copiado al portapapeles");
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
    }
  };

  return (
    <Card className="bg-[#1a1625] border-[#2d2b3b] text-white">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-lg font-medium">Customize Overlay</CardTitle>
          <Button variant="ghost" onClick={() => copyToClipboard()}>
            <Clipboard className="h-4 w-4" />
            Copiar Overlay
          </Button>
        </div>
        <TabsLayout activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "Marc." && <CustomizeOverlay overlay={scorebugOverlay} />}
        {activeTab === "M. x Inn." && <CustomizeOverlay overlay={scoreboardOverlay} />}
        {activeTab === "Marc. Min" && <CustomizeOverlay overlay={scoreboardMinimalOverlay} />}
        {activeTab === "Eq. A" && <CustomizeOverlay overlay={formationAOverlay} />}
        {activeTab === "Eq. B" && <CustomizeOverlay overlay={formationBOverlay} />}
        {activeTab === "Player Stats" && <CustomizeOverlay overlay={playerStatsOverlay} />}
      </CardHeader>
    </Card>
  )
}

const CustomizeOverlay = ({ overlay: overaly }: CustomizeOverlayProps) => {
  const { handlePositionOverlay, handleScaleOverlay, handleVisibleOverlay } = useGameStore()
  return (
    <>
      {/* Position Controls */}
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm text-white font-semibold">
            Mostrar Overlay
          </Label>
          <Switch
            className="data-[state=checked]:bg-[#4c3f82]"
            checked={overaly.visible}
            onCheckedChange={(checked) =>
              handleVisibleOverlay(overaly.id, checked)
            }
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-white font-semibold">
            Posición horizontal
          </Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
              onClick={() =>
                handlePositionOverlay(overaly.id, {
                  x: Math.max(0, overaly.x - 1),
                  y: overaly.y,
                })
              }
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              className="w-20 bg-[#2d2b3b] border-0 text-center"
              value={overaly.x}
              onChange={(e) =>
                handlePositionOverlay(overaly.id, {
                  x: Number(e.target.value),
                  y: overaly.y,
                })
              }
            />
            <Button
              variant="outline"
              size="icon"
              className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
              onClick={() =>
                handlePositionOverlay(overaly.id, {
                  x: Math.max(0, overaly.x + 1),
                  y: overaly.y,
                })
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-white font-semibold">
            Posición vertical
          </Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
              onClick={() =>
                handlePositionOverlay(overaly.id, {
                  x: overaly.x,
                  y: Math.max(0, overaly.y - 1),
                })
              }
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              className="w-20 bg-[#2d2b3b] border-0 text-center"
              value={overaly.y}
              onChange={(e) =>
                handlePositionOverlay(overaly.id, {
                  x: overaly.x,
                  y: Number(e.target.value),
                })
              }
            />
            <Button
              variant="outline"
              size="icon"
              className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
              onClick={() =>
                handlePositionOverlay(overaly.id, {
                  x: overaly.x,
                  y: overaly.y + 1,
                })
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-white font-semibold">
            Escala del Overlay
          </Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
              onClick={() =>
                handleScaleOverlay(overaly.id, Math.max(0, overaly.y - 1))
              }
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              className="w-20 bg-[#2d2b3b] border-0 text-center"
              value={overaly.scale}
              onChange={(e) =>
                handleScaleOverlay(overaly.id, Number(e.target.value))
              }
            />
            <Button
              variant="outline"
              size="icon"
              className="bg-[#2d2b3b] hover:bg-[#363447] border-0"
              onClick={() => handleScaleOverlay(overaly.id, overaly.y + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export function TabsLayout({ activeTab, setActiveTab }: TabsLayoutProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-3 overflow-scroll">
      <TabsList className="bg-[#1a1625] border-b border-[#2d2b3b] max-[768px]:h-16">
        <TabsTrigger
          value="Marc."
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white  h-11 flex items-center justify-center"
        >
         Marc.
        </TabsTrigger>
        <TabsTrigger
          value="M. x Inn."
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white h-11 flex items-center justify-center"
        >
          M. x Inn.
        </TabsTrigger>
        <TabsTrigger
          value="Marc. Min"
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white  h-11 flex items-center justify-center"
        >
          Marc. Min
        </TabsTrigger>
        <TabsTrigger
          value="Eq. A"
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white  h-11 flex items-center justify-center"
        >
          Eq. A
        </TabsTrigger>
        <TabsTrigger
          value="Eq. B"
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white  h-11 flex items-center justify-center"
        >
          Eq. B
        </TabsTrigger>
        <TabsTrigger
          value="Player Stats"
          className="flex-1 data-[state=active]:bg-[#4C3F82] data-[state=active]:text-white  h-11 flex items-center justify-center"
        >
          Player Stats
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default CustomizeOverlays
