import { TabsContent } from '../../ui/tabs'
import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { useTimeStore } from '@/matchStore/useTime'
import { useMatchStore } from '@/matchStore/matchStore'
import { useEffect, useState } from 'react'
import socket from '@/app/service/socket'
import { TimeFootball } from '@/matchStore/interfaces'
import { Plus, TimerReset } from 'lucide-react'

export function TabContentMatchTime() {
  const { time, period, updateMinutes, updatePeriod, startMatch, pauseMatch, resetMatch, updateSeconds, updateStoppage, updateTime,  } = useTimeStore()
  const activePeriod = period.find((p) => p.active)?.name || '1st Half'
  const { id: matchId } = useMatchStore()

  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {

    if (matchId) {
      socket.emit("@client:joinMatchRoom", matchId);

      // Escuchar actualizaciones del servidor
      socket.on("@server:timeUpdate", (serverTime: TimeFootball) => {

        let firstTimeExit = time.seconds + 1 >= 60 && time.minutes + 1 >= (45 + time.stoppage) && activePeriod === '1st Half'
        let secondTimeExit = time.seconds + 1 >= 60 && time.minutes + 1 >= (90 + time.stoppage) && activePeriod === '2nd Half'

        if (firstTimeExit) {
          pauseMatch()
        }

        if (secondTimeExit) {
          pauseMatch()
        }

        if (!firstTimeExit && !secondTimeExit) {
          updateTime(serverTime);
        }

      });
    }

    return () => {
      socket.off("@server:timeUpdate");
    };
  }, [matchId, updateTime]);

  return (
    <TabsContent value="match-time" className="p-4 space-y-4">
      <div className="space-y-4">
        <div>
          <Label>Minutes</Label>
          <div className="flex items-center gap-4">
          <Label>{time.minutes}</Label>
            <Input
              type="number"
              value={minutes}
              onChange={(e) =>
                setMinutes(Number.parseInt(e.target.value) || 0)
              }
              className="bg-[#2a2438]"
            />
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateMinutes({ minutes: minutes })}
              className="bg-[#2a2438] hover:bg-[#352d47] w-44 px-2"
            >
              <TimerReset className="h-4 w-4" />
              Ajustar temporizador
            </Button>
          </div>
        </div>
        <div>
          <Label>Seconds</Label>
          <div className="flex items-center gap-2">
            <Label>{time.seconds}</Label>
            <Input
              type="number"
              value={seconds}
              onChange={(e) =>
                setSeconds(Number.parseInt(e.target.value) || 0 )
              }
              className="bg-[#2a2438]"
            />
          <Button
              variant="outline"
              size="icon"
              onClick={() => updateSeconds({ seconds: minutes })}
              className="bg-[#2a2438] hover:bg-[#352d47] w-44 px-2"
            >
              <TimerReset className="h-4 w-4" />
              Ajustar temporizador
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
            onClick={() => resetMatch(true)}
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
