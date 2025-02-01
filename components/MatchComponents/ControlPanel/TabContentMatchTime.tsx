import { TabsContent } from '../../ui/tabs'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { useTimeStore } from '@/matchStore/useTime'

export function TabContentMatchTime() {
  const { time, period, updateMinutes, updatePeriod, startMatch, pauseMatch, resetMatch, updateSeconds, updateStoppage } = useTimeStore()

  return (
    <TabsContent value="match-time" className="p-4 space-y-4">
      <div className="space-y-4">
        <div>
          <Label>Minutes</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={time.minutes}
              onChange={(e) =>
                updateMinutes({ minutes: Number.parseInt(e.target.value) || 0 })
              }
              className="bg-[#2a2438]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                updateMinutes({ minutes: Math.max(0, time.minutes - 1) })
              }
              className="bg-[#2a2438] hover:bg-[#352d47]"
            >
              -
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateMinutes({ minutes: time.minutes + 1 })}
              className="bg-[#2a2438] hover:bg-[#352d47]"
            >
              +
            </Button>
          </div>
        </div>
        <div>
          <Label>Seconds</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={time.seconds}
              onChange={(e) =>
                updateSeconds({ seconds: Number.parseInt(e.target.value) || 0 })
              }
              className="bg-[#2a2438]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                updateSeconds({ seconds: Math.max(0, time.seconds - 1) })
              }
              className="bg-[#2a2438] hover:bg-[#352d47]"
            >
              -
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                updateSeconds({ seconds: Math.min(59, time.seconds + 1) })
              }
              className="bg-[#2a2438] hover:bg-[#352d47]"
            >
              +
            </Button>
          </div>
        </div>
        <div>
          <Label>Added Minutes</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={time.stoppage}
              onChange={(e) =>
                updateStoppage({ stoppage: Number.parseInt(e.target.value) || 0 })
              }
              className="bg-[#2a2438]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                updateStoppage({ stoppage: Math.max(0, time.stoppage - 1) })
              }
              className="bg-[#2a2438] hover:bg-[#352d47]"
            >
              -
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateStoppage({ stoppage: time.stoppage + 1 })}
              className="bg-[#2a2438] hover:bg-[#352d47]"
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => (time.isRunning ? pauseMatch() : startMatch())}
            className="bg-[#2a2438] hover:bg-[#352d47]"
          >
            {time.isRunning ? 'Pause' : 'Play'}
          </Button>
          <Button
            variant="outline"
            onClick={resetMatch}
            className="bg-[#2a2438] hover:bg-[#352d47]"
          >
            Reset
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Period</Label>
          <div className="flex gap-2">
            {period.map((p) => (
              <Button
                key={p.name}
                variant={p.active ? 'default' : 'outline'}
                onClick={() => updatePeriod(p.name)}
                className={
                  p.active ? 'bg-[#ff5722]' : 'bg-[#2a2438] hover:bg-[#352d47]'
                }
              >
                {p.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </TabsContent>
  )
}
