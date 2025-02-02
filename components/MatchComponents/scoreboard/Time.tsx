import socket from '@/app/service/socket'
import { TimeFootball } from '@/matchStore/interfaces'
import { useMatchStore } from '@/matchStore/matchStore'
import { useTimeStore } from '@/matchStore/useTime'
import { useCallback, useEffect, useRef } from 'react'

export function Time() {

  const { updateTime, time, updateTimeOverlays } = useTimeStore()

  const { id: matchId } = useMatchStore()
  

  // const updateMatchTime = useCallback(() => {

  //   if (time.seconds + 1 >= 60) {
  //     updateTime({
  //       minutes: time.minutes + 1,
  //       seconds: 0,
  //     })
  //   } else {
  //     updateTime({
  //       minutes: time.minutes,
  //       seconds: time.seconds + 1,
  //     })
  //   }
  // }, [time.minutes, time.seconds, updateTime])

  // const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // useEffect(() => {
  //   let interval: NodeJS.Timeout

  //   if (time.isRunning) {
  //     interval = setInterval(updateMatchTime, 1000)
  //   }
    
  //   return () => clearInterval(interval)
  // }, [time.isRunning, updateMatchTime])

  // useEffect(() => {
  //   if (time.isRunning) {
  //     intervalRef.current = setInterval(updateMatchTime, 1000)
  //   } else if (intervalRef.current) {
  //     clearInterval(intervalRef.current)
  //     intervalRef.current = null
  //   }

  //   return () => {
  //     if (intervalRef.current) {
  //       clearInterval(intervalRef.current)
  //     }
  //   }
  // }, [time.isRunning, updateMatchTime])

  // useEffect(() => {
  //   const eventName = `server:UpdateTime/${id}`

  //   const updateScorebugClassic = (socketData: Partial<TimeFootball>) => {
  //     updateTimeOverlays(socketData)
  //   }

  //   socket.on(eventName, updateScorebugClassic)

  //   return () => {
  //     socket.off(eventName, updateScorebugClassic)
  //   }
  // }, [id])

  useEffect(() => {
    // Unirse a la sala del partido
    socket.emit("@client:joinMatchRoom", matchId);

    // Escuchar actualizaciones del servidor
    socket.on("@server:timeUpdate", (serverTime: TimeFootball) => {
      updateTime(serverTime);
    });

    return () => {
      socket.off("@server:timeUpdate");
    };
  }, [matchId, updateTime]);


  const formatTime = (minutes: number, seconds: number) => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`
  }

  return (
    <div className="flex flex-col items-end justify-start gap-1">
      <div
        className="flex items-center h-[50px] justify-center bg-white text-2xl font-bold px-4 "
        style={{ color: '#00003d' }}
      >
        {formatTime(time.minutes, time.seconds)}
      </div>
      {time.stoppage > 0 && (
        <div
          className="flex items-center flex-1 h-[50%] bg-white text-2xl px-3 font-bold"
          style={{ color: '#00003d' }}
        >
          +{time.stoppage}
        </div>
      )}
    </div>
  )
}
